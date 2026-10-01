import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from '../auth/jwt-auth.guard.js';
import { EncountersService } from './encounters.service.js';
import { EncounterType } from './encounter-type.enum.js';
import { EncounterPriority } from './encounter-priority.enum.js';
import { Department } from './department.enum.js';

@Controller('encounters')
@UseGuards(JwtAuthGuard)
export class EncountersController {
  constructor(private encountersService: EncountersService) {}

  @Post()
  checkIn(
    @Body()
    body: {
      hospitalNo: string;
      encounterType?: EncounterType;
      department: Department;
      presentingComplaint?: string;
      priority?: EncounterPriority;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.encountersService.checkIn(body, req.user.sub);
  }

  @Get('today')
  todayQueue(@Query('department') department?: Department) {
    return this.encountersService.todayQueue(department);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.encountersService.findById(id);
  }

  @Patch(':id/history')
  updateHistory(
    @Param('id') id: string,
    @Body()
    body: {
      presentingComplaint?: string;
      historyOfPresentingComplaint?: string;
      pastMedicalHistory?: string;
      examinationFindings?: string;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.encountersService.updateHistory(id, body, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: { presentingComplaint?: string; priority?: EncounterPriority },
  ) {
    return this.encountersService.update(id, body);
  }
}