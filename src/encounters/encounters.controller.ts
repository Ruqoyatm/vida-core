import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { type AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { EncountersService } from './encounters.service.js';
import { EncounterType } from './encounter-type.enum.js';
import { EncounterStatus } from './encounter-status.enum.js';
import { EncounterPriority } from './encounter-priority.enum.js';
import { Department } from './department.enum.js';

@Controller('encounters')
export class EncountersController {
  constructor(private encountersService: EncountersService) {}

  @RequirePermission('edit_patient')
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

  @RequirePermission('view_patient')
  @Get('today')
  todayQueue(@Query('department') department?: Department) {
    return this.encountersService.todayQueue(department);
  }

  @RequirePermission('view_patient')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.encountersService.findById(id);
  }

  @RequirePermission('clinical_notes')
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

  @RequirePermission('edit_patient')
  @Patch(':id/status')
  setStatus(
    @Param('id') id: string,
    @Body() body: { status: EncounterStatus },
  ) {
    return this.encountersService.setStatus(id, body.status);
  }

  @RequirePermission('edit_patient')
  @Patch(':id')
  update(
  @Param('id', ParseUUIDPipe) id: string,    @Body()
    body: { presentingComplaint?: string; priority?: EncounterPriority },
  ) {
    return this.encountersService.update(id, body);
  }
}