import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encounter } from '../encounters/encounter.entity.js';
import { EncounterStatus } from '../encounters/encounter-status.enum.js';
import { Order } from '../orders/order.entity.js';
import { OrderStatus } from '../orders/order-status.enum.js';
import { Result } from '../results/result.entity.js';
import { ResultStatus } from '../results/result-status.enum.js';
import { Prescription } from '../prescriptions/prescription.entity.js';
import { PrescriptionStatus } from '../prescriptions/prescription-status.enum.js';
import { User } from '../users/user.entity.js';

@Injectable()
export class AdminSummaryService {
  constructor(
    @InjectRepository(Encounter)
    private encountersRepository: Repository<Encounter>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async summary() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const patientsToday = await this.encountersRepository
      .createQueryBuilder('e')
      .where('e."checkedInAt" >= :start', { start: startOfToday })
      .getCount();

    const waitingNow = await this.encountersRepository
      .createQueryBuilder('e')
      .where('e."checkedInAt" >= :start', { start: startOfToday })
      .andWhere('e.status IN (:...open)', {
        open: [EncounterStatus.WAITING, EncounterStatus.IN_CONSULTATION],
      })
      .getCount();

    const testsPending = await this.ordersRepository
      .createQueryBuilder('o')
      .where('o.status IN (:...pending)', {
        pending: [
          OrderStatus.ORDERED,
          OrderStatus.COLLECTED,
          OrderStatus.IN_PROGRESS,
        ],
      })
      .getCount();

    const resultsToVerify = await this.resultsRepository
      .createQueryBuilder('r')
      .where('r.status = :status', { status: ResultStatus.PENDING })
      .getCount();

    const prescriptionsWaiting = await this.prescriptionsRepository
      .createQueryBuilder('p')
      .where('p.status IN (:...waiting)', {
        waiting: [
          PrescriptionStatus.SENT,
          PrescriptionStatus.PARTIALLY_DISPENSED,
        ],
      })
      .getCount();

    const lockedAccounts = await this.usersRepository
      .createQueryBuilder('u')
      .where('u."lockedUntil" IS NOT NULL')
      .andWhere('u."lockedUntil" > :now', { now: new Date() })
      .getCount();

    const week = await this.week();
    const departments = await this.departments(startOfToday);

    return {
      stats: { patientsToday, waitingNow, testsPending, lockedAccounts },
      week,
      needsAttention: { lockedAccounts, resultsToVerify, prescriptionsWaiting },
      departments,
    };
  }

  private async week() {
    const days = [];

    for (let back = 6; back >= 0; back--) {
      const from = new Date();
      from.setHours(0, 0, 0, 0);
      from.setDate(from.getDate() - back);

      const to = new Date(from);
      to.setDate(to.getDate() + 1);

      const count = await this.encountersRepository
        .createQueryBuilder('e')
        .where('e."checkedInAt" >= :from', { from })
        .andWhere('e."checkedInAt" < :to', { to })
        .getCount();

      days.push({
        day: from.toLocaleDateString('en-GB', { weekday: 'short' }),
        count,
      });
    }

    return days;
  }

  private async departments(start: Date) {
    const rows = await this.encountersRepository
      .createQueryBuilder('e')
      .select('e.department', 'department')
      .addSelect('COUNT(*)', 'count')
      .where('e."checkedInAt" >= :start', { start })
      .groupBy('e.department')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany<{ department: string; count: string }>();

    return rows.map((row) => ({
      department: row.department,
      count: Number(row.count),
    }));
  }
}