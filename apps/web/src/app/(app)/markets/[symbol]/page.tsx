'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { MarketChart } from '@/components/market/market-chart';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function AssetDetailPage() {
  const params = useParams<{ symbol: string }>();
  const asset = useQuery({
    queryKey: ['asset', params.symbol],
    queryFn: async () => (await api.get(`/market/assets/${params.symbol}`)).data
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <h2 className="text-2xl font-semibold text-white">{asset.data?.symbol ?? params.symbol}</h2>
        <p className="mb-6 text-slate-400">{asset.data?.name}</p>
        <MarketChart />
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">Trade ticket</h3>
        <p className="mb-6 text-3xl font-bold text-white">{formatCurrency(Number(asset.data?.price ?? 0))}</p>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-md bg-success px-4 py-3 font-semibold text-slate-950">Buy</button>
          <button className="rounded-md bg-danger px-4 py-3 font-semibold text-slate-950">Sell</button>
        </div>
      </Card>
    </div>
  );
}
