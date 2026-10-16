import { Controller, Get, Request } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import { ResultsService } from './results.service.js';

@Controller('clinicians/me/results')
@RequirePermission('view_patient')
export class InboxController {
  constructor(private resultsService: ResultsService) {}

  @Get()
  findMine(@Request() req: { user: { sub: string } }) {
    return this.resultsService.findForClinician(req.user.sub);
  }
}