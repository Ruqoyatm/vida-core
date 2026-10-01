import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PatientsService } from './patients.service.js';
import { PatientSex } from './patient-sex.enum.js';
import { PayerType } from './payer-type.enum.js';
import { MaritalStatus } from './marital-status.enum.js';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Post()
  create(
    @Body()
    body: {
      surname: string;
      firstName: string;
      otherNames?: string;
      dateOfBirth: Date;
      sex: PatientSex;
      maritalStatus?: MaritalStatus;
      phone: string;
      address?: string;
      nextOfKinName?: string;
      nextOfKinPhone?: string;
      payerType?: PayerType;
      payerScheme?: string;
      payerRef?: string;
      coverExpiry?: Date;
    },
  ) {
    return this.patientsService.create(body);
  }

  @Get()
  search(@Query('q') q: string) {
    return this.patientsService.search(q);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { knownAllergies?: string }) {
    return this.patientsService.update(id, body);
  }
}