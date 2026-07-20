# TradeMaster AI Academy

An LMS scaffold for a bilingual (Hindi/English) trading-education platform, built with
Next.js App Router, Supabase (Postgres + Auth + Storage), and Razorpay.

## ⚠️ Read this first: what this scaffold is, and isn't

The original brief asked for a fully complete platform including an AI trading assistant,
affiliate payouts, a full admin CRUD suite, AI quiz/video/notes generation, live classes, and
more. That's a multi-month build for a small team, not something that can be handed over as
finished, tested, production code in one pass — so rather than fill this repo with unverified
placeholder code labeled "done," here's an honest map of what's real and working vs. what's
scaffolded and needs finishing:

**Solid and wired end-to-end:**
- Full Postgres schema with Row Level Security (`supabase/schema.sql`) — 25 tables covering
  users, plans, courses/modules/lessons (bilingual content), orders/payments, enrollments,
  progress, certificates, coupons, affiliates, notifications, support tickets.
- Supabase Auth: email/password signup+login, Google OAuth, forgot-password flow, session
  middleware that protects `/dashboard` and `/admin`.
- Razorpay: order creation (with correct upgrade-pricing math — only charges the difference),
  client-side signature verification, and a webhook route with HMAC verification for
  `payment.captured` / `payment.failed` / `refund.processed`.
- Landing page, pricing cards, dashboard shell, course/lesson pages with a language toggle and
  a secure-ish video player shell, and a role-gated admin layout.

**Scaffolded (structure + one working example, not exhaustive):**
- Admin panel: overview + courses list are real (read live data); course/lesson/quiz/coupon
  *editing* forms, user management, and analytics dashboards are not built — the schema and
  layout are ready for them.
- Certificates: table + fields exist; PDF generation and QR verification are not implemented.
- Affiliate system: schema is complete; the referral-tracking UI and payout workflow are not.
- Video delivery: the player expects a signed, short-lived URL. No storage provider integration
  (signed URL generation, HLS transcoding) is wired up yet — pick one (Supabase Storage signed
  URLs, Mux, or Bunny Stream) and implement server-side signing before storing real content.

**Not built at all (explicitly out of scope for this pass):**
- The AI features (AI Trading Assistant, AI quiz/video-summary/notes generators, AI chatbot,
  AI course recommendations) are unspecified product features, not an integration task — they
  need their own design (what model, what data, what UX) before any code is worth writing.
- Invoice PDF generation, email notifications (transactional email provider), push
  notifications, and the mobile apps are not implemented.

Treat this as the foundation to build the rest on, not a finished product.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

### 1. Supabase setup
1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/schema.sql` in full.
3. Under Authentication → Providers, enable Email and Google.
4. Under Authentication → URL Configuration, set your site URL and redirect URLs
   (`http://localhost:3000/**` for local dev, your production domain later).
5. Copy your Project URL, anon key, and service role key into `.env.local`.

### 2. Razorpay setup
1. Use your existing Razorpay account (Test mode first).
2. Copy the Key ID and Key Secret into `.env.local`.
3. Under Settings → Webhooks, add a webhook pointing at
   `https://yourdomain.com/api/webhooks/razorpay` for events `payment.captured`,
   `payment.failed`, `refund.processed`. Copy the webhook secret into `.env.local`.

### 3. Seed sample data
```bash
npm run seed
```
This inserts the three plans and one sample course/module/lesson so you have something to
click through immediately.

### 4. Run locally
```bash
npm run dev
```

---

## Environment variables

See `.env.example`. Never commit `.env.local`. `SUPABASE_SERVICE_ROLE_KEY` and
`RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` must stay server-side only — they're used in
Route Handlers and `createAdminClient()`, never in a Client Component.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel, set the same environment variables from `.env.local` in the Vercel
   project settings.
3. Update your Supabase Auth redirect URLs and Razorpay webhook URL to your production domain.
4. Deploy.

## Admin access

There is no admin signup screen by design. To make a user an admin, run in the Supabase SQL
editor:
```sql
update public.profiles set role = 'admin' where id = '<user-uuid>';
```

## Project structure

```
src/
  app/
    (auth)/login, signup, forgot-password
    dashboard/            — student dashboard (protected by middleware)
    admin/                — admin panel (protected by middleware + role check)
    courses/[slug]/lessons/[slug] — lesson viewer
    api/payments/         — Razorpay order creation + verification
    api/webhooks/razorpay — Razorpay webhook handler
  components/             — Navbar, Footer, PricingCard, VideoPlayer
  lib/supabase/           — browser/server/admin Supabase clients
  middleware.ts           — session refresh + route protection
supabase/schema.sql       — full DB schema + RLS policies
scripts/seed.ts           — sample data seeder
```

## Next steps, roughly in priority order

1. Wire a real video hosting provider (Mux or Bunny Stream recommended for signed/expiring
   URLs) and connect it to `lesson_content.video_url`.
2. Build the remaining admin CRUD screens (courses/modules/lessons editor, coupon manager,
   user role manager) using Server Actions against the existing schema.
3. Add a transactional email provider (Resend, Postmark, or Supabase's built-in SMTP) and send
   the notification types already modeled in the `notifications` table.
4. Implement certificate PDF generation (e.g. `@react-pdf/renderer`) plus a `/verify/[code]`
   public page for the QR-code check.
5. Scope and design the AI features as their own project — they need product decisions this
   scaffold can't make for you.
