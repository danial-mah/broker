import { AssetType, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadRootEnv() {
  const envPath = resolve(__dirname, '../../../.env');
  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) {
      continue;
    }
    process.env[match[1]] = match[2].replace(/^"|"$/g, '');
  }
}

loadRootEnv();

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@broker.dev' },
    update: {},
    create: {
      email: 'admin@broker.dev',
      name: 'Avery Admin',
      passwordHash,
      role: Role.ADMIN,
      cashBalance: 250000
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'demo@broker.dev' },
    update: {},
    create: {
      email: 'demo@broker.dev',
      name: 'Dani Investor',
      passwordHash,
      cashBalance: 50000
    }
  });

  const assets = await Promise.all(
    [
      ['AAPL', 'Apple Inc.', AssetType.STOCK, 'NASDAQ', 196.5, 1.24, 61230000000, 3010000000000],
      ['NVDA', 'NVIDIA Corporation', AssetType.STOCK, 'NASDAQ', 902.25, 2.88, 53290000000, 2250000000000],
      ['BTC', 'Bitcoin', AssetType.CRYPTO, 'Crypto', 63750.12, -0.75, 28400000000, 1250000000000],
      ['ETH', 'Ethereum', AssetType.CRYPTO, 'Crypto', 3120.77, 0.92, 12900000000, 375000000000],
      ['VOO', 'Vanguard S&P 500 ETF', AssetType.ETF, 'NYSE Arca', 477.4, 0.31, 1880000000, 450000000000]
    ].map(([symbol, name, type, exchange, price, change24h, volume24h, marketCap]) =>
      prisma.asset.upsert({
        where: { symbol: symbol as string },
        update: {},
        create: {
          symbol: symbol as string,
          name: name as string,
          type: type as AssetType,
          exchange: exchange as string,
          price: price as number,
          change24h: change24h as number,
          volume24h: volume24h as number,
          marketCap: marketCap as number
        }
      })
    )
  );

  await prisma.position.upsert({
    where: { userId_assetId: { userId: user.id, assetId: assets[0].id } },
    update: {},
    create: { userId: user.id, assetId: assets[0].id, quantity: 20, averageCost: 174.22 }
  });

  await prisma.walletTransaction.createMany({
    data: [
      { userId: user.id, type: 'DEPOSIT', amount: 50000, note: 'Initial paper trading deposit' },
      { userId: admin.id, type: 'DEPOSIT', amount: 250000, note: 'Admin test balance' }
    ],
    skipDuplicates: true
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
