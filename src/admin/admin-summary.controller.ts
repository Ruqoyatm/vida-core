import { Controller, Get } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { AdminSummaryService } from './admin-summary.service.js';

@Controller('admin')
export class AdminSummaryController {
  constructor(private adminSummaryService: AdminSummaryService) {}

  @RequirePermission('manage_users')
  @Get('summary')
  summary() {
    return this.adminSummaryService.summary();
  }
}