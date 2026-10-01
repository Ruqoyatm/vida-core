import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vitals } from './vitals.entity.js';
import { VitalsService } from './vitals.service.js';
import { VitalsController } from './vitals.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { EncountersModule } from '../encounters/encounters.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Vitals]), AuthModule, EncountersModule],
  controllers: [VitalsController],
  providers: [VitalsService],
})
export class VitalsModule {}