export type CryptoMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  rank: number;
  price: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  change1h?: number;
  change24h?: number;
  change7d?: number;
  sparkline: number[];
};

export type CryptoDetail = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  rank: number;
  description: string;
  categories: string[];
  genesisDate?: string;
  hashingAlgorithm?: string;
  sentimentUp?: number;
  links: {
    homepage?: string;
    whitepaper?: string;
    blockchain?: string;
    subreddit?: string;
  };
  market: {
    price?: number;
    marketCap?: number;
    volume24h?: number;
    fullyDilutedValuation?: number;
    high24h?: number;
    low24h?: number;
    ath?: number;
    athChange?: number;
    atl?: number;
    atlChange?: number;
    change1h?: number;
    change24h?: number;
    change7d?: number;
    change30d?: number;
    circulatingSupply?: number;
    totalSupply?: number | null;
    maxSupply?: number | null;
    sparkline: number[];
  };
  dataSource: string;
  dataUpdatedAt: string;
};
