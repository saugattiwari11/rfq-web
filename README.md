# Maalsamaan — Web App (starter)

"Maalsamaan" (माल सामान — goods/materials) is a placeholder name; rename freely
before you're attached to it in code or the domain.

## What's here

A working Next.js 14 (App Router) starter wired to Supabase, covering:

- `/` — landing page
- `/login` — phone OTP login (Supabase Auth)
- `/requirements` — buyer's list of posted requirements
- `/requirements/new` — create a requirement with dynamic line items
- `/requirements/[id]` — requirement detail + quotation comparison
- `/rfq-feed` — seller's incoming open requirements
- `/rfq-feed/[id]` — seller submits a quotation (supports partial quoting)

## Setup

1. `npm install`
2. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the `schema.sql` migration in your Supabase project if you haven't already.
4. Seed `product_categories` with your initial list (Ceiling Fan, LED Bulb, MCB, etc.) — the create-requirement and quotation forms currently take free-text category names and will need a lookup step to resolve them to `category_id` once categories exist.
5. `npm run dev` — runs at `localhost:3000`.

## What's intentionally left for you to wire up

This is a functional skeleton, not a finished product — a few things are
marked `// NOTE:` in the code and need real logic before this is pilot-ready:

- **Auth context**: pages currently query all requirements rather than
  filtering by the signed-in business. Add a `useSession`/server-side auth
  check and filter `buyer_business_id` / `seller_business_id` accordingly.
- **Category lookup**: the create-requirement and quotation forms take
  free-text category names; resolve these against `product_categories`
  (or a dropdown/autocomplete) before insert.
- **Supplier matching**: `/rfq-feed` should filter to requirements whose
  `requirement_items.category_id` overlaps the signed-in seller's
  `supplier_categories`, and whose city matches their service area.
- **Verification gating**: only verified businesses should be able to post
  requirements or submit quotations — enforce this both in RLS policies
  and in the UI (disable the form, show verification status instead).
- **QR payment display**: once a quotation is selected, add a payment QR
  screen using the seller's payment details and the quoted total.
- **Notifications**: wire up Supabase's realtime or a Postgres trigger +
  Firebase Cloud Messaging to notify sellers of new matching RFQs and
  buyers of new quotations.

## Deploying

Deploy to Vercel (free tier) and point your `.com.np` domain at it — no
`vercel.app` in the URL once the custom domain is attached:

1. Push this repo to GitHub.
2. Import it in Vercel, add the same environment variables there.
3. In your domain registrar (Mercantile / your `.com.np` registrar), add
   the DNS records Vercel gives you under Project → Settings → Domains.
