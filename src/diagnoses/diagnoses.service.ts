import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Diagnosis } from './diagnosis.entity.js';
import { DiagnosisType } from './diagnosis-type.enum.js';
import { EncountersService } from '../encounters/encounters.service.js';
import { DiagnosisCertainty } from './diagnosis-certainty.enum.js';

@Injectable()
export class DiagnosesService {
  constructor(
    @InjectRepository(Diagnosis)
    private diagnosesRepository: Repository<Diagnosis>,
    private encountersService: EncountersService,
  ) {}

    async create(
    encounterId: string,
    data: {
      code?: string;
      description: string;
      type?: DiagnosisType;
      certainty?: DiagnosisCertainty;
    },
    doctorId: string,
  ) {
    await this.encountersService.findById(encounterId);

    const description = data.description.trim();

    const existing = await this.diagnosesRepository.findOne({
      where: { encounterId, description: ILike(description),       certainty: data.certainty ?? DiagnosisCertainty.PROVISIONAL,},
    });

    if (existing) {
      throw new ConflictException(
        'That diagnosis is already recorded on this encounter',
      );
    }

    const diagnosis = this.diagnosesRepository.create({
      encounterId,
      code: data.code?.trim().toUpperCase() || null,
      description,
      type: data.type ?? DiagnosisType.PRIMARY,
      diagnosedById: doctorId,
    });

    return this.diagnosesRepository.save(diagnosis);
  }

  findByEncounter(encounterId: string) {
    return this.diagnosesRepository.find({
      where: { encounterId },
      order: { type: 'ASC', diagnosedAt: 'ASC' },
    });
  }
}