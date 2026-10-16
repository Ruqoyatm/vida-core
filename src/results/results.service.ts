import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './result.entity.js';
import { ResultValue } from './result-value.entity.js';
import { Order } from '../orders/order.entity.js';
import { Analyte } from '../analytes/analyte.entity.js';
import { OrderStatus } from '../orders/order-status.enum.js';
import { ResultStatus } from './result-status.enum.js';
import { ResultFlag } from './result-flag.enum.js';
import { AnalyteValueType } from '../analytes/analyte-value-type.enum.js';
import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    @InjectRepository(ResultValue)
    private valuesRepository: Repository<ResultValue>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Analyte)
    private analytesRepository: Repository<Analyte>,
    private auditService: AuditService,
  ) {}

  private flagFor(analyte: Analyte, value: string) {
    const text = value.trim();

    if (analyte.valueType === AnalyteValueType.TEXT) {
      if (!analyte.abnormalValues) return ResultFlag.NORMAL;

      const bad = analyte.abnormalValues
        .split(',')
        .map((word) => word.trim().toLowerCase());

      return bad.includes(text.toLowerCase())
        ? ResultFlag.ABNORMAL
        : ResultFlag.NORMAL;
    }

    const number = Number(text);
    if (Number.isNaN(number)) return ResultFlag.NORMAL;

    if (analyte.criticalLow !== null && number < analyte.criticalLow) {
      return ResultFlag.CRITICAL_LOW;
    }
    if (analyte.criticalHigh !== null && number > analyte.criticalHigh) {
      return ResultFlag.CRITICAL_HIGH;
    }
    if (analyte.refLow !== null && number < analyte.refLow) {
      return ResultFlag.LOW;
    }
    if (analyte.refHigh !== null && number > analyte.refHigh) {
      return ResultFlag.HIGH;
    }

    return ResultFlag.NORMAL;
  }

  private rangeText(analyte: Analyte) {
    if (analyte.refLow === null && analyte.refHigh === null) return null;
    return analyte.refLow + ' - ' + analyte.refHigh;
  }

  async findByOrder(orderId: string) {
    return this.resultsRepository.find({
      where: { orderId },
      relations: { values: true },
      order: { version: 'DESC' },
    });
  }

  async create(
    orderId: string,
    data: { values: { analyteId: string; value: string }[] },
    enteredById: string,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const entries = data.values || [];

    if (entries.length === 0) {
      throw new BadRequestException('Enter at least one value');
    }

    const analytes = await this.analytesRepository.find({
      where: { serviceId: order.serviceId },
    });

    const previous = await this.resultsRepository.find({
      where: { orderId },
      order: { version: 'DESC' },
    });

    for (const old of previous) {
      old.status = ResultStatus.SUPERSEDED;
    }

    if (previous.length > 0) {
      await this.resultsRepository.save(previous);
    }

    const result = this.resultsRepository.create({
      orderId,
      version: previous.length + 1,
      status: ResultStatus.PENDING,
      enteredById,
    });

    const saved = await this.resultsRepository.save(result);

    const values = entries.map((entry) => {
      const analyte = analytes.find((a) => a.id === entry.analyteId);

      if (!analyte) {
        throw new BadRequestException('Unknown analyte on this test');
      }

      return this.valuesRepository.create({
        resultId: saved.id,
        analyteId: analyte.id,
        analyteName: analyte.name,
        unit: analyte.unit,
        refRange: this.rangeText(analyte),
        value: entry.value.trim(),
        flag: this.flagFor(analyte, entry.value),
        sortOrder: analyte.sortOrder,
      });
    });

    await this.valuesRepository.save(values);

    order.status = OrderStatus.RESULTED;
    await this.ordersRepository.save(order);

    await this.auditService.record({
      userId: enteredById,
      action: 'result_entered',
      entity: 'result',
      entityId: saved.id,
      patientId: null,
      before: null,
      after: null,
      reason: null,
    });

    return this.resultsRepository.findOne({
      where: { id: saved.id },
      relations: { values: true },
    });
  }

  async createReport(
    orderId: string,
    data: { findings: string; impression: string },
    enteredById: string,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!data.findings || !data.findings.trim()) {
      throw new BadRequestException('Findings are required');
    }

    const previous = await this.resultsRepository.find({
      where: { orderId },
      order: { version: 'DESC' },
    });

    for (const old of previous) {
      old.status = ResultStatus.SUPERSEDED;
    }

    if (previous.length > 0) {
      await this.resultsRepository.save(previous);
    }

    const result = this.resultsRepository.create({
      orderId,
      version: previous.length + 1,
      status: ResultStatus.PENDING,
      findings: data.findings.trim(),
      impression: data.impression ? data.impression.trim() : null,
      enteredById,
    });

    const saved = await this.resultsRepository.save(result);

    order.status = OrderStatus.RESULTED;
    await this.ordersRepository.save(order);

    await this.auditService.record({
      userId: enteredById,
      action: 'report_entered',
      entity: 'result',
      entityId: saved.id,
      patientId: null,
      before: null,
      after: null,
      reason: null,
    });

    return saved;
  }

  async findByStatus(status: ResultStatus) {
    const results = await this.resultsRepository.find({
      where: { status },
      relations: {
        values: true,
        enteredBy: true,
        verifiedBy: true,
        order: { encounter: { patient: true } },
      },
      order: { enteredAt: 'ASC' },
    });

    return results.map((result) => ({
      id: result.id,
      orderId: result.orderId,
      version: result.version,
      status: result.status,
      findings: result.findings,
      impression: result.impression,
      enteredAt: result.enteredAt,
      verifiedAt: result.verifiedAt,
      enteredByName: result.enteredBy ? result.enteredBy.fullName : '',
      verifiedByName: result.verifiedBy ? result.verifiedBy.fullName : '',
      serviceName: result.order.serviceName,
      hospitalNo: result.order.encounter.patient.hospitalNo,
      patientName:
        result.order.encounter.patient.surname +
        ' ' +
        result.order.encounter.patient.firstName,
      values: result.values,
    }));
  }

  async verify(resultId: string, verifiedById: string) {
    const result = await this.resultsRepository.findOne({
      where: { id: resultId },
      relations: { order: true },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    if (result.status !== ResultStatus.PENDING) {
      throw new BadRequestException('This result is not awaiting verification');
    }

    if (result.enteredById === verifiedById) {
      throw new ForbiddenException(
        'A result must be verified by someone other than the person who entered it',
      );
    }

    result.status = ResultStatus.RELEASED;
    result.verifiedById = verifiedById;
    result.verifiedAt = new Date();

    const saved = await this.resultsRepository.save(result);

    result.order.status = OrderStatus.RELEASED;
    await this.ordersRepository.save(result.order);

    await this.auditService.record({
      userId: verifiedById,
      action: 'result_verified',
      entity: 'result',
      entityId: result.id,
      patientId: null,
      before: null,
      after: null,
      reason: null,
    });

    return saved;
  }

  async reject(resultId: string, reason: string, verifiedById: string) {
    const result = await this.resultsRepository.findOne({
      where: { id: resultId },
      relations: { order: true },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    if (result.status !== ResultStatus.PENDING) {
      throw new BadRequestException('This result is not awaiting verification');
    }

    if (result.enteredById === verifiedById) {
      throw new ForbiddenException(
        'A result must be checked by someone other than the person who entered it',
      );
    }

    result.status = ResultStatus.REJECTED;
    result.rejectionReason = reason ? reason.trim() : null;

    const saved = await this.resultsRepository.save(result);

    result.order.status = OrderStatus.COLLECTED;
    await this.ordersRepository.save(result.order);

    await this.auditService.record({
      userId: verifiedById,
      action: 'result_rejected',
      entity: 'result',
      entityId: result.id,
      patientId: null,
      before: null,
      after: null,
      reason: result.rejectionReason,
    });

    return saved;
  }

  async findForClinician(doctorId: string) {
    const results = await this.resultsRepository
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.order', 'o')
      .innerJoinAndSelect('o.encounter', 'e')
      .innerJoinAndSelect('e.patient', 'p')
      .leftJoinAndSelect('r.values', 'v')
      .where('r.status = :status', { status: ResultStatus.RELEASED })
      .andWhere('o.orderedById = :doctorId', { doctorId })
      .orderBy('r.verifiedAt', 'DESC')
      .getMany();

    return results.map((result) => ({
      id: result.id,
      orderId: result.orderId,
      version: result.version,
      verifiedAt: result.verifiedAt,
      acknowledgedAt: result.acknowledgedAt,
      serviceName: result.order.serviceName,
      department: result.order.department,
      hospitalNo: result.order.encounter.patient.hospitalNo,
      patientName:
        result.order.encounter.patient.surname +
        ' ' +
        result.order.encounter.patient.firstName,
      values: result.values,
      findings: result.findings,
      impression: result.impression,
    }));
  }

  async findOneDetail(id: string) {
    const result = await this.resultsRepository.findOne({
      where: { id },
      relations: {
        values: true,
        enteredBy: true,
        verifiedBy: true,
        order: { encounter: { patient: true } },
      },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    return {
      id: result.id,
      orderId: result.orderId,
      encounterId: result.order.encounterId,
      version: result.version,
      status: result.status,
      findings: result.findings,
      impression: result.impression,
      enteredAt: result.enteredAt,
      verifiedAt: result.verifiedAt,
      acknowledgedAt: result.acknowledgedAt,
      enteredByName: result.enteredBy ? result.enteredBy.fullName : '',
      verifiedByName: result.verifiedBy ? result.verifiedBy.fullName : '',
      serviceName: result.order.serviceName,
      department: result.order.department,
      hospitalNo: result.order.encounter.patient.hospitalNo,
      patientName:
        result.order.encounter.patient.surname +
        ' ' +
        result.order.encounter.patient.firstName,
      values: result.values,
    };
  }

  async acknowledge(id: string, userId: string) {
    const result = await this.resultsRepository.findOne({ where: { id } });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    if (result.status !== ResultStatus.RELEASED) {
      throw new BadRequestException('This result has not been released yet');
    }

    if (result.acknowledgedAt) {
      return result;
    }

    result.acknowledgedById = userId;
    result.acknowledgedAt = new Date();

    const saved = await this.resultsRepository.save(result);

    await this.auditService.record({
      userId,
      action: 'result_acknowledged',
      entity: 'result',
      entityId: result.id,
      patientId: null,
      before: null,
      after: null,
      reason: null,
    });

    return saved;
  }
}