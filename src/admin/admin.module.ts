import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { AuditModule } from '../audit/audit.module.js';
import { User } from '../users/user.entity.js';
import { Encounter } from '../encounters/encounter.entity.js';
import { Order } from '../orders/order.entity.js';
import { Result } from '../results/result.entity.js';
import { Prescription } from '../prescriptions/prescription.entity.js';
import { AdminUsersService } from './admin-users.service.js';
import { AdminUsersController } from './admin-users.controller.js';
import { AdminSummaryService } from './admin-summary.service.js';
import { AdminSummaryController } from './admin-summary.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Encounter, Order, Result, Prescription]),
    AuthModule,
    AuditModule,
  ],
  controllers: [AdminUsersController, AdminSummaryController],
  providers: [AdminUsersService, AdminSummaryService],
  exports: [AdminUsersService],
})
export class AdminModule {}