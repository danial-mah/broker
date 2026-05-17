import { Card } from '@/components/ui/card';
import type { CryptoDetail } from './crypto-market-types';

export function CryptoAboutCard({ asset }: { asset: CryptoDetail }) {
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-foreground">About {asset.name}</h2>
      <p className="text-sm leading-6 text-muted">{asset.description || 'No description available.'}</p>
    </Card>
  );
}
