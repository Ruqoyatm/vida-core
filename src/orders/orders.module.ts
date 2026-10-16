import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Order } from './order.entity.js';
import { Service } from '../services/service.entity.js';
import { Encounter } from '../encounters/encounter.entity.js';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { WorklistController } from './worklist.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Service, Encounter]),
    AuthModule,
  ],
  controllers: [OrdersController, WorklistController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}