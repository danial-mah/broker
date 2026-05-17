import Link from 'next/link';
import { Star } from 'lucide-react';
import { CryptoChangeCell } from '@/components/market/crypto-change-cell';
import { CryptoSparkline } from '@/components/market/crypto-sparkline';
import { formatCompact } from '@/components/market/market-format';
import { formatCurrency } from '@/lib/utils';
import type { CryptoMarket } from './crypto-market-types';

export function CryptoMarketRow({ asset }: { asset: CryptoMarket }) {
  return (
    <tr className="border-b border-border transition hover:bg-panel">
      <td className="px-4 py-4 text-muted">
        <Star size={17} />
      </td>
      <td className="px-3 py-4 text-muted">{asset.rank}</td>
      <td className="px-3 py-4">
        <Link href={`/assets/${asset.id}`} className="flex items-center gap-3">
          <img src={asset.image} alt="" className="h-8 w-8 rounded-full" />
          <span>
            <span className="font-semibold text-foreground">{asset.name}</span>
            <span className="ml-2 text-muted">{asset.symbol}</span>
          </span>
        </Link>
      </td>
      <td className="px-3 py-4 text-right font-semibold text-foreground">{formatCurrency(asset.price)}</td>
      <CryptoChangeCell value={asset.change1h} />
      <CryptoChangeCell value={asset.change24h} />
      <CryptoChangeCell value={asset.change7d} />
      <td className="px-3 py-4 text-right text-foreground">{formatCurrency(asset.marketCap)}</td>
      <td className="px-3 py-4 text-right text-foreground">{formatCurrency(asset.volume24h)}</td>
      <td className="px-3 py-4 text-right text-foreground">
        {formatCompact(asset.circulatingSupply)} {asset.symbol}
      </td>
      <td className="px-3 py-4">
        <CryptoSparkline values={asset.sparkline} positive={Number(asset.change7d ?? 0) >= 0} />
      </td>
    </tr>
  );
}
