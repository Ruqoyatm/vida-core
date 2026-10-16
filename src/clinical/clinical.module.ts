import { Module } from '@nestjs/common';
import { ClinicalService } from './clinical.service.js';
import { ClinicalController } from './clinical.controller.js';
import { EncountersModule } from '../encounters/encounters.module.js';
import { AuthModule } from '../auth/auth.module.js';


@Module({
  imports: [EncountersModule, AuthModule],
  controllers: [ClinicalController],
  providers: [ClinicalService],
})
export class ClinicalModule {}