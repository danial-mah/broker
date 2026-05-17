import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CryptoDetailStat, CryptoPercentChange } from './crypto-detail-stat';
import { formatCompact } from './market-format';
import type { CryptoDetail } from './crypto-market-types';

export function CryptoMarketDataCard({ asset }: { asset: CryptoDetail }) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Market data</h2>
      <div className="grid gap-3">
        <CryptoDetailStat
          label="1h / 24h / 7d"
          value={
            <>
              <CryptoPercentChange value={asset.market.change1h} /> / <CryptoPercentChange value={asset.market.change24h} /> /{' '}
              <CryptoPercentChange value={asset.market.change7d} />
            </>
          }
        />
        <CryptoDetailStat label="Market cap" value={formatCurrency(Number(asset.market.marketCap ?? 0))} />
        <CryptoDetailStat label="24h volume" value={formatCurrency(Number(asset.market.volume24h ?? 0))} />
        <CryptoDetailStat label="Circulating supply" value={`${formatCompact(asset.market.circulatingSupply)} ${asset.symbol}`} />
        <CryptoDetailStat
          label="24h high / low"
          value={`${formatCurrency(Number(asset.market.high24h ?? 0))} / ${formatCurrency(Number(asset.market.low24h ?? 0))}`}
        />
      </div>
    </Card>
  );
}
