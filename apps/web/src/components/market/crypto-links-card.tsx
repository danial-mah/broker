import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { CryptoDetail } from './crypto-market-types';

export function CryptoLinksCard({ links }: { links: CryptoDetail['links'] }) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Links</h2>
      <div className="space-y-2">
        {Object.entries(links)
          .filter(([, value]) => value)
          .map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-md border border-border bg-panel px-3 py-2 text-sm capitalize transition hover:bg-surface"
            >
              {label}
              <ExternalLink size={15} />
            </a>
          ))}
      </div>
    </Card>
  );
}
