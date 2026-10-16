import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../users/user.entity.js';
import { AuditService } from '../audit/audit.service.js';
import { RolesService } from '../roles/roles.service.js';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private auditService: AuditService,
    private rolesService: RolesService,
  ) {}

  private statusOf(user: User) {
    if (!user.isActive) return 'deactivated';

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      return 'locked';
    }

    return 'active';
  }

  private toRow(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      staffNumber: user.staffNumber,
      email: user.email,
      roles: user.roles,
      department: user.department,
      lastLoginAt: user.lastLoginAt,
      status: this.statusOf(user),
      mustChangePassword: user.mustChangePassword,
    };
  }

  async findAll() {
    const users = await this.usersRepository.find({
      order: { fullName: 'ASC' },
    });

    return users.map((user) => this.toRow(user));
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toRow(user);
  }

  async create(
    data: {
      fullName: string;
      staffNumber: string;
      email: string;
      roles: string[];
      department: string;
      temporaryPassword: string;
    },
    createdById: string,
  ) {
    await this.rolesService.assertRolesExist(data.roles ?? []);

    if (!data.department || !data.department.trim()) {
      throw new ConflictException('Department is required');
    }

    const existingStaff = await this.usersRepository.findOne({
      where: { staffNumber: data.staffNumber.trim() },
    });

    if (existingStaff) {
      throw new ConflictException(
        `Staff ID ${data.staffNumber} is already in use`,
      );
    }

    const existingEmail = await this.usersRepository.findOne({
      where: { email: data.email.trim().toLowerCase() },
    });

    if (existingEmail) {
      throw new ConflictException('That email address is already in use');
    }

    const user = this.usersRepository.create({
      fullName: data.fullName.trim(),
      staffNumber: data.staffNumber.trim(),
      email: data.email.trim().toLowerCase(),
      roles: data.roles,
      department: data.department.trim(),
      passwordHash: await argon2.hash(data.temporaryPassword),
      mustChangePassword: true,
      isActive: true,
    });

    const saved = await this.usersRepository.save(user);

    await this.auditService.record({
      userId: createdById,
      action: 'user.created',
      entity: 'user',
      entityId: saved.id,
      after: this.toRow(saved),
    });

    return this.toRow(saved);
  }

  async update(
    id: string,
    data: {
      fullName?: string;
      roles?: string[];
      department?: string;
      status?: string;
      reason?: string;
    },
    changedById: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const before = this.toRow(user);

    if (data.fullName !== undefined) {
      user.fullName = data.fullName.trim();
    }

    if (data.roles !== undefined) {
      await this.rolesService.assertRolesExist(data.roles);
      user.roles = data.roles;
    }

    if (data.department !== undefined) {
      if (!data.department.trim()) {
        throw new ConflictException('Department cannot be blank');
      }
      user.department = data.department.trim();
    }

    if (data.status === 'active') {
      user.isActive = true;
      user.lockedUntil = null;
      user.failedLoginAttempts = 0;
    }

    if (data.status === 'locked') {
      user.isActive = true;
      user.lockedUntil = new Date('2100-01-01');
    }

    if (data.status === 'deactivated') {
      user.isActive = false;
    }

    const saved = await this.usersRepository.save(user);

    await this.auditService.record({
      userId: changedById,
      action: 'user.updated',
      entity: 'user',
      entityId: saved.id,
      before,
      after: this.toRow(saved),
      reason: data.reason ?? null,
    });

    return this.toRow(saved);
  }
}