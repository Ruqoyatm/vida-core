import { PermissionScope } from './permission-scope.enum.js';

export class UpdateRoleDto {
  permissions: { key: string; scope: PermissionScope }[];
}