import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  type Relation,
} from 'typeorm';
import { Result } from './result.entity.js';
import { ResultFlag } from './result-flag.enum.js';

@Entity('result_values')
export class ResultValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  resultId: string;

  @ManyToOne(() => Result, (result) => result.values, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resultId' })
  result: Relation<Result>;

  @Column({ type: 'uuid', nullable: true })
  analyteId: string | null;

  @Column({ type: 'varchar' })
  analyteName: string;

  @Column({ type: 'varchar', nullable: true })
  unit: string | null;

  @Column({ type: 'varchar', nullable: true })
  refRange: string | null;

  @Column({ type: 'varchar' })
  value: string;

  @Column({ type: 'enum', enum: ResultFlag, default: ResultFlag.NORMAL })
  flag: ResultFlag;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;
}