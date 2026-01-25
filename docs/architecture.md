# Broker Platform Architecture

## High-Level Architecture

This repository is a TypeScript monorepo with a Next.js web app, a NestJS API, and shared packages for typed contracts and reusable validation.

```text
apps/
  api/     NestJS REST + Socket.io API
  web/     Next.js App Router frontend
packages/
  types/   Cross-app DTO and domain types
```

## Backend

The API follows a modular clean architecture style:

- `domain`: entities, interfaces, and domain rules
- `application`: services/use cases
- `infrastructure`: Prisma, Redis, JWT, external adapters
- `presentation`: controllers, gateways, DTOs, guards

Feature modules are split by business capability: auth, users, markets, trading, portfolio, wallet, admin, and notifications. Controllers stay thin, services own orchestration, and repositories isolate persistence.

## Frontend

The web app uses the Next.js App Router with route groups:

- `(public)`: landing and auth pages
- `(app)`: authenticated trading workspace
- `(admin)`: role-protected admin tools

State is split deliberately:

- TanStack Query: server state and cache invalidation
- Zustand: local UI/session preferences
- React Hook Form + Zod: form state and validation
- Socket.io client: market ticks, trade updates, and notifications

## Realtime Flow

1. API market simulator publishes ticks through `MarketGateway`.
2. Frontend subscribes to `market:tick` and `notification:{userId}`.
3. Trades emit success/failure events after order creation.
4. React Query invalidates portfolio, order history, and wallet balances.

## Security Model

- Access tokens are short-lived JWTs.
- Refresh tokens are hashed in the database and rotated on use.
- Guards enforce authentication and role-based access.
- DTOs are validated globally.
- Rate limiting protects authentication and order endpoints.
