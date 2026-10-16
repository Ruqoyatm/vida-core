import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Sample } from './sample.entity.js';
import { Order } from '../orders/order.entity.js';
import { OrderStatus } from '../orders/order-status.enum.js';
import { SampleCondition } from './sample-condition.enum.js';
import { SampleStatus } from './sample-status.enum.js';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample)
    private samplesRepository: Repository<Sample>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  private async nextSampleNo(): Promise<string> {
    const rows = await this.samplesRepository.query(
      "SELECT nextval('lab_sample_no_seq') AS n",
    );
    const year = new Date().getFullYear();
    return 'LAB-' + year + '-' + String(rows[0].n).padStart(5, '0');
  }

  async findByOrder(orderId: string) {
    return this.samplesRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    orderId: string,
    data: {
      sampleType: string;
      condition: SampleCondition;
      collectedAt: string;
      notes?: string;
    },
    collectedById: string,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const good = await this.samplesRepository.findOne({
      where: { orderId, status: Not(SampleStatus.REJECTED) },
    });

    if (good) {
      throw new ConflictException(
        `A sample was already collected for this order: ${good.sampleNo}`,
      );
    }

    const rejected = data.condition !== SampleCondition.ACCEPTABLE;

    const sample = this.samplesRepository.create({
      orderId,
      sampleNo: await this.nextSampleNo(),
      sampleType: data.sampleType.trim(),
      condition: data.condition,
      status: rejected ? SampleStatus.REJECTED : SampleStatus.COLLECTED,
      collectedById,
      collectedAt: new Date(data.collectedAt),
      notes: data.notes ? data.notes.trim() : null,
    });

    const saved = await this.samplesRepository.save(sample);

    if (!rejected) {
      order.status = OrderStatus.COLLECTED;
      await this.ordersRepository.save(order);
    }

    return saved;
  }
}