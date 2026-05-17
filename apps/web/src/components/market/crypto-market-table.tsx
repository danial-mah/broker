'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CryptoMarketRow } from '@/components/market/crypto-market-row';
import type { CryptoMarket } from '@/components/market/crypto-market-types';
import { api } from '@/lib/api';

export function CryptoMarketTable() {
  const markets = useQuery({
    queryKey: ['crypto-markets'],
    queryFn: async () => (await api.get<CryptoMarket[]>('/market/crypto')).data
  });

  return (
    <section className="mx-auto mt-8 max-w-7xl rounded-2xl border border-border bg-surface shadow-glow">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        <span className="rounded-full bg-success px-3 py-1 text-sm font-semibold text-slate-950">New</span>
        <h2 className="text-lg font-semibold text-foreground">Top Crypto Markets</h2>
        <Link href="/login" className="ml-auto hidden items-center gap-1 text-sm font-semibold text-primary sm:inline-flex">
          Trade with demo account
          <ChevronRight size={16} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="w-12 px-4 py-4"></th>
              <th className="px-3 py-4">#</th>
              <th className="px-3 py-4">Name</th>
              <th className="px-3 py-4 text-right">Price</th>
              <th className="px-3 py-4">1h %</th>
              <th className="px-3 py-4">24h %</th>
              <th className="px-3 py-4">7d %</th>
              <th className="px-3 py-4 text-right">Market Cap</th>
              <th className="px-3 py-4 text-right">Volume(24h)</th>
              <th className="px-3 py-4 text-right">Circulating Supply</th>
              <th className="px-3 py-4">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {markets.isLoading && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-muted">
                  Loading live crypto markets...
                </td>
              </tr>
            )}
            {(markets.data ?? []).map((asset) => (
              <CryptoMarketRow key={asset.id} asset={asset} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
