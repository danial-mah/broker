import { Injectable, NotFoundException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findByIdOrThrow(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  createUser(email: string, name: string, passwordHash: string) {
    return this.usersRepository.create({ email, name, passwordHash });
  }

  listUsers() {
    return this.usersRepository.list();
  }

  setStatus(id: string, status: UserStatus) {
    return this.usersRepository.updateStatus(id, status);
  }
}
