import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './role.entity.js';
import { Permission } from './permission.entity.js';
import { RolePermission } from './role-permission.entity.js';
import { PermissionScope } from './permission-scope.enum.js';
import { UpdateRoleDto } from './update-role.dto.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionsRepository: Repository<RolePermission>,
  ) {}

  async findAll() {
    const roles = await this.rolesRepository.find({ order: { sortOrder: 'ASC' } });
    const permissions = await this.permissionsRepository.find({ order: { sortOrder: 'ASC' } });
    const grants = await this.rolePermissionsRepository.find();

    return roles.map((role) => {
      const rows = permissions.map((permission) => {
        const grant = grants.find(
          (g) => g.roleKey === role.key && g.permissionKey === permission.key,
        );
        return {
          key: permission.key,
          label: permission.label,
          scope: grant ? grant.scope : PermissionScope.NONE,
          note: grant ? grant.note : null,
        };
      });

      return { key: role.key, label: role.label, permissions: rows };
    });
  }

  async findOne(key: string) {
    const role = await this.rolesRepository.findOne({ where: { key } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions = await this.permissionsRepository.find({ order: { sortOrder: 'ASC' } });
    const grants = await this.rolePermissionsRepository.find({ where: { roleKey: key } });

    const rows = permissions.map((permission) => {
      const grant = grants.find((g) => g.permissionKey === permission.key);
      return {
        key: permission.key,
        label: permission.label,
        scope: grant ? grant.scope : PermissionScope.NONE,
        note: grant ? grant.note : null,
      };
    });

    return { key: role.key, label: role.label, permissions: rows };
  }

  async update(key: string, data: UpdateRoleDto) {
    const role = await this.rolesRepository.findOne({ where: { key } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    for (const item of data.permissions) {
      const permission = await this.permissionsRepository.findOne({ where: { key: item.key } });
      if (!permission) {
        throw new BadRequestException(`There is no permission called ${item.key}`);
      }

      let grant = await this.rolePermissionsRepository.findOne({
        where: { roleKey: key, permissionKey: item.key },
      });

      if (!grant) {
        grant = this.rolePermissionsRepository.create({
          roleKey: key,
          permissionKey: item.key,
        });
      }

      grant.scope = item.scope;
      await this.rolePermissionsRepository.save(grant);
    }

    return this.findOne(key);
  }

  async scopeFor(roles: string[], permissionKey: string) {
    if (roles.length === 0) {
      return PermissionScope.NONE;
    }

    const grants = await this.rolePermissionsRepository.find({
      where: { roleKey: In(roles), permissionKey },
    });

    if (grants.some((g) => g.scope === PermissionScope.FULL)) {
      return PermissionScope.FULL;
    }
    if (grants.some((g) => g.scope === PermissionScope.LIMITED)) {
      return PermissionScope.LIMITED;
    }
    return PermissionScope.NONE;
  }

  async assertRolesExist(keys: string[]) {
    if (keys.length === 0) {
      throw new BadRequestException('A user needs at least one role');
    }

    const found = await this.rolesRepository.find({ where: { key: In(keys) } });

    for (const key of keys) {
      if (!found.some((role) => role.key === key)) {
        throw new BadRequestException(`There is no role called ${key}`);
      }
    }
  }
}