import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Prescription } from './prescription.entity.js';
import { PrescriptionItem } from './prescription-item.entity.js';
import { Product } from '../products/product.entity.js';
import { Encounter } from '../encounters/encounter.entity.js';
import { PrescriptionsService } from './prescriptions.service.js';
import { PrescriptionsController } from './prescriptions.controller.js';
import { PharmacyController } from './pharmacy.controller.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prescription,
      PrescriptionItem,
      Product,
      Encounter,
    ]),
    AuthModule,
    AuditModule,
  ],
  controllers: [PrescriptionsController, PharmacyController],
  providers: [PrescriptionsService],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}