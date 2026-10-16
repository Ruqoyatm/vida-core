import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Service } from '../services/service.entity.js';
import { AnalyteValueType } from './analyte-value-type.enum.js';

@Entity('analytes')
export class Analyte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  serviceId: string;

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: AnalyteValueType, default: AnalyteValueType.NUMERIC })
  valueType: AnalyteValueType;

  @Column({ type: 'varchar', nullable: true })
  unit: string | null;

  @Column({ type: 'real', nullable: true })
  refLow: number | null;

  @Column({ type: 'real', nullable: true })
  refHigh: number | null;

  @Column({ type: 'real', nullable: true })
  criticalLow: number | null;

  @Column({ type: 'real', nullable: true })
  criticalHigh: number | null;

  @Column({ type: 'varchar', nullable: true })
  abnormalValues: string | null;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;
}