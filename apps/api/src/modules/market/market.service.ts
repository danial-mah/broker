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

type LiveMarketData = {
  price?: number;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
  rank?: number;
  dataSource?: string;
  dataUpdatedAt?: string;
};

type StooqQuote = {
  symbol: string;
  close: number;
  volume: number;
  date: string;
  time: string;
};

type CoinGeckoMarket = {
  id: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  last_updated: string;
};

const stooqSymbols: Record<string, string> = {
  AAPL: 'aapl.us',
  NVDA: 'nvda.us',
  VOO: 'voo.us'
};

const coinGeckoIds: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum'
};

const yahooNewsSymbols: Record<string, string> = {
  BTC: 'BTC-USD',
  ETH: 'ETH-USD'
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
    const assetsWithLiveData = await this.withLiveMarketData(assets);
    await this.cache.setJson(cacheKey, assetsWithLiveData, 60);
    return assetsWithLiveData;
  }

  async getAsset(symbol: string) {
    const asset = await this.prisma.asset.findUniqueOrThrow({
      where: { symbol: symbol.toUpperCase() },
      include: { candles: { orderBy: { timestamp: 'asc' }, take: 200 } }
    });
    return this.withLiveMarketData(asset);
  }

  async getAssetNews(symbol: string) {
    const asset = await this.prisma.asset.findUniqueOrThrow({
      where: { symbol: symbol.toUpperCase() }
    });
    const liveNews = await this.fetchYahooNews(asset.symbol);

    if (liveNews.length) {
      return liveNews;
    }

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

  private async withLiveMarketData<T extends { symbol: string }>(asset: T): Promise<T & LiveMarketData>;
  private async withLiveMarketData<T extends { symbol: string }>(assets: T[]): Promise<Array<T & LiveMarketData>>;
  private async withLiveMarketData<T extends { symbol: string }>(input: T | T[]) {
    const assets = Array.isArray(input) ? input : [input];
    const liveData = await this.fetchLiveMarketData(assets.map((asset) => asset.symbol));
    const merged = assets.map((asset) => {
      const data = liveData[asset.symbol];
      if (!data) {
        return { ...asset, dataSource: 'seed' };
      }

      return {
        ...asset,
        price: data.price ?? (asset as T & { price?: unknown }).price,
        change24h: data.change24h ?? (asset as T & { change24h?: unknown }).change24h,
        volume24h: data.volume24h ?? (asset as T & { volume24h?: unknown }).volume24h,
        marketCap: data.marketCap ?? (asset as T & { marketCap?: unknown }).marketCap,
        rank: data.rank,
        dataSource: data.dataSource,
        dataUpdatedAt: data.dataUpdatedAt
      };
    });

    return Array.isArray(input) ? merged : merged[0];
  }

  private async fetchLiveMarketData(symbols: string[]) {
    const [stooqData, coinGeckoData] = await Promise.all([this.fetchStooqQuotes(symbols), this.fetchCoinGeckoMarkets(symbols)]);
    return { ...stooqData, ...coinGeckoData };
  }

  private async fetchStooqQuotes(symbols: string[]) {
    const requested = symbols.filter((symbol) => stooqSymbols[symbol]).map((symbol) => stooqSymbols[symbol]);
    if (!requested.length) {
      return {};
    }

    try {
      const response = await fetch(`https://stooq.com/q/l/?s=${requested.join('+')}&f=sd2t2ohlcv&h&e=csv`);
      if (!response.ok) {
        return {};
      }

      const quotes = this.parseStooqCsv(await response.text());
      const liveData: Record<string, LiveMarketData> = {};

      for (const [symbol, stooqSymbol] of Object.entries(stooqSymbols)) {
        const quote = quotes.find((item) => item.symbol.toLowerCase() === stooqSymbol.toLowerCase());
        if (!quote) {
          continue;
        }

        liveData[symbol] = {
          price: quote.close,
          volume24h: quote.volume,
          dataSource: 'Stooq',
          dataUpdatedAt: new Date(`${quote.date}T${quote.time}`).toISOString()
        };
      }

      return liveData;
    } catch {
      return {};
    }
  }

  private parseStooqCsv(csv: string): StooqQuote[] {
    return csv
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((line) => {
        const [symbol, date, time, , , , close, volume] = line.split(',');
        return {
          symbol,
          date,
          time,
          close: Number(close),
          volume: Number(volume)
        };
      })
      .filter((quote) => quote.symbol && Number.isFinite(quote.close));
  }

  private async fetchCoinGeckoMarkets(symbols: string[]) {
    const ids = symbols.filter((symbol) => coinGeckoIds[symbol]).map((symbol) => coinGeckoIds[symbol]);
    if (!ids.length) {
      return {};
    }

    try {
      const params = new URLSearchParams({
        vs_currency: 'usd',
        ids: ids.join(','),
        price_change_percentage: '24h'
      });
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?${params}`);
      if (!response.ok) {
        return {};
      }

      const markets = (await response.json()) as CoinGeckoMarket[];
      const liveData: Record<string, LiveMarketData> = {};

      for (const [symbol, id] of Object.entries(coinGeckoIds)) {
        const market = markets.find((item) => item.id === id);
        if (!market) {
          continue;
        }

        liveData[symbol] = {
          price: market.current_price,
          change24h: market.price_change_percentage_24h,
          volume24h: market.total_volume,
          marketCap: market.market_cap,
          rank: market.market_cap_rank,
          dataSource: 'CoinGecko',
          dataUpdatedAt: market.last_updated
        };
      }

      return liveData;
    } catch {
      return {};
    }
  }

  private async fetchYahooNews(symbol: string): Promise<MarketNewsItem[]> {
    try {
      const feedSymbol = yahooNewsSymbols[symbol] ?? symbol;
      const params = new URLSearchParams({ s: feedSymbol, region: 'US', lang: 'en-US' });
      const response = await fetch(`https://feeds.finance.yahoo.com/rss/2.0/headline?${params}`);
      if (!response.ok) {
        return [];
      }

      return this.parseRss(await response.text()).slice(0, 8);
    } catch {
      return [];
    }
  }

  private parseRss(xml: string): MarketNewsItem[] {
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match, index) => {
      const item = match[1];
      const title = this.decodeXml(this.getXmlValue(item, 'title'));
      const summary = this.decodeXml(this.getXmlValue(item, 'description'));
      const url = this.decodeXml(this.getXmlValue(item, 'link'));
      const publishedAt = new Date(this.decodeXml(this.getXmlValue(item, 'pubDate'))).toISOString();

      return {
        id: this.decodeXml(this.getXmlValue(item, 'guid')) || `${title}-${index}`,
        title,
        summary,
        source: this.getNewsSource(url),
        publishedAt,
        url,
        sentiment: 'neutral'
      };
    });
  }

  private getXmlValue(xml: string, tag: string) {
    return xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() ?? '';
  }

  private decodeXml(value: string) {
    return value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\u00e2\u0080\u0099/g, "'")
      .replace(/\u00e2\u0080\u009c|\u00e2\u0080\u009d/g, '"')
      .replace(/\u00e2\u0080\u0094/g, '-')
      .replace(/\u00e2\u0080\u0093/g, '-');
  }

  private getNewsSource(url: string) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return 'Yahoo Finance';
    }
  }
}
