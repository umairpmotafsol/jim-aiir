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

The staging site's media bucket (`aiir-wp-website` on S3) no longer exists, so all product, blog and site imagery was re-sourced
from Pexels (free licence) and stored as optimised WebP in `public/images/`. Source photo IDs are listed in
`src/data/image-credits.json`; site images are mapped in `src/lib/images.ts`.

## Design system

Tokens live in `src/app/globals.css` (`@theme`): cobalt `brand-*` on deep navy, a teal `accent-*`, neutral `ink` / `muted` /
`line` / `surface`, Inter for body and Plus Jakarta Sans for headings. Shared UI is in `src/components/ui/`
(buttons, fields, tabs, confirm dialog, page header with photo background, empty states).

## Before launch

- Page copy on About, FAQ, Terms and Refund pages is placeholder written for AIIR and needs client and legal sign-off.
- Seed products include staging test items (e.g. "uq", "test", "Mouse"); clean these up in the real catalogue.
- Prices are stored in USD (`NEXT_PUBLIC_CURRENCY`); switching currency also needs the prices converted.
- Card payments show as "coming soon"; only cash on delivery is enabled, matching staging.
