import { Body, Controller, Get, Param, Post, Request, ParseUUIDPipe } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { OrdersService } from './orders.service.js';
import { OrderUrgency } from './order-urgency.enum.js';

@Controller('encounters/:encounterId/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @RequirePermission('order_tests')
  @Post()
  create(
    @Param('encounterId', ParseUUIDPipe) encounterId: string,
    @Body() body: { items: { serviceId: string; urgency?: OrderUrgency }[] },
    @Request() req: { user: { sub: string } },
  ) {
    return this.ordersService.create(encounterId, body, req.user.sub);
  }

  @RequirePermission('view_patient')
  @Get()
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.ordersService.findByEncounter(encounterId);
  }
}