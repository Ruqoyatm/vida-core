import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { SamplesService } from './samples.service.js';
import { SampleCondition } from './sample-condition.enum.js';

@Controller('orders/:orderId/sample')
@UseGuards(JwtAuthGuard)
export class SamplesController {
  constructor(private samplesService: SamplesService) {}

  @Get()
  findByOrder(@Param('orderId') orderId: string) {
    return this.samplesService.findByOrder(orderId);
  }

  @Post()
  create(
    @Param('orderId') orderId: string,
    @Body()
    body: {
      sampleType: string;
      condition: SampleCondition;
      collectedAt: string;
      notes?: string;
    },
    @Request() req: { user: { sub: string } },
  ) {
    return this.samplesService.create(orderId, body, req.user.sub);
  }
}