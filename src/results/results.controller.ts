import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Request } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { ResultsService } from './results.service.js';

@Controller('orders/:orderId/results')
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @RequirePermission('view_patient')
  @Get()
  findByOrder(@Param('orderId') orderId: string) {
    return this.resultsService.findByOrder(orderId);
  }

  @RequirePermission('enter_results')
  @Post()
  create(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() body: { values: { analyteId: string; value: string }[] },
    @Request() req: { user: { sub: string } },
  ) {
    return this.resultsService.create(orderId, body, req.user.sub);
  }
}