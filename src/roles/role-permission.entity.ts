import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Unique,
} from 'typeorm';
import { PermissionScope } from './permission-scope.enum.js';

@Entity('role_permissions')
@Unique(['roleKey', 'permissionKey'])
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  roleKey: string;

  @Column({ type: 'varchar' })
  permissionKey: string;

  @Column({ type: 'varchar', nullable: true })
  note: string | null;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    default: PermissionScope.NONE,
  })
  scope: PermissionScope;
}