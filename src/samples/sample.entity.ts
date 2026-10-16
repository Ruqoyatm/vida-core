import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from '../orders/order.entity.js';
import { User } from '../users/user.entity.js';
import { SampleCondition } from './sample-condition.enum.js';
import { SampleStatus } from './sample-status.enum.js';

@Entity('samples')
export class Sample {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'varchar', unique: true })
  sampleNo: string;

  @Column({ type: 'varchar' })
  sampleType: string;

  @Column({ type: 'enum', enum: SampleCondition })
  condition: SampleCondition;

  @Column({ type: 'enum', enum: SampleStatus })
  status: SampleStatus;

  @Column({ type: 'uuid' })
  collectedById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'collectedById' })
  collectedBy: User;

  @Column({ type: 'timestamptz' })
  collectedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;
}