import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletTransactionDto } from './dto/wallet-transaction.dto';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  summary(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { cashBalance: true, walletTxs: { orderBy: { createdAt: 'desc' }, take: 30 } }
    });
  }

  deposit(userId: string, dto: WalletTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { cashBalance: { increment: dto.amount } } });
      return tx.walletTransaction.create({
        data: { userId, type: 'DEPOSIT', amount: dto.amount, note: dto.note }
      });
    });
  }

  async withdraw(userId: string, dto: WalletTransactionDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (Number(user.cashBalance) < dto.amount) {
      throw new BadRequestException('Insufficient cash balance');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { cashBalance: { decrement: dto.amount } } });
      return tx.walletTransaction.create({
        data: { userId, type: 'WITHDRAWAL', amount: dto.amount, note: dto.note }
      });
    });
  }
}
