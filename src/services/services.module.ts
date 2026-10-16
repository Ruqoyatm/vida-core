import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Service } from './service.entity.js';
import { ServicesService } from './services.service.js';
import { ServicesController } from './services.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), AuthModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}