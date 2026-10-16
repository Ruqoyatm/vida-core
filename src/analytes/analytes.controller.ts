import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AnalytesService } from './analytes.service.js';

@Controller('services/:serviceId/analytes')
@UseGuards(JwtAuthGuard)
export class AnalytesController {
  constructor(private analytesService: AnalytesService) {}

  @Get()
  findByService(@Param('serviceId', ParseUUIDPipe) serviceId: string) {
    return this.analytesService.findByService(serviceId);
  }
}