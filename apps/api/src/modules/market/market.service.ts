import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';

type MarketNewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
};

const newsBySymbol: Record<string, MarketNewsItem[]> = {
  AAPL: [
    {
      id: 'aapl-services-margin',
      title: 'Apple services revenue keeps margins in focus',
      summary: 'Analysts are watching services growth and device upgrade demand as key drivers for the next earnings cycle.',
      source: 'Broker Wire',
      publishedAt: '2026-05-16T13:30:00.000Z',
      url: 'https://example.com/news/aapl-services-margin',
      sentiment: 'positive'
    },
    {
      id: 'aapl-supply-chain',
      title: 'Supply chain checks point to steady premium device demand',
      summary: 'Recent channel checks suggest premium models remain resilient, though investors continue to monitor regional demand shifts.',
      source: 'Market Desk',
      publishedAt: '2026-05-15T16:10:00.000Z',
      url: 'https://example.com/news/aapl-supply-chain',
      sentiment: 'neutral'
    }
  ],
  NVDA: [
    {
      id: 'nvda-ai-capex',
      title: 'AI infrastructure spending remains a tailwind for NVIDIA',
      summary: 'Cloud and enterprise capital expenditure plans continue to support demand expectations for accelerated computing.',
      source: 'Broker Wire',
      publishedAt: '2026-05-16T11:45:00.000Z',
      url: 'https://example.com/news/nvda-ai-capex',
      sentiment: 'positive'
    },
    {
      id: 'nvda-valuation-watch',
      title: 'Valuation debate intensifies after strong sector rally',
      summary: 'Traders are balancing powerful revenue momentum against elevated expectations across semiconductor leaders.',
      source: 'Market Desk',
      publishedAt: '2026-05-14T19:20:00.000Z',
      url: 'https://example.com/news/nvda-valuation-watch',
      sentiment: 'neutral'
    }
  ],
  BTC: [
    {
      id: 'btc-liquidity',
      title: 'Bitcoin liquidity improves as risk appetite stabilizes',
      summary: 'Spot volumes and derivatives positioning show renewed interest after a quieter stretch for major crypto assets.',
      source: 'Crypto Tape',
      publishedAt: '2026-05-16T08:00:00.000Z',
      url: 'https://example.com/news/btc-liquidity',
      sentiment: 'positive'
    },
    {
      id: 'btc-volatility',
      title: 'Volatility gauges stay elevated near recent trading range',
      summary: 'Options markets continue to price larger swings as macro catalysts remain in focus for digital assets.',
      source: 'Market Desk',
      publishedAt: '2026-05-15T10:25:00.000Z',
      url: 'https://example.com/news/btc-volatility',
      sentiment: 'neutral'
    }
  ],
  ETH: [
    {
      id: 'eth-network-activity',
      title: 'Ethereum network activity trends higher',
      summary: 'On-chain activity and layer-two usage are drawing attention as investors assess fee demand and ecosystem growth.',
      source: 'Crypto Tape',
      publishedAt: '2026-05-16T09:15:00.000Z',
      url: 'https://example.com/news/eth-network-activity',
      sentiment: 'positive'
    },
    {
      id: 'eth-staking',
      title: 'Staking flows remain a key supply-side metric',
      summary: 'Market participants are watching validator flows for signals about long-term holder conviction.',
      source: 'Broker Wire',
      publishedAt: '2026-05-13T12:40:00.000Z',
      url: 'https://example.com/news/eth-staking',
      sentiment: 'neutral'
    }
  ],
  VOO: [
    {
      id: 'voo-index-breadth',
      title: 'S&P 500 breadth improves across cyclical groups',
      summary: 'Broader participation outside mega-cap technology is helping index investors watch for a more durable advance.',
      source: 'ETF Monitor',
      publishedAt: '2026-05-16T14:05:00.000Z',
      url: 'https://example.com/news/voo-index-breadth',
      sentiment: 'positive'
    },
    {
      id: 'voo-rates',
      title: 'Rate expectations remain central for broad-market ETFs',
      summary: 'Treasury yields and inflation data continue to shape flows into large-cap equity index products.',
      source: 'Market Desk',
      publishedAt: '2026-05-15T15:35:00.000Z',
      url: 'https://example.com/news/voo-rates',
      sentiment: 'neutral'
    }
  ]
};

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

  async getAssetNews(symbol: string) {
    const asset = await this.prisma.asset.findUniqueOrThrow({
      where: { symbol: symbol.toUpperCase() }
    });

    return (
      newsBySymbol[asset.symbol] ?? [
        {
          id: `${asset.symbol.toLowerCase()}-market-brief`,
          title: `${asset.name} market brief`,
          summary: 'No dedicated headlines are available yet, but price, volume, and market-cap changes remain available in the market view.',
          source: 'Broker Wire',
          publishedAt: '2026-05-16T12:00:00.000Z',
          url: `https://example.com/news/${asset.symbol.toLowerCase()}-market-brief`,
          sentiment: 'neutral'
        }
      ]
    );
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
