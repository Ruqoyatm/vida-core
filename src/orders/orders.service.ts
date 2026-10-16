import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Order } from './order.entity.js';
import { Service } from '../services/service.entity.js';
import { Encounter } from '../encounters/encounter.entity.js';
import { ServiceType } from '../services/service-type.enum.js';
import { OrderUrgency } from './order-urgency.enum.js';
import { OrderStatus } from './order-status.enum.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Encounter)
    private encountersRepository: Repository<Encounter>,
  ) {}

  async create(
    encounterId: string,
    data: { items: { serviceId: string; urgency?: OrderUrgency }[] },
    doctorId: string,
  ) {
    const encounter = await this.encountersRepository.findOne({
      where: { id: encounterId },
    });

    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    const items = data.items || [];

    if (items.length === 0) {
      throw new BadRequestException('Select at least one service');
    }

    const serviceIds = items.map((item) => item.serviceId);

    const services = await this.servicesRepository.find({
      where: { id: In(serviceIds), active: true },
    });

    if (services.length !== serviceIds.length) {
      throw new BadRequestException('One or more services were not found');
    }

    const existing = await this.ordersRepository.find({
      where: {
        encounterId,
        serviceId: In(serviceIds),
        status: Not(OrderStatus.CANCELLED),
      },
    });

    if (existing.length > 0) {
      const names = existing.map((o) => o.serviceName).join(', ');
      throw new ConflictException(`Already ordered on this visit: ${names}`);
    }

    const orders = items.map((item) => {
      const service = services.find((s) => s.id === item.serviceId)!;

      return this.ordersRepository.create({
        encounterId,
        serviceId: service.id,
        serviceName: service.name,
        department: service.department,
        serviceType: service.type,
        price: service.fee,
        urgency: item.urgency || OrderUrgency.ROUTINE,
        orderedById: doctorId,
      });
    });

    return this.ordersRepository.save(orders);
  }

  async findByEncounter(encounterId: string) {
    return this.ordersRepository.find({
      where: { encounterId },
      order: { orderedAt: 'ASC' },
    });
  }

  async findWorklist(type?: string, status?: OrderStatus) {
    const query = this.ordersRepository
      .createQueryBuilder('o')
      .innerJoinAndSelect('o.encounter', 'e')
      .innerJoinAndSelect('e.patient', 'p');

    if (type === 'lab') {
      query.andWhere('o.serviceType = :type', { type: ServiceType.TEST });
    }

    if (type === 'radiology') {
      query.andWhere('o.serviceType = :type', { type: ServiceType.IMAGING });
    }

    if (status) {
      query.andWhere('o.status = :status', { status });
    } else {
      query.andWhere('o.status NOT IN (:...done)', {
        done: [OrderStatus.RELEASED, OrderStatus.CANCELLED],
      });
    }

    const orders = await query.orderBy('o.orderedAt', 'ASC').getMany();

    return orders.map((order) => ({
      id: order.id,
      serviceId: order.serviceId,
      encounterId: order.encounterId,
      serviceName: order.serviceName,
      department: order.department,
      serviceType: order.serviceType,
      urgency: order.urgency,
      status: order.status,
      orderedAt: order.orderedAt,
      hospitalNo: order.encounter.patient.hospitalNo,
      patientName:
        order.encounter.patient.surname +
        ' ' +
        order.encounter.patient.firstName,
    }));
  }

  async findOneForWorklist(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { encounter: { patient: true } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      id: order.id,
      serviceId: order.serviceId,
      encounterId: order.encounterId,
      serviceName: order.serviceName,
      department: order.department,
      serviceType: order.serviceType,
      urgency: order.urgency,
      status: order.status,
      orderedAt: order.orderedAt,
      hospitalNo: order.encounter.patient.hospitalNo,
      patientName:
        order.encounter.patient.surname +
        ' ' +
        order.encounter.patient.firstName,
    };
  }
}