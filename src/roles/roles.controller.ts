import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { RolesService } from './roles.service.js';
import { UpdateRoleDto } from './update-role.dto.js';
import { RequirePermission } from '../auth/permissions.decorator.js';

@Controller('roles')
@RequirePermission('manage_users')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.rolesService.findOne(key);
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() data: UpdateRoleDto) {
    return this.rolesService.update(key, data);
  }
}