import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Encounter } from '../encounters/encounter.entity.js';
import { User } from '../users/user.entity.js';

@Entity('vitals')
export class Vitals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  encounterId: string;

  @ManyToOne(() => Encounter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'encounterId' })
  Encounter: Encounter;

  @Column({ type: 'int', nullable: true })
  systolic: number | null;

  @Column({ type: 'int', nullable: true })
  diastolic: number | null;

  @Column({ type: 'int', nullable: true })
  pulse: number | null;

  @Column({ type: 'int', nullable: true })
  respiratoryRate: number | null;

  @Column({ type: 'numeric', precision: 4, scale: 1, nullable: true })
  temperature: string | null;

  @Column({ type: 'numeric', precision: 5, scale: 1, nullable: true })
  weight: string | null;

  @Column({ type: 'numeric', precision: 5, scale: 1, nullable: true })
  height: string | null;

  @Column({ type: 'uuid' })
  recordedById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'recordedById' })
  recordedBy: User;

  @CreateDateColumn()
  recordedAt: Date;
}