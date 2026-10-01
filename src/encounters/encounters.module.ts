import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encounter } from './encounter.entity.js';
import { EncountersService } from './encounters.service.js';
import { EncountersController } from './encounters.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { PatientsModule } from '../patients/patients.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Encounter]), AuthModule, PatientsModule],
  controllers: [EncountersController],
  providers: [EncountersService],
  exports: [EncountersService],
})
export class EncountersModule {}