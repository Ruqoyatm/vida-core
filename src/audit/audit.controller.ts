import { Controller, Get, Query } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { AuditService } from './audit.service.js';

@Controller('audit')
@RequirePermission('manage_users')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  find(
    @Query('user') user?: string,
    @Query('patient') patient?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.auditService.find({ user, patient, from, to });
  }
}