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
import { Service } from '../services/service.entity.js';
import { User } from '../users/user.entity.js';
import { Department } from '../encounters/department.enum.js';
import { ServiceType } from '../services/service-type.enum.js';
import { OrderUrgency } from './order-urgency.enum.js';
import { OrderStatus } from './order-status.enum.js';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  encounterId: string;

  @ManyToOne(() => Encounter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'encounterId' })
  encounter: Encounter;

  @Column({ type: 'uuid' })
  serviceId: string;

  @ManyToOne(() => Service, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column({ type: 'varchar' })
  serviceName: string;

  @Column({ type: 'enum', enum: Department })
  department: Department;

  @Index()
  @Column({ type: 'enum', enum: ServiceType })
  serviceType: ServiceType;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'enum', enum: OrderUrgency, default: OrderUrgency.ROUTINE })
  urgency: OrderUrgency;

  @Index()
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ORDERED })
  status: OrderStatus;

  @Column({ type: 'uuid' })
  orderedById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'orderedById' })
  orderedBy: User;

  @CreateDateColumn()
  orderedAt: Date;
}