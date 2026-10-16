import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Analyte } from './analyte.entity.js';
import { AnalytesService } from './analytes.service.js';
import { AnalytesController } from './analytes.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Analyte]), AuthModule],
  controllers: [AnalytesController],
  providers: [AnalytesService],
  exports: [AnalytesService],
})
export class AnalytesModule {}