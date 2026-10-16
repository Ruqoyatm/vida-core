import { Injectable } from '@nestjs/common';
import { EncountersService } from '../encounters/encounters.service.js';
import { Department } from '../encounters/department.enum.js';

@Injectable()
export class ClinicalService {
  constructor(private encountersService: EncountersService) {}

  async summary(department?: Department) {
    const queue = await this.encountersService.todayQueue(department);

    return {
      inQueue: queue.length,
      queue: queue.slice(0, 5),
    };
  }
}