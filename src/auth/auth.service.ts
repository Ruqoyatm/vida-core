import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('A user with that email already exists');
    }

    const passwordHash = await argon2.hash(password);
    const user = await this.usersService.create(email, passwordHash, fullName);

    return { id: user.id, email: user.email, fullName: user.fullName };
  }

  async login(identifier: string, password: string) {
    const user = await this.usersService.findByEmailOrStaffNumber(identifier);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException(
        'Account is locked. Please try again later.',
      );
    }

    const valid = await argon2.verify(user.passwordHash, password);

    if (!valid) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
        user.failedLoginAttempts = 0;
      }

      await this.usersService.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    await this.usersService.save(user);

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      roles: user.roles,
      department: user.department,
    });

    return {
      access_token: token,
      mustChangePassword: user.mustChangePassword,
    };
  }
}