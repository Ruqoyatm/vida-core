import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { PrescriptionsService } from './prescriptions.service.js';
import { PrescriptionStatus } from './prescription-status.enum.js';

@Controller('prescriptions')
@RequirePermission('dispense')
export class PharmacyController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  @Get()
  findQueue(@Query('status') status?: PrescriptionStatus) {
    return this.prescriptionsService.findQueue(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOneForDispense(id);
  }

  @Post(':id/dispense')
  dispense(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { items: { itemId: string; quantity: number }[] },
    @Request() req: { user: { sub: string } },
  ) {
    return this.prescriptionsService.dispense(id, body, req.user.sub);
  }
}