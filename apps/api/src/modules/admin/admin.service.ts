import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService
  ) {}

  users() {
    return this.usersService.listUsers();
  }

  updateUserStatus(userId: string, status: UserStatus) {
    return this.usersService.setStatus(userId, status);
  }

  async stats() {
    const [users, assets, orders, volume] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.asset.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { total: true } })
    ]);

    return {
      users,
      assets,
      orders,
      totalVolume: Number(volume._sum.total ?? 0)
    };
  }
}
