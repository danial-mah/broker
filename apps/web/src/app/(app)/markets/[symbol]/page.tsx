'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AssetNewsFeed } from '@/components/market/asset-news-feed';
import { MarketChart } from '@/components/market/market-chart';
import { WatchlistButton } from '@/components/market/watchlist-button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

function formatUpdatedAt(value?: string) {
  if (!value) {
    return 'Seed data';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export default function AssetDetailPage() {
  const params = useParams<{ symbol: string }>();
  const asset = useQuery({
    queryKey: ['asset', params.symbol],
    queryFn: async () => (await api.get(`/market/assets/${params.symbol}`)).data
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{asset.data?.symbol ?? params.symbol}</h2>
            <p className="text-muted">{asset.data?.name}</p>
          </div>
          <WatchlistButton symbol={asset.data?.symbol ?? params.symbol} />
        </div>
        <MarketChart />
      </Card>
      <div className="space-y-6">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Trade ticket</h3>
          <p className="mb-6 text-3xl font-bold text-foreground">{formatCurrency(Number(asset.data?.price ?? 0))}</p>
          <div className="mb-6 grid gap-2 rounded-md border border-border bg-panel p-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted">Source</span>
              <span className="font-medium text-foreground">{asset.data?.dataSource ?? 'seed'}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted">Updated</span>
              <span className="font-medium text-foreground">{formatUpdatedAt(asset.data?.dataUpdatedAt)}</span>
            </div>
            {asset.data?.rank && (
              <div className="flex justify-between gap-3">
                <span className="text-muted">Market rank</span>
                <span className="font-medium text-foreground">#{asset.data.rank}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-md bg-success px-4 py-3 font-semibold text-slate-950">Buy</button>
            <button className="rounded-md bg-danger px-4 py-3 font-semibold text-slate-950">Sell</button>
          </div>
        </Card>
        <AssetNewsFeed symbol={asset.data?.symbol ?? params.symbol} />
      </div>
    </div>
  );
}
