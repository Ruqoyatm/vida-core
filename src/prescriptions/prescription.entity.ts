import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  type Relation,
} from 'typeorm';
import { Encounter } from '../encounters/encounter.entity.js';
import { User } from '../users/user.entity.js';
import { PrescriptionItem } from './prescription-item.entity.js';
import { PrescriptionStatus } from './prescription-status.enum.js';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  encounterId: string;

  @ManyToOne(() => Encounter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'encounterId' })
  encounter: Encounter;

  @Index()
  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.SENT,
  })
  status: PrescriptionStatus;

  @Column({ type: 'uuid' })
  prescribedById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'prescribedById' })
  prescribedBy: User;

  @CreateDateColumn()
  prescribedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  dispensedById: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'dispensedById' })
  dispensedBy: User | null;

  @Column({ type: 'timestamptz', nullable: true })
  dispensedAt: Date | null;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription, {
    cascade: true,
  })
  items: Relation<PrescriptionItem>[];
}