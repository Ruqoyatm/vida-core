import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Patient } from '../patients/patient.entity.js';
import { User } from '../users/user.entity.js';
import { EncounterStatus } from './encounter-status.enum.js';
import { EncounterType } from './encounter-type.enum.js';
import { EncounterPriority } from './encounter-priority.enum.js';
import { Department } from './department.enum.js';

@Entity('encounters')
export class Encounter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'enum', enum: EncounterType, default: EncounterType.NEW })
  encounterType: EncounterType;

  @Column({ type: 'enum', enum: Department })
  department: Department;

  @Column({ type: 'varchar', nullable: true })
  presentingComplaint: string | null;

  @Column({ type: 'text', nullable: true })
  historyOfPresentingComplaint: string | null;

  @Column({ type: 'text', nullable: true })
  pastMedicalHistory: string | null;

  @Column({ type: 'text', nullable: true })
  examinationFindings: string | null;

  @Column({ type: 'enum', enum: EncounterPriority, default: EncounterPriority.ROUTINE })
  priority: EncounterPriority;

  @Index()
  @Column({ type: 'enum', enum: EncounterStatus, default: EncounterStatus.WAITING })
  status: EncounterStatus;

  @Column({ type: 'uuid', nullable: true })
  doctorId: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'doctorId' })
  doctor: User | null;

  @Column({ type: 'uuid' })
  checkedInById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'checkedInById' })
  checkedInBy: User;

  @CreateDateColumn()
  checkedInAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date;
}