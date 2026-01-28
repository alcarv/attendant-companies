# Architecture (MVP)

## Components
- `apps/web`: Next.js app for onboarding and admin UI.
- `apps/api`: Node API handling auth, company setup, webhook, and agent orchestration.
- `packages/db`: Prisma schema and client for Postgres.

## Flow
1) Company signs up in web app.
2) Company configures knowledge sources and WhatsApp Cloud API credentials.
3) WhatsApp webhook hits API.
4) API loads company + agent config, generates response via OpenAI, sends reply via WhatsApp Cloud API.
