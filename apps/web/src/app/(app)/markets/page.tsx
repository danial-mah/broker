'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { WatchlistButton } from '@/components/market/watchlist-button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function MarketsPage() {
  const assets = useQuery({
    queryKey: ['assets'],
    queryFn: async () => (await api.get('/market/assets')).data
  });

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold text-foreground">Markets</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="py-3">Asset</th>
              <th>Exchange</th>
              <th>Price</th>
              <th>24h</th>
              <th>Rank</th>
              <th>Market cap</th>
              <th>Source</th>
              <th className="w-12">
                <span className="sr-only">Watchlist</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {(assets.data ?? []).map((asset: any) => (
              <tr key={asset.id} className="border-t border-border">
                <td className="py-4">
                  <Link href={`/markets/${asset.symbol}`} className="font-semibold text-foreground">
                    {asset.symbol}
                  </Link>
                  <p className="text-subtle">{asset.name}</p>
                </td>
                <td>{asset.exchange}</td>
                <td>{formatCurrency(Number(asset.price))}</td>
                <td className={Number(asset.change24h) >= 0 ? 'text-success' : 'text-danger'}>
                  {Number(asset.change24h).toFixed(2)}%
                </td>
                <td>{asset.rank ? `#${asset.rank}` : '-'}</td>
                <td>{formatCurrency(Number(asset.marketCap))}</td>
                <td className="text-muted">{asset.dataSource ?? 'seed'}</td>
                <td>
                  <WatchlistButton symbol={asset.symbol} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
