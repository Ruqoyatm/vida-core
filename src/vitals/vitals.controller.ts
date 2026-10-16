import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { type AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { VitalsService } from './vitals.service.js';

@Controller('vitals')
export class VitalsController {
  constructor(private vitalsService: VitalsService) {}

  @RequirePermission('clinical_notes')
  @Post()
  create(
    @Body()
    body: {
      encounterId: string;
      systolic?: number;
      diastolic?: number;
      pulse?: number;
      respiratoryRate?: number;
      temperature?: number;
      weight?: number;
      height?: number;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.vitalsService.create(body, req.user.sub);
  }

  @RequirePermission('view_patient')
  @Get()
  findByEncounter(@Query('encounterId') encounterId: string) {
    return this.vitalsService.findByEncounter(encounterId);
  }
}