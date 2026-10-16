import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Result } from './result.entity.js';
import { ResultValue } from './result-value.entity.js';
import { Order } from '../orders/order.entity.js';
import { Analyte } from '../analytes/analyte.entity.js';
import { ResultsService } from './results.service.js';
import { ResultsController } from './results.controller.js';
import { ReportsController } from './reports.controller.js';
import { VerificationController } from './verification.controller.js';
import { InboxController } from './inbox.controller.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Result, ResultValue, Order, Analyte]),
    AuthModule, AuditModule,
  ],
  controllers: [ResultsController, ReportsController, VerificationController, InboxController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}