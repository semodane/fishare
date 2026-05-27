# Fishare MVP

Mobile-first (390px) responsive web MVP built with Next.js App Router + TypeScript + Tailwind CSS.

## Quickstart (Local)

### 1) Install

```bash
cd "/Users/semoda/WorkSpace/CursorPrj"
npm install
```

### 2) Environment variables

- Copy `.env.example` → `.env.local` (Next.js runtime)
- Copy `.env.example` → `.env` (Prisma CLI)

```bash
cp .env.example .env.local
cp .env.example .env
```

Fill in at least:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`

### 3) Run PostgreSQL (example: Docker)

```bash
docker run --name fishare-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=fishare \
  -p 5432:5432 \
  -d postgres:16
```

### 4) Prisma: generate → migrate → seed

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5) Start dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `dev`: Run dev server
- `build`: Production build
- `start`: Start production server
- `prisma:generate`: Generate Prisma Client
- `prisma:migrate`: Local migration (`prisma migrate dev`)
- `prisma:seed`: Seed DB (re-runnable)
- `prisma:studio`: Browse DB
- `prisma:deploy`: Prod migration (`prisma migrate deploy`)

## Auth.js (Google/Kakao) setup notes

- Providers are **enabled only when env vars are present**:
  - Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - Kakao: `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`
- Login buttons are additionally gated by:
  - `NEXT_PUBLIC_GOOGLE_READY="1"`
  - `NEXT_PUBLIC_KAKAO_READY="1"`

### Redirect URI checkpoints

- **Google**: Authorized redirect URI should include:
  - `https://<your-domain>/api/auth/callback/google`
- **Kakao**: Redirect URI should include:
  - `https://<your-domain>/api/auth/callback/kakao`

Local dev uses:
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/kakao`

## Vercel deployment checklist (MVP)

### Build/runtime

- **Node**: use an LTS Node runtime on Vercel.
- **Env vars**: set all values from `.env.example` in Vercel Project Settings.
- **Database**: use managed Postgres (Neon/Supabase 등) and set its `DATABASE_URL`.

### Prisma

- Run migrations in CI/preview/prod using:
  - `npm run prisma:deploy`
- If you need seed in a non-prod environment:
  - `npm run prisma:seed`

### Auth.js

- Set `AUTH_URL` to your Vercel domain (e.g. `https://fishare.vercel.app`)
- Set `AUTH_SECRET` (strong random)
- Provider console redirect URIs must match the deployed domain.

## Pre-deploy checklist (fast)

- `npm run lint`
- `npm run build`
- `npm run prisma:validate`
- Confirm DB connectivity:
  - `npm run prisma:deploy` works against the production DB
- Confirm auth session works:
  - `GET /api/auth/session` returns `null` when logged out and JSON when logged in

## Notes

- Pages use mobile-first layout (`MobilePageLayout`) with Header / Content / BottomTab.
- Protected routes: `/saved`, `/my`, `/reviews/write` are gated by middleware.

