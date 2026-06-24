# Tennis Reservation App

Next.js app for booking tennis courts with Supabase and email confirmations via Resend.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `RESEND_API_KEY` | Resend API key for confirmation emails |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy your project URL and anon key from **Project Settings → API** into `.env.local`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the three environment variables from `.env.example` in **Project Settings → Environment Variables**.
4. Deploy.

Or with the Vercel CLI:

```bash
npx vercel login
npx vercel --prod
```

Set the same environment variables when prompted or in the Vercel dashboard before deploying.

## Scripts

```bash
npm run dev    # local development
npm run build  # production build
npm run start  # run production build locally
npm run lint   # ESLint
```
