import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ServicesService } from './services.service.js';
import { ServiceType } from './service-type.enum.js';
import { Department } from '../encounters/department.enum.js';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  findAll(
    @Query('type') type?: ServiceType,
    @Query('department') department?: Department,
  ) {
    return this.servicesService.findAll({ type, department });
  }
}