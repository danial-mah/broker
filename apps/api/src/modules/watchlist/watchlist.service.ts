import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.watchlistItem.findMany({
      where: { userId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async add(userId: string, symbol: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { symbol: symbol.toUpperCase(), isActive: true }
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return this.prisma.watchlistItem.upsert({
      where: { userId_assetId: { userId, assetId: asset.id } },
      update: {},
      create: { userId, assetId: asset.id },
      include: { asset: true }
    });
  }

  async remove(userId: string, symbol: string) {
    const item = await this.prisma.watchlistItem.findFirst({
      where: {
        userId,
        asset: { symbol: symbol.toUpperCase() }
      }
    });

    if (!item) {
      return { deleted: false };
    }

    await this.prisma.watchlistItem.delete({ where: { id: item.id } });
    return { deleted: true };
  }
}
