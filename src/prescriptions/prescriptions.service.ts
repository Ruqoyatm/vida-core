import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Prescription } from './prescription.entity.js';
import { PrescriptionItem } from './prescription-item.entity.js';
import { Product } from '../products/product.entity.js';
import { Encounter } from '../encounters/encounter.entity.js';
import { PrescriptionStatus } from './prescription-status.enum.js';
import { DrugRoute } from './drug-route.enum.js';
import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private itemsRepository: Repository<PrescriptionItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Encounter)
    private encountersRepository: Repository<Encounter>,
    private auditService: AuditService,
  ) {}

  private blockedByAllergy(allergies: string | null, product: Product) {
    if (!allergies) return false;

    const known = allergies.toLowerCase();

    if (
      product.allergyClass &&
      known.includes(product.allergyClass.toLowerCase())
    ) {
      return true;
    }

    return known.includes(product.name.toLowerCase());
  }

  async findByEncounter(encounterId: string) {
    return this.prescriptionsRepository.find({
      where: { encounterId },
      relations: { items: true },
      order: { prescribedAt: 'DESC' },
    });
  }

  async create(
    encounterId: string,
    data: {
      items: {
        productId: string;
        dose: string;
        route: DrugRoute;
        frequency: string;
        duration: string;
        quantity: number;
      }[];
    },
    doctorId: string,
  ) {
    const encounter = await this.encountersRepository.findOne({
      where: { id: encounterId },
      relations: { patient: true },
    });

    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    const entries = data.items || [];

    if (entries.length === 0) {
      throw new BadRequestException('Add at least one drug');
    }

    const products = await this.productsRepository.find({
      where: { id: In(entries.map((entry) => entry.productId)), active: true },
    });

    if (products.length !== entries.length) {
      throw new BadRequestException('One or more drugs were not found');
    }

    const allergies = encounter.patient.knownAllergies;

    for (const product of products) {
      if (this.blockedByAllergy(allergies, product)) {
        throw new BadRequestException(
          `This patient is allergic to ${allergies}. ${product.name} is blocked and cannot be prescribed.`,
        );
      }
    }

    const prescription = this.prescriptionsRepository.create({
      encounterId,
      status: PrescriptionStatus.SENT,
      prescribedById: doctorId,
    });

    const saved = await this.prescriptionsRepository.save(prescription);

    const items = entries.map((entry) => {
      const product = products.find((p) => p.id === entry.productId)!;

      return this.itemsRepository.create({
        prescriptionId: saved.id,
        productId: product.id,
        drugName: product.name,
        dose: entry.dose.trim(),
        route: entry.route,
        frequency: entry.frequency.trim(),
        duration: entry.duration.trim(),
        quantity: entry.quantity,
        price: product.price,
      });
    });

    await this.itemsRepository.save(items);

    await this.auditService.record({
      userId: doctorId,
      action: 'prescription_created',
      entity: 'prescription',
      entityId: saved.id,
      patientId: encounter.patientId,
      before: null,
      after: { items: items.map((item) => item.drugName) },
      reason: null,
    });

    return this.prescriptionsRepository.findOne({
      where: { id: saved.id },
      relations: { items: true },
    });
  }

  async findQueue(status?: PrescriptionStatus) {
    const prescriptions = await this.prescriptionsRepository.find({
      where: status
        ? { status }
        : [
            { status: PrescriptionStatus.SENT },
            { status: PrescriptionStatus.PARTIALLY_DISPENSED },
          ],
      relations: {
        items: true,
        prescribedBy: true,
        encounter: { patient: true },
      },
      order: { prescribedAt: 'ASC' },
    });

    return prescriptions.map((p) => ({
      id: p.id,
      status: p.status,
      prescribedAt: p.prescribedAt,
      itemCount: p.items.length,
      prescriberName: p.prescribedBy ? p.prescribedBy.fullName : '',
      hospitalNo: p.encounter.patient.hospitalNo,
      patientName:
        p.encounter.patient.surname + ' ' + p.encounter.patient.firstName,
    }));
  }

  async findOneForDispense(id: string) {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id },
      relations: {
        items: true,
        prescribedBy: true,
        encounter: { patient: true },
      },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return {
      id: prescription.id,
      status: prescription.status,
      prescribedAt: prescription.prescribedAt,
      prescriberName: prescription.prescribedBy
        ? prescription.prescribedBy.fullName
        : '',
      hospitalNo: prescription.encounter.patient.hospitalNo,
      patientName:
        prescription.encounter.patient.surname +
        ' ' +
        prescription.encounter.patient.firstName,
      knownAllergies: prescription.encounter.patient.knownAllergies,
      items: prescription.items.map((item) => ({
        id: item.id,
        drugName: item.drugName,
        dose: item.dose,
        route: item.route,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity,
        dispensedQuantity: item.dispensedQuantity,
        price: item.price,
      })),
    };
  }

  async dispense(
    id: string,
    data: { items: { itemId: string; quantity: number }[] },
    pharmacistId: string,
  ) {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id },
      relations: { items: true, encounter: true },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (prescription.status === PrescriptionStatus.DISPENSED) {
      throw new BadRequestException('This prescription is already dispensed');
    }

    const entries = (data.items || []).filter((entry) => entry.quantity > 0);

    if (entries.length === 0) {
      throw new BadRequestException('Nothing to dispense');
    }

    for (const entry of entries) {
      const item = prescription.items.find((i) => i.id === entry.itemId);

      if (!item) {
        throw new BadRequestException('Unknown item on this prescription');
      }

      const outstanding = item.quantity - item.dispensedQuantity;

      if (entry.quantity > outstanding) {
        throw new BadRequestException(
          `${item.drugName}: only ${outstanding} left to dispense`,
        );
      }
    }

    const dispensed: string[] = [];

    for (const entry of entries) {
      const item = prescription.items.find((i) => i.id === entry.itemId)!;

      item.dispensedQuantity = item.dispensedQuantity + entry.quantity;
      await this.itemsRepository.save(item);

      dispensed.push(item.drugName + ' x' + entry.quantity);
    }

    const fresh = await this.itemsRepository.find({
      where: { prescriptionId: id },
    });

    const allDone = fresh.every(
      (item) => item.dispensedQuantity >= item.quantity,
    );

    prescription.status = allDone
      ? PrescriptionStatus.DISPENSED
      : PrescriptionStatus.PARTIALLY_DISPENSED;
    prescription.dispensedById = pharmacistId;
    prescription.dispensedAt = new Date();

    await this.prescriptionsRepository.save(prescription);

    await this.auditService.record({
      userId: pharmacistId,
      action: 'prescription_dispensed',
      entity: 'prescription',
      entityId: prescription.id,
      patientId: prescription.encounter.patientId,
      before: null,
      after: { items: dispensed, status: prescription.status },
      reason: null,
    });

    return this.findOneForDispense(id);
  }
}