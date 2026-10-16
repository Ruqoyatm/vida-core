import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnosis } from './diagnosis.entity.js';
import { DiagnosesService } from './diagnoses.service.js';
import { DiagnosesController } from './diagnoses.controller.js';
import { EncountersModule } from '../encounters/encounters.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Diagnosis]), EncountersModule, AuthModule],
  controllers: [DiagnosesController],
  providers: [DiagnosesService],
})
export class DiagnosesModule {}