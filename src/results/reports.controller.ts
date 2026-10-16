import { Body, Controller, Param, ParseUUIDPipe, Post, Request } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { ResultsService } from './results.service.js';

@Controller('orders/:orderId/report')
export class ReportsController {
  constructor(private resultsService: ResultsService) {}

  @RequirePermission('enter_results')
  @Post()
  create(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() body: { findings: string; impression: string },
    @Request() req: { user: { sub: string } },
  ) {
    return this.resultsService.createReport(orderId, body, req.user.sub);
  }
}