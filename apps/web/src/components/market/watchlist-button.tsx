'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

type WatchlistItem = {
  id: string;
  asset: {
    symbol: string;
  };
};

export function WatchlistButton({ symbol, className }: { symbol: string; className?: string }) {
  const queryClient = useQueryClient();
  const watchlist = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => (await api.get<WatchlistItem[]>('/watchlist')).data
  });

  const isWatchlisted = (watchlist.data ?? []).some((item) => item.asset.symbol === symbol);

  const toggle = useMutation({
    mutationFn: async () => {
      if (isWatchlisted) {
        return api.delete(`/watchlist/${symbol}`);
      }
      return api.post(`/watchlist/${symbol}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    }
  });

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={isWatchlisted ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
      className={cn('h-9 w-9 px-0', isWatchlisted && 'text-amber-300 hover:text-amber-200', className)}
      disabled={toggle.isPending || watchlist.isLoading}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle.mutate();
      }}
    >
      <Star size={18} fill={isWatchlisted ? 'currentColor' : 'none'} />
    </Button>
  );
}
