import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity.js';
import { ServiceType } from './service-type.enum.js';
import { Department } from '../encounters/department.enum.js';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async findAll(filter: { type?: ServiceType; department?: Department }) {
    const where: {
      active: boolean;
      type?: ServiceType;
      department?: Department;
    } = { active: true };

    if (filter.type) where.type = filter.type;
    if (filter.department) where.department = filter.department;

    return this.servicesRepository.find({
      where,
      order: { department: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const service = await this.servicesRepository.findOne({ where: { id } });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }
}