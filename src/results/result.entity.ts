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
import { Order } from '../orders/order.entity.js';
import { User } from '../users/user.entity.js';
import { ResultValue } from './result-value.entity.js';
import { ResultStatus } from './result-status.enum.js';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'integer' })
  version: number;

  @Index()
  @Column({ type: 'enum', enum: ResultStatus, default: ResultStatus.PENDING })
  status: ResultStatus;

  @Column({ type: 'text', nullable: true })
  findings: string | null;

  @Column({ type: 'text', nullable: true })
  impression: string | null;

  @Column({ type: 'uuid' })
  enteredById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'enteredById' })
  enteredBy: User;

  @CreateDateColumn()
  enteredAt: Date;

  @Column({ type: 'uuid', nullable: true })
  verifiedById: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'verifiedById' })
  verifiedBy: User | null;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

    @Column({ type: 'uuid', nullable: true })
  acknowledgedById: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'acknowledgedById' })
  acknowledgedBy: User | null;

  @Column({ type: 'timestamptz', nullable: true })
  acknowledgedAt: Date | null;
  
  @OneToMany(() => ResultValue, (value) => value.result, { cascade: true })
  values: Relation<ResultValue>[];
}