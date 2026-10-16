import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  type Relation,
} from 'typeorm';
import { Prescription } from './prescription.entity.js';
import { Product } from '../products/product.entity.js';
import { DrugRoute } from './drug-route.enum.js';

@Entity('prescription_items')
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  prescriptionId: string;

  @ManyToOne(() => Prescription, (p) => p.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prescriptionId' })
  prescription: Relation<Prescription>;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar' })
  drugName: string;

  @Column({ type: 'varchar' })
  dose: string;

  @Column({ type: 'enum', enum: DrugRoute })
  route: DrugRoute;

  @Column({ type: 'varchar' })
  frequency: string;

  @Column({ type: 'varchar' })
  duration: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'integer', default: 0 })
  dispensedQuantity: number;

  @Column({ type: 'integer' })
  price: number;
}