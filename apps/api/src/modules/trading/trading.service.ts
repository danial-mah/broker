import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderSide } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class TradingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const asset = await this.prisma.asset.findUniqueOrThrow({ where: { symbol: dto.symbol.toUpperCase() } });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const price = Number(asset.price);
    const total = price * dto.quantity;

    if (dto.side === OrderSide.BUY && Number(user.cashBalance) < total) {
      throw new BadRequestException('Insufficient buying power');
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          assetId: asset.id,
          side: dto.side,
          quantity: dto.quantity,
          price,
          total,
          status: 'FILLED',
          filledAt: new Date()
        },
        include: { asset: true }
      });

      if (dto.side === OrderSide.BUY) {
        await tx.user.update({ where: { id: userId }, data: { cashBalance: { decrement: total } } });
        await tx.position.upsert({
          where: { userId_assetId: { userId, assetId: asset.id } },
          create: { userId, assetId: asset.id, quantity: dto.quantity, averageCost: price },
          update: { quantity: { increment: dto.quantity } }
        });
      } else {
        const position = await tx.position.findUnique({ where: { userId_assetId: { userId, assetId: asset.id } } });
        if (!position || Number(position.quantity) < dto.quantity) {
          throw new BadRequestException('Insufficient position quantity');
        }
        await tx.user.update({ where: { id: userId }, data: { cashBalance: { increment: total } } });
        await tx.position.update({
          where: { userId_assetId: { userId, assetId: asset.id } },
          data: { quantity: { decrement: dto.quantity } }
        });
      }

      return createdOrder;
    });

    await this.notifications.create(userId, 'Order filled', `${dto.side} ${dto.quantity} ${asset.symbol} at ${price}`);
    return order;
  }

  orderHistory(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  portfolio(userId: string) {
    return this.prisma.position.findMany({
      where: { userId, quantity: { gt: 0 } },
      include: { asset: true },
      orderBy: { updatedAt: 'desc' }
    });
  }
}
