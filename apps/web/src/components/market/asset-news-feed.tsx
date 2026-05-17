'use client';

import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
};

const sentimentClass = {
  positive: 'text-success',
  neutral: 'text-muted',
  negative: 'text-danger'
};

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export function AssetNewsFeed({ symbol }: { symbol: string }) {
  const news = useQuery({
    queryKey: ['asset-news', symbol],
    enabled: Boolean(symbol),
    queryFn: async () => (await api.get<NewsItem[]>(`/market/assets/${symbol}/news`)).data
  });

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">News feed</h3>
        <p className="text-sm text-muted">Latest mock headlines for {symbol}</p>
      </div>
      <div className="space-y-4">
        {news.isLoading && <p className="text-sm text-muted">Loading headlines...</p>}
        {!news.isLoading && (news.data ?? []).length === 0 && <p className="text-sm text-muted">No headlines yet.</p>}
        {(news.data ?? []).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block min-w-0 rounded-md border border-border bg-panel p-4 transition hover:bg-surface"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h4 className="min-w-0 text-sm font-semibold leading-5 text-foreground">{item.title}</h4>
              <ExternalLink size={16} className="mt-1 shrink-0 text-muted" />
            </div>
            <p className="text-sm leading-5 text-muted">{item.summary}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="min-w-0 text-subtle">{item.source} - {formatPublishedAt(item.publishedAt)}</span>
              <span className={sentimentClass[item.sentiment]}>{item.sentiment}</span>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}
