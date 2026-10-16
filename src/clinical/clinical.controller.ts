import { Controller, Get, Query } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { ClinicalService } from './clinical.service.js';
import { Department } from '../encounters/department.enum.js';

@Controller('clinical')
export class ClinicalController {
  constructor(private clinicalService: ClinicalService) {}

  @RequirePermission('view_patient')
  @Get('summary')
  summary(@Query('department') department?: Department) {
    return this.clinicalService.summary(department);
  }
}