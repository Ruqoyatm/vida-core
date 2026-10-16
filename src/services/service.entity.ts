import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ServiceType } from './service-type.enum.js';
import { Department } from '../encounters/department.enum.js';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Index()
  @Column({ type: 'enum', enum: Department })
  department: Department;

  @Index()
  @Column({ type: 'enum', enum: ServiceType })
  type: ServiceType;

  @Column({ type: 'integer' })
  fee: number;

  @Column({ type: 'date' })
  effectiveFrom: string;

  @Index()
  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}