import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encounter } from './encounter.entity.js';
import { EncounterStatus } from './encounter-status.enum.js';
import { EncounterType } from './encounter-type.enum.js';
import { EncounterPriority } from './encounter-priority.enum.js';
import { Department } from './department.enum.js';
import { PatientsService } from '../patients/patients.service.js';

@Injectable()
export class EncountersService {
  constructor(
    @InjectRepository(Encounter)
    private encountersRepository: Repository<Encounter>,
    private patientsService: PatientsService,
  ) {}

  async checkIn(
    data: {
      hospitalNo: string;
      encounterType?: EncounterType;
      department: Department;
      presentingComplaint?: string;
      priority?: EncounterPriority;
    },
    checkedInById: string,
  ) {
    const patient = await this.patientsService.findByHospitalNo(
      data.hospitalNo.trim(),
    );

    if (!patient) {
      throw new NotFoundException(
        `No patient found with hospital number ${data.hospitalNo}`,
      );
    }

    const openEncounter = await this.encountersRepository.findOne({
      where: [
        { patientId: patient.id, status: EncounterStatus.WAITING },
        { patientId: patient.id, status: EncounterStatus.IN_CONSULTATION },
      ],
    });

    if (openEncounter) {
      throw new ConflictException(
        'This patient is already checked in and waiting',
      );
    }

    const encounter = this.encountersRepository.create({
      patientId: patient.id,
      encounterType: data.encounterType ?? EncounterType.NEW,
      department: data.department,
      presentingComplaint: data.presentingComplaint?.trim() || null,
      priority: data.priority ?? EncounterPriority.ROUTINE,
      checkedInById,
    });

    return this.encountersRepository.save(encounter);
  }

  async todayQueue(department?: Department) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const qb = this.encountersRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.patient', 'p')
      .where('e."checkedInAt" >= :startOfToday', { startOfToday })
      .andWhere('e.status IN (:...statuses)', {
        statuses: [EncounterStatus.WAITING, EncounterStatus.IN_CONSULTATION],
      });

    if (department) {
      qb.andWhere('e.department = :department', { department });
    }

    return qb
      .orderBy('e.priority', 'DESC')
      .addOrderBy('e."checkedInAt"', 'ASC')
      .getMany();
  }

  async findById(id: string) {
    const encounter = await this.encountersRepository.findOne({
      where: { id },
      relations: { patient: true },
    });

    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    return encounter;
  }

  async update(
    id: string,
    data: { presentingComplaint?: string; priority?: EncounterPriority },
  ) {
    const encounter = await this.findById(id);

    if (data.presentingComplaint !== undefined) {
      encounter.presentingComplaint = data.presentingComplaint.trim() || null;
    }

    if (data.priority !== undefined) {
      encounter.priority = data.priority;
    }

    return this.encountersRepository.save(encounter);
  }

  async updateHistory(
    id: string,
    data: {
      presentingComplaint?: string;
      historyOfPresentingComplaint?: string;
      pastMedicalHistory?: string;
      examinationFindings?: string;
    },
    doctorId: string,
  ) {
    const encounter = await this.findById(id);

    if (data.presentingComplaint !== undefined) {
      encounter.presentingComplaint = data.presentingComplaint.trim() || null;
    }

    if (data.historyOfPresentingComplaint !== undefined) {
      encounter.historyOfPresentingComplaint =
        data.historyOfPresentingComplaint.trim() || null;
    }

    if (data.pastMedicalHistory !== undefined) {
      encounter.pastMedicalHistory = data.pastMedicalHistory.trim() || null;
    }

    if (data.examinationFindings !== undefined) {
      encounter.examinationFindings = data.examinationFindings.trim() || null;
    }

    if (!encounter.doctorId) {
      encounter.doctorId = doctorId;
      encounter.startedAt = new Date();
      encounter.status = EncounterStatus.IN_CONSULTATION;
    }

    return this.encountersRepository.save(encounter);
  }
}