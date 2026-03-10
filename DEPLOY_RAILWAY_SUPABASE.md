# Deploy Shark Tank (Next.js + Prisma) to Railway with Supabase Postgres

## Overview
- **Supabase** hosts the Postgres database
- **Railway** hosts the Next.js app
- Prisma runs migrations on deploy

This repo was originally using SQLite (`dev.db`). For internet hosting, we switch to Postgres.

---

## 1) Create Supabase Postgres
1. Create a Supabase project.
2. Go to **Project Settings → Database → Connection string**.
3. Copy the **Direct connection** string.
   - Prefer Direct for migrations.
   - If you later use the pooler, Prisma may need `?pgbouncer=true`.

Set it as `DATABASE_URL`.

---

## 2) Reset migrations (recommended for early-stage projects)
The existing migration SQL was generated for SQLite and will not apply cleanly to Postgres.

If you’re OK starting fresh in the new DB:

```bash
# from repo root
rm -rf prisma/migrations

# IMPORTANT: set DATABASE_URL to your Supabase direct connection string
export DATABASE_URL='...'

npx prisma migrate dev --name init
```

This will recreate `prisma/migrations/*` for Postgres.

If you need to preserve data from SQLite, we should do a data export/import step instead.

---

## 3) Local dev
```bash
export DATABASE_URL='...'
npm install
npm run db:migrate
npm run dev
```

---

## 4) Deploy to Railway
1. Create a new Railway project.
2. Add this repo (GitHub) or deploy from local.
3. Add env var in Railway:
   - `DATABASE_URL` = your Supabase direct connection string

### Start command
Use one of these:

**Simple (recommended):**
- Build command: `npm run build`
- Start command: `npm run db:deploy && npm start`

Railway provides `PORT`, and `npm start` runs `next start -p $PORT`.

---

## 5) Custom domain (GoDaddy)
You can either:
- Point a subdomain (e.g. `sharktank.yourdomain.com`) to Railway (CNAME), or
- Put Cloudflare in front later for WAF / caching / Access.

---

## Notes
- Public app: anyone with the URL can access. If you want auth later, easiest path is Supabase Auth.
