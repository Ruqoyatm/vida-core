import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity.js';
import { Permission } from './permission.entity.js';
import { RolePermission } from './role-permission.entity.js';
import { RolesService } from './roles.service.js';
import { RolesController } from './roles.controller.js';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}