import { Body, Controller, Get, Param, Post, Request, ParseUUIDPipe } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { DiagnosesService } from './diagnoses.service.js';
import { DiagnosisType } from './diagnosis-type.enum.js';

@Controller('encounters/:encounterId/diagnoses')
export class DiagnosesController {
  constructor(private diagnosesService: DiagnosesService) {}

  @RequirePermission('clinical_notes')
  @Post()
  create(
    @Param('encounterId', ParseUUIDPipe) encounterId: string,
    @Body() body: { code?: string; description: string; type?: DiagnosisType },
    @Request() req: { user: { sub: string } },
  ) {
    return this.diagnosesService.create(encounterId, body, req.user.sub);
  }

  @RequirePermission('view_patient')
  @Get()
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.diagnosesService.findByEncounter(encounterId);
  }
}