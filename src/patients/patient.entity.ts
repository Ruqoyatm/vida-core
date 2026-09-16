import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PatientSex } from './patient-sex.enum.js';
import { PayerType } from './payer-type.enum.js';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  hospitalNo: string;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: PatientSex })
  sex: PatientSex;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', nullable: true })
  nextOfKinName: string | null;

  @Column({ type: 'varchar', nullable: true })
  nextOfKinPhone: string | null;

  @Column({ type: 'enum', enum: PayerType, default: PayerType.SELF })
  payerType: PayerType;

  @Column({ type: 'varchar', nullable: true })
  payerRef: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}