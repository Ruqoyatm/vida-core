import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, type AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { VitalsService } from './vitals.service.js';

@Controller('vitals')
@UseGuards(JwtAuthGuard)
export class VitalsController {
  constructor(private vitalsService: VitalsService) {}

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

  @Get()
  findByEncounter(@Query('encounterId') encounterId: string) {
    return this.vitalsService.findByEncounter(encounterId);
  }
}