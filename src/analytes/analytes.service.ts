import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analyte } from './analyte.entity.js';

@Injectable()
export class AnalytesService {
  constructor(
    @InjectRepository(Analyte)
    private analytesRepository: Repository<Analyte>,
  ) {}

  async findByService(serviceId: string) {
    return this.analytesRepository.find({
      where: { serviceId },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }
}