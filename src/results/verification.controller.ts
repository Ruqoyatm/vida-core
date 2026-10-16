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
import { ResultsService } from './results.service.js';
import { ResultStatus } from './result-status.enum.js';

@Controller('results')
export class VerificationController {
  constructor(private resultsService: ResultsService) {}

  @RequirePermission('verify_results')
  @Get()
  findByStatus(@Query('status') status?: ResultStatus) {
    return this.resultsService.findByStatus(status || ResultStatus.PENDING);
  }

  @RequirePermission('view_patient')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOneDetail(id);
  }

  @RequirePermission('verify_results')
  @Post(':id/verify')
  verify(@Param('id') id: string, @Request() req: { user: { sub: string } }) {
    return this.resultsService.verify(id, req.user.sub);
  }

  @RequirePermission('verify_results')
  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Request() req: { user: { sub: string } },
  ) {
    return this.resultsService.reject(id, body.reason, req.user.sub);
  }

  @RequirePermission('clinical_notes')
  @Post(':id/acknowledge')
  acknowledge(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.resultsService.acknowledge(id, req.user.sub);
  }
}