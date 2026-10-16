import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Encounter } from '../encounters/encounter.entity.js';
import { User } from '../users/user.entity.js';
import { DiagnosisType } from './diagnosis-type.enum.js';
import { DiagnosisCertainty } from './diagnosis-certainty.enum.js';

@Entity('diagnoses')
export class Diagnosis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  encounterId: string;

  @ManyToOne(() => Encounter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'encounterId' })
  encounter: Encounter;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string | null;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'enum', enum: DiagnosisType, default: DiagnosisType.PRIMARY })
  type: DiagnosisType;

  @Column({ type: 'uuid' })
  diagnosedById: string;

    @Column({
    type: 'enum',
    enum: DiagnosisCertainty,
    default: DiagnosisCertainty.PROVISIONAL,
  })
  certainty: DiagnosisCertainty;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'diagnosedById' })
  diagnosedBy: User;

  @CreateDateColumn()
  diagnosedAt: Date;
}