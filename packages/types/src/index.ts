export type Role = 'USER' | 'ADMIN';

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
};

export type MarketTick = {
  assetId: string;
  symbol: string;
  price: number;
  change24h: number;
  timestamp: string;
};
