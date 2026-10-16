import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { PatientsService } from './patients.service.js';
import { CreatePatientDto } from './create-patient.dto.js';

@Controller('patients')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @RequirePermission('edit_patient')
  @Post()
  create(@Body() body: CreatePatientDto) {
    return this.patientsService.create(body);
  }

  @RequirePermission('view_patient')
  @Get()
  search(@Query('q') q: string) {
    return this.patientsService.search(q);
  }

  @RequirePermission('edit_patient')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { knownAllergies?: string },
  ) {
    return this.patientsService.update(id, body);
  }
}