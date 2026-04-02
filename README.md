# GarageIQ — Automated Customer Retention for UK MOT Garages

GarageIQ is a SaaS platform that helps independent UK garages retain customers through automated MOT reminders, service follow-ups, Google review requests, and win-back campaigns.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **SMS**: Twilio
- **Email**: Resend
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## Setup Guide

### 1. Clone and install

```bash
cd garageiq
npm install
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in each value:

```bash
cp .env.local.example .env.local
```

---

### 3. Supabase setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the **SQL Editor**, run the contents of `supabase/schema.sql` to create all tables, RLS policies, indexes, and triggers
3. Copy your credentials from **Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role key (keep this secret)

**Tables created:**
- `garages` — garage profiles and billing status
- `customers` — customer records with vehicle and service history
- `messages` — log of all sent messages
- `automations` — per-garage automation toggles
- `message_templates` — editable SMS and email templates

---

### 4. Twilio setup (SMS)

1. Sign up at [twilio.com](https://www.twilio.com)
2. Create a project and get a UK phone number (or use a messaging service)
3. Copy from your Twilio console:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER` (format: `+447000000000`)

> **UK note**: For production, you'll need to register your number for UK A2P messaging and ensure compliance with ICO/PECR for SMS marketing.

---

### 5. Resend setup (Email)

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your sending domain (e.g. `garageiq.co.uk`)
3. Create an API key and copy to `RESEND_API_KEY`
4. Update the `from` address in `lib/resend.ts` to match your verified domain

---

### 6. Stripe setup (Payments)

1. Sign up at [stripe.com](https://stripe.com)
2. Create three recurring products in the Stripe Dashboard:
   - **Solo** — £49/month
   - **Pro** — £99/month
   - **Multi-site** — £199/month
3. Copy the **Price IDs** for each product and add to `.env.local`:
   ```
   STRIPE_SOLO_PRICE_ID=price_xxx
   STRIPE_PRO_PRICE_ID=price_xxx
   STRIPE_MULTI_PRICE_ID=price_xxx
   ```
4. Copy your API keys:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Set up a webhook in Stripe Dashboard → Developers → Webhooks:
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

### 7. Cron job (Vercel)

The daily automation runs via Vercel Cron Jobs (configured in `vercel.json`):

```json
{
  "crons": [
    {
      "path": "/api/cron/daily",
      "schedule": "0 9 * * *"
    }
  ]
}
```

This fires at **9:00 AM UTC** daily. The endpoint is protected by a `CRON_SECRET` env var — Vercel automatically sends this as an `Authorization: Bearer` header.

Generate a random secret:
```bash
openssl rand -base64 32
```
Set it as `CRON_SECRET` in both `.env.local` and your Vercel environment variables.

---

### 8. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard or via CLI:
vercel env add NEXT_PUBLIC_SUPABASE_URL
# (repeat for all env vars)
```

Or connect your GitHub repo to Vercel for automatic deployments.

**Required Vercel settings:**
- Node.js 20.x runtime
- All environment variables set in Vercel Dashboard
- Cron Jobs enabled (available on Hobby and Pro plans)

---

## CSV Import Format

When importing customers, use a CSV with these column headers:

| Column | Required | Format | Example |
|--------|----------|--------|---------|
| `name` | ✓ | Text | John Smith |
| `phone` | | UK mobile | 07700 900000 |
| `email` | | Email | john@example.com |
| `vehicle_reg` | | UK format | AB12 CDE |
| `vehicle_make` | | Text | Ford Focus |
| `last_mot_date` | | DD/MM/YYYY or YYYY-MM-DD | 15/03/2024 |
| `last_service_date` | | DD/MM/YYYY or YYYY-MM-DD | 20/01/2024 |

---

## Automation Logic

All automations run daily at 9am via the `/api/cron/daily` endpoint:

| Automation | Trigger | Channel |
|-----------|---------|---------|
| MOT reminder | `last_mot_date + 1 year - 28 days = today` | SMS + Email |
| Service reminder | `last_service_date + 11 months = today` | SMS + Email |
| Review request | `last_service_date = yesterday` | SMS + Email |
| Win-back | `last_service_date ≤ 12 months ago` AND no message in 60 days | SMS + Email |

Messages are only sent if the corresponding automation is **enabled** for that garage, and the garage's trial/plan is **active**.

---

## Message Templates

Default templates use these dynamic variables:

| Variable | Replaced with |
|----------|--------------|
| `[FirstName]` | Customer's first name |
| `[VehicleReg]` | Vehicle registration |
| `[VehicleMake]` | Vehicle make/model |
| `[GarageName]` | Garage name |
| `[GaragePhone]` | Garage phone number |
| `[GoogleReviewLink]` | Google review URL |

Templates are editable per-garage in the Messages → Templates section of the dashboard.

---

## Project Structure

```
garageiq/
├── app/
│   ├── page.tsx                    # Marketing landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard shell with sidebar
│   │   ├── dashboard/page.tsx      # Overview + metrics
│   │   ├── customers/page.tsx      # Customer table + CSV upload
│   │   ├── automations/page.tsx    # Toggle automations
│   │   ├── messages/page.tsx       # Message log + template editor
│   │   └── settings/page.tsx       # Garage settings + billing
│   └── api/
│       ├── cron/daily/route.ts     # Vercel cron job
│       ├── customers/route.ts
│       ├── customers/upload/route.ts
│       ├── automations/route.ts
│       ├── messages/route.ts
│       ├── messages/templates/route.ts
│       ├── settings/route.ts
│       ├── dashboard/route.ts
│       └── webhooks/stripe/route.ts
├── components/
│   ├── dashboard/                  # Sidebar, StatsCard, PageHeader
│   └── ui/                         # Button, Badge, Input, Modal
├── lib/
│   ├── supabase/                   # Browser + server clients
│   ├── twilio.ts
│   ├── resend.ts
│   ├── stripe.ts
│   ├── automation.ts               # Automation runner logic
│   └── utils.ts
├── types/index.ts
├── middleware.ts                   # Auth route protection
├── supabase/schema.sql             # Full DB schema
└── vercel.json                     # Cron job config
```

---

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To test the cron job locally:
```bash
curl -H "Authorization: Bearer your_cron_secret" http://localhost:3000/api/cron/daily
```

---

## Compliance Notes

- **PECR/GDPR**: Ensure customers have opted in to receive SMS/email marketing. Add a consent field to the customer form for production use.
- **ICO registration**: Required if processing personal data for marketing in the UK.
- **SMS sender ID**: Register a branded sender ID with Twilio for production (e.g. `GarageIQ` instead of a phone number).
- **Unsubscribe**: Add unsubscribe handling to SMS (reply STOP) and email (unsubscribe link) before going live.
