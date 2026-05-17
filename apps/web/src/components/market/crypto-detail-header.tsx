import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CryptoDetailChart } from './crypto-detail-chart';
import type { CryptoDetail } from './crypto-market-types';

export function CryptoDetailHeader({ asset }: { asset: CryptoDetail }) {
  return (
    <Card>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={asset.image} alt="" className="h-14 w-14 rounded-full" />
          <div>
            <p className="text-sm text-muted">Rank #{asset.rank}</p>
            <h1 className="text-3xl font-bold text-foreground">
              {asset.name} <span className="text-muted">{asset.symbol}</span>
            </h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-foreground">{formatCurrency(Number(asset.market.price ?? 0))}</p>
          <p className="text-sm text-muted">
            Updated {new Date(asset.dataUpdatedAt).toLocaleString()} via {asset.dataSource}
          </p>
        </div>
      </div>
      <CryptoDetailChart values={asset.market.sparkline} />
    </Card>
  );
}
