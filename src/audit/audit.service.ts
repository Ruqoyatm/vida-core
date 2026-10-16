import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity.js';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async record(entry: {
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    patientId?: string | null;
    before?: unknown;
    after?: unknown;
    reason?: string | null;
  }) {
    const log = this.auditRepository.create({
      userId: entry.userId,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      patientId: entry.patientId ?? null,
      before: entry.before ?? null,
      after: entry.after ?? null,
      reason: entry.reason ? entry.reason.trim() : null,
    });

    return this.auditRepository.save(log);
  }

  async find(filter: {
    user?: string;
    patient?: string;
    from?: string;
    to?: string;
  }) {
    const query = this.auditRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.user', 'u');

    if (filter.user) {
      query.andWhere('a.userId = :user', { user: filter.user });
    }

    if (filter.patient) {
      query.andWhere('a.patientId = :patient', { patient: filter.patient });
    }

    if (filter.from) {
      query.andWhere('a.at >= :from', { from: new Date(filter.from) });
    }

    if (filter.to) {
      query.andWhere('a.at <= :to', { to: new Date(filter.to) });
    }

    const logs = await query.orderBy('a.at', 'DESC').limit(200).getMany();

    return logs.map((log) => ({
      id: log.id,
      at: log.at,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      patientId: log.patientId,
      reason: log.reason,
      before: log.before,
      after: log.after,
      userName: log.user ? log.user.fullName : '',
    }));
  }
}