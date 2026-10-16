import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Request } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { PrescriptionsService } from './prescriptions.service.js';
import { DrugRoute } from './drug-route.enum.js';

@Controller('encounters/:encounterId/prescriptions')
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  @RequirePermission('view_patient')
  @Get()
  findByEncounter(@Param('encounterId', ParseUUIDPipe) encounterId: string) {
    return this.prescriptionsService.findByEncounter(encounterId);
  }

  @RequirePermission('prescribe')
  @Post()
  create(
    @Param('encounterId') encounterId: string,
    @Body()
    body: {
      items: {
        productId: string;
        dose: string;
        route: DrugRoute;
        frequency: string;
        duration: string;
        quantity: number;
      }[];
    },
    @Request() req: { user: { sub: string } },
  ) {
    return this.prescriptionsService.create(encounterId, body, req.user.sub);
  }
}