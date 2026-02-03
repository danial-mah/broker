import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService
  ) {}

  async listAssets(query?: string) {
    const cacheKey = `market:assets:${query ?? 'all'}`;
    const cached = await this.cache.getJson(cacheKey);
    if (cached) {
      return cached;
    }

    const assets = await this.prisma.asset.findMany({
      where: {
        isActive: true,
        OR: query
          ? [
              { symbol: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } }
            ]
          : undefined
      },
      orderBy: { marketCap: 'desc' }
    });
    await this.cache.setJson(cacheKey, assets, 15);
    return assets;
  }

  getAsset(symbol: string) {
    return this.prisma.asset.findUniqueOrThrow({
      where: { symbol: symbol.toUpperCase() },
      include: { candles: { orderBy: { timestamp: 'asc' }, take: 200 } }
    });
  }

  async randomTick() {
    const assets = await this.prisma.asset.findMany({ where: { isActive: true } });
    if (!assets.length) {
      return null;
    }
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const currentPrice = Number(asset.price);
    const drift = (Math.random() - 0.48) * 0.008;
    const nextPrice = Math.max(currentPrice * (1 + drift), 0.01);

    const updated = await this.prisma.asset.update({
      where: { id: asset.id },
      data: { price: nextPrice, change24h: Number(asset.change24h) + drift * 100 }
    });

    return {
      assetId: updated.id,
      symbol: updated.symbol,
      price: Number(updated.price),
      change24h: Number(updated.change24h),
      timestamp: new Date().toISOString()
    };
  }
}
