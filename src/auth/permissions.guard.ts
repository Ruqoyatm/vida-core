import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../roles/roles.service.js';
import { PermissionScope } from '../roles/permission-scope.enum.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permission = this.reflector.getAllAndOverride<string>('permission', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('You are not signed in');
    }

    const scope = await this.rolesService.scopeFor(user.roles ?? [], permission);

    if (scope === PermissionScope.NONE) {
      throw new ForbiddenException('Your role does not allow this');
    }

    request.permissionScope = scope;
    return true;
  }
}