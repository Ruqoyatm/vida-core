import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity.js';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index()
  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'varchar' })
  entity: string;

  @Column({ type: 'uuid' })
  entityId: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  patientId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  before: unknown;

  @Column({ type: 'jsonb', nullable: true })
  after: unknown;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn()
  at: Date;
}