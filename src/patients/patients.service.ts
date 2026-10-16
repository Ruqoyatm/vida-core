import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity.js';
import { PatientSex } from './patient-sex.enum.js';
import { PayerType } from './payer-type.enum.js';
import { MaritalStatus } from './marital-status.enum.js';
import { Encounter } from '../encounters/encounter.entity.js';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(Encounter)
  private encountersRepository: Repository<Encounter>,
  ) {}

  private async nextHospitalNo(): Promise<string> {
    const rows = await this.patientsRepository.query(
      "SELECT nextval('patient_hospital_no_seq') AS n",
    );
    return 'VC-' + String(rows[0].n).padStart(6, '0');
  }

  async create(data: {
    surname: string;
    firstName: string;
    otherNames?: string;
    dateOfBirth: string;
    sex: PatientSex;
    maritalStatus?: MaritalStatus;
    phone: string;
    address?: string;
    nextOfKinName?: string;
    nextOfKinPhone?: string;
    payerType?: PayerType;
    payerScheme?: string;
    payerRef?: string;
    coverExpiry?: string;
  }) {
    const hospitalNo = await this.nextHospitalNo();
    const patient = this.patientsRepository.create({ ...data, hospitalNo });
    return this.patientsRepository.save(patient);
  }

  async search(q: string) {
  if (!q || q.trim().length < 2) {
    return [];
  }

  const term = `%${q.trim()}%`;

  const patients = await this.patientsRepository
    .createQueryBuilder('p')
    .where('p."hospitalNo" ILIKE :term', { term })
    .orWhere('p.surname ILIKE :term', { term })
    .orWhere('p."firstName" ILIKE :term', { term })
    .orWhere('p.phone ILIKE :term', { term })
    .orWhere(`to_char(p."dateOfBirth", 'YYYY-MM-DD') ILIKE :term`, { term })
    .orderBy('p.surname', 'ASC')
    .addOrderBy('p."firstName"', 'ASC')
    .limit(100)
    .getMany();

  if (patients.length === 0) {
    return [];
  }

  const ids = patients.map((p) => p.id);

  const rows = await this.encountersRepository
    .createQueryBuilder('e')
    .select('e.patientId', 'patientId')
    .addSelect('MAX(e.checkedInAt)', 'lastVisit')
    .where('e.patientId IN (:...ids)', { ids })
    .groupBy('e.patientId')
    .getRawMany<{ patientId: string; lastVisit: Date }>();

  const lastVisitByPatient = new Map(
    rows.map((r) => [r.patientId, r.lastVisit]),
  );

  return patients.map((p) => ({
    ...p,
    lastVisit: lastVisitByPatient.get(p.id) ?? null,
  }));
}

  async findByHospitalNo(hospitalNo: string) {
    return this.patientsRepository.findOne({ where: { hospitalNo } });
  }

  async update(id: string, data: { knownAllergies?: string }) {
    const patient = await this.patientsRepository.findOne({ where: { id } });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (data.knownAllergies !== undefined) {
      patient.knownAllergies = data.knownAllergies.trim() || null;
    }

    return this.patientsRepository.save(patient);
  }
}