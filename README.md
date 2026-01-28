# Attendant Companies

Monorepo for a WhatsApp attendant SaaS: Next.js web app + Node API + Postgres.

## Stack
- Node.js 24.13.0
- Next.js (apps/web)
- Supabase Postgres (packages/db)
- Vercel hosting

## Local setup
1) Create a Supabase project and copy the database connection string.

2) Copy env example:

```
cp .env.example .env
```

3) Install dependencies:

```
pnpm install
```

4) Start dev server:

```
pnpm dev
```

## Workspace scripts
- `pnpm dev` (Next.js web + API routes)
- `pnpm dev:web`
- `pnpm db:generate`
- `pnpm db:migrate`
