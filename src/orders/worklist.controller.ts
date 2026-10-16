import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { OrdersService } from './orders.service.js';
import { OrderStatus } from './order-status.enum.js';

@Controller('orders')
@RequirePermission('view_patient')
export class WorklistController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findWorklist(
    @Query('type') type?: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findWorklist(type, status);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOneForWorklist(id);
  }
}