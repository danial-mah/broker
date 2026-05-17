# Broker Platform

Modern full-stack paper trading platform inspired by Binance, Robinhood, Trading212, and Interactive Brokers.

## Stack

- Next.js App Router, TypeScript, TailwindCSS, Zustand, TanStack Query, Axios, Socket.io client, Recharts
- NestJS, PostgreSQL, Prisma, JWT auth, Socket.io, Redis-ready caching, Swagger, Docker
- Monorepo with feature-based folders and shared types

## Folder Structure

```text
apps/
  api/
    prisma/schema.prisma
    src/common/
    src/modules/auth/
    src/modules/users/
    src/modules/market/
    src/modules/trading/
    src/modules/wallet/
    src/modules/admin/
    src/modules/notifications/
  web/
    src/app/(public)/
    src/app/(app)/
    src/components/
    src/lib/
    src/stores/
packages/
  types/
docs/
  architecture.md
```

## Setup

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres redis
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

Web: `http://localhost:3000`
API: `http://localhost:4000/api/v1`
Swagger: `http://localhost:4000/docs`

Demo user:

- `demo@broker.dev`
- `Password123!`

Admin user:

- `admin@broker.dev`
- `Password123!`

## API Architecture

Example endpoints:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/users/me`
- `GET /api/v1/market/assets`
- `GET /api/v1/market/assets/:symbol`
- `POST /api/v1/trading/orders`
- `GET /api/v1/trading/orders`
- `GET /api/v1/trading/portfolio`
- `GET /api/v1/wallet`
- `POST /api/v1/wallet/deposit`
- `POST /api/v1/wallet/withdraw`
- `GET /api/v1/admin/stats`
- `GET /api/v1/admin/users`

## WebSockets

- Market namespace: `http://localhost:4000/market`
- Event: `market:tick`
- Notifications namespace: `http://localhost:4000/notifications`
- User event: `notification:{userId}`

## Current Scope

This scaffold includes the requested high-level architecture, folder structure, Prisma schema, NestJS modules, Next.js app structure, reusable UI components, auth flow, Docker setup, environment variables, API endpoint examples, WebSocket gateway, seed data, and setup documentation.
