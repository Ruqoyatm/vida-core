import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vitals } from './vitals.entity.js';
import { EncountersService } from '../encounters/encounters.service.js';

@Injectable()
export class VitalsService {
  constructor(
    @InjectRepository(Vitals)
    private vitalsRepository: Repository<Vitals>,
    private EncountersService: EncountersService,
  ) {}

  async create(
    data: {
      encounterId: string;
      systolic?: number;
      diastolic?: number;
      pulse?: number;
      respiratoryRate?: number;
      temperature?: number;
      weight?: number;
      height?: number;
    },
    recordedById: string,
  ) {
    await this.EncountersService.findById(data.encounterId);

    const vitals = this.vitalsRepository.create({
      encounterId: data.encounterId,
      systolic: data.systolic ?? null,
      diastolic: data.diastolic ?? null,
      pulse: data.pulse ?? null,
      respiratoryRate: data.respiratoryRate ?? null,
      temperature: data.temperature != null ? String(data.temperature) : null,
      weight: data.weight != null ? String(data.weight) : null,
      height: data.height != null ? String(data.height) : null,
      recordedById,
    });

    return this.vitalsRepository.save(vitals);
  }

  async findByEncounter(encounterId: string) {
    return this.vitalsRepository.find({
      where: { encounterId },
      order: { recordedAt: 'DESC' },
    });
  }
}