# AIIR storefront (Next.js)

The customer-facing frontend for the AIIR multi-vendor AI marketplace, rebuilt from the WordPress/WooCommerce/WCFM staging site
(see `docs/aiir-staging-site-analysis.md`). It keeps the same URLs and redirects the old WordPress ones.

**Stack:** Next.js 16 (App Router, Cache Components, Turbopack), React 19, Tailwind CSS 4, zustand, zod, lucide-react.

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

Demo logins (frontend mock, see below):

| Role     | Email               | Password       |
| -------- | ------------------- | -------------- |
| Customer | `customer@aiir.test` | `Password123!` |
| Vendor   | `vendor@aiir.test`   | `Password123!` |

Demo coupons: `WELCOME10` (10% off) and `AIIR20` (20 off).

## What's in it

| Area | Routes |
| --- | --- |
| Catalogue | `/`, `/shop`, `/product-category/[...slug]`, `/product/[slug]`, `/store/[slug]` |
| Shopping | `/cart`, `/checkout`, `/checkout/order-received`, `/wishlist`, `/compare` |
| Customer account | `/my-account` (login/register, orders, order detail, addresses, account details, lost password) |
| Vendors | `/vendor-register`, `/store-manager` (overview, products list/add/edit/delete, orders, store settings) |
| Content | `/blog`, `/blog/[slug]`, `/about-us`, `/contact`, `/faq`, `/terms-and-conditions`, `/refund-returns` |
| SEO | `robots.txt` (disallow-all unless `NEXT_PUBLIC_SITE_ENV=production`), `sitemap.xml`, JSON-LD on products, posts and FAQ |

## Data and the backend swap points

There is no backend yet (`jim-aiir-backend` is empty), so:

- **Catalogue, vendors, reviews and posts** come from seed JSON exported from staging (`src/data/*.json`) and are read only through
  `src/lib/api/catalog.ts` and `src/lib/api/content.ts`. Replace those function bodies with `fetch` calls to the backend; the
  signatures and `'use cache'` / `cacheTag` setup can stay.
- **Cart, wishlist and compare** are client state in `localStorage` (`src/lib/store/`). The cart is expected to stay client-side;
  wishlist should sync to the account.
- **Accounts, orders and vendor product edits are a MOCK** (`src/lib/store/auth.ts`, `orders.ts`, `vendor-products.ts`). They live in
  the browser so every flow can be clicked through, and passwords are **not** secured. Replace them with backend auth
  (HttpOnly session cookie), order and product APIs before any real use.
- **Form delivery** (contact, newsletter, reviews, vendor questions) is validated in server actions (`src/app/actions.ts`) but not sent
  anywhere yet.

Search the code for `TODO(backend)` to find every integration point.

## Images

All imagery is real photography under free licences (Pexels and Unsplash); no AI-generated or rendered images are used.
Files live in `public/images/` (`products/`, `site/`, `blog/`, plus the AIII logo in `brand/`) as optimised WebP, and each
image's source is listed in `src/data/image-credits.json`. Site images are mapped in `src/lib/images.ts`; product and post
images come from the seed data. Anything without an image URL falls back to the neutral placeholder in
`src/components/ui/placeholder.tsx`. When the backend serves media, replace the URLs and add its host to
`images.remotePatterns` in `next.config.ts`.

## Design system

Tokens live in `src/app/globals.css` (`@theme`): a deep teal `brand-*` (primary actions, links), a contrasting orange
`accent-*` (sale badges, offers, cart count, sale prices) and neutral `ink` / `muted` / `line` / `surface` on white. Inter for body, Plus Jakarta Sans for headings. Pill buttons, rounded cards and light sections;
the footer is the only dark area. Shared UI is in `src/components/ui/` (buttons, fields, tabs, confirm dialog, breadcrumb bar,
placeholders, empty states).

## Before launch

- Page copy is carried over from staging as-is. About Us, FAQ, Terms and Contact still contain the Marketo theme's demo text
  ("We are marketpress", stock team members, FAQ about Bangladesh, `info@example.com`), the homepage promo banners mention a
  "Mini Two Wheel Self Balancing Scooter", and the Refund page is the WooCommerce sample policy. All of it needs real AIIR copy.
- Seed products include staging test items (e.g. "uq", "test", "Mouse"); clean these up in the real catalogue.
- Prices are stored in USD (`NEXT_PUBLIC_CURRENCY`); switching currency also needs the prices converted.
- Card payments show as "coming soon"; only cash on delivery is enabled, matching staging.
