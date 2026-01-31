import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor(config: ConfigService) {
    this.redis = new Redis(config.get<string>('REDIS_URL', 'redis://localhost:6379'), {
      lazyConnect: true,
      maxRetriesPerRequest: 2
    });
  }

  async getJson<T>(key: string): Promise<T | null> {
    await this.redis.connect().catch(() => undefined);
    const value = await this.redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async setJson(key: string, value: unknown, ttlSeconds = 60) {
    await this.redis.connect().catch(() => undefined);
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async onModuleDestroy() {
    this.redis.disconnect();
  }
}
