import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
  return this.usersRepository.findOne({ where: { email } });
}

  findByEmailOrStaffNumber(identifier: string) {
  return this.usersRepository.findOne({
    where: [{ email: identifier }, { staffNumber: identifier }],
  });
  }

  findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(email: string, passwordHash: string, fullName: string) {
    const user = this.usersRepository.create({ email, passwordHash, fullName });
    return this.usersRepository.save(user);
  }

  save(user: User) {
    return this.usersRepository.save(user);
  }
}