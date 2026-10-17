# Cookie & Crumbs — Launch Plan

Status of the codebase as of this pass, the remaining blockers before taking real
orders, and the exact configuration each external service needs.

## 1. What is working

- Production build passes: `npm run build` compiles all 21 routes with no type or
  lint errors (`npx tsc --noEmit` is clean).
- Storefront routes that need no database return 200: `/`, `/about`, `/contact`,
  `/blog`, plus `/robots.txt` and `/sitemap.xml`.
- `/account` and `/checkout` correctly redirect to `/sign-in` when Clerk is not
  configured, instead of crashing.
- Full commerce API implemented under `/api/v1`: products, product detail,
  reviews, cart read/add/update/delete, cart merge, order creation, current user.
- Security posture: Zod validation on every request body, server-side price
  revalidation before order creation, mandatory `Idempotency-Key` on
  `POST /api/v1/orders`, cart-item ownership checks, and guest carts isolated by
  an `httpOnly` session cookie.

## 2. Blockers before launch

| # | Blocker | Owner action | Where |
| - | ------- | ------------ | ----- |
| 1 | No database reachable in this environment (`Can't reach database server at localhost:5432`). `/category/[slug]`, `/product/[slug]`, and `/api/v1/cart` return 500 until `DATABASE_URL` points at a real Postgres. | Provision Postgres (Neon, Supabase, RDS). | `DATABASE_URL` |
| 2 | Clerk is unconfigured, so every authenticated flow (sign-in, account, checkout, cart merge) is disabled. | Add real Clerk keys. | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` |
| 3 | Stripe is unconfigured, so `POST /api/v1/orders` creates orders without a PaymentIntent. | Add real Stripe keys and the webhook endpoint. | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |
| 4 | No Stripe webhook route exists yet, so orders are never marked `PAID` and never receive confirmation email. | Implement `app/api/webhooks/stripe/route.ts`. | New route |
| 5 | No Clerk webhook route exists, so `User` rows are never created for new sign-ups; `/api/v1/users/me` returns 404 for real users. | Implement `app/api/webhooks/clerk/route.ts`. | New route |
| 6 | Contact form is UI-only and submits nowhere. | Wire to Resend. | `app/contact/page.tsx` |
| 7 | Blog is a static placeholder. | Write content or hide the nav entry. | `app/blog/page.tsx` |
| 8 | Algolia index is never populated, so search returns nothing. | Add an indexing script triggered on deploy. | `lib/algolia.ts` |
| 9 | `email` confirmation and shipping notifications are not sent. | Add Resend send helper. | New lib module |

## 3. Database rollout

The initial migration is committed and can be applied without a running local
database:

```bash
npm run db:deploy   # prisma migrate deploy  (use in production/CI)
npm run db:seed     # prisma db seed         (loads 5 categories, 10 products, 13 variants)
```

For local iteration use `npm run db:migrate` (creates a new migration) or
`npm run db:push` (syncs schema without a migration file).

The seed is idempotent: it upserts categories and products by slug, then
replaces variants and images for each product, so it can be re-run safely.

## 4. Required production configuration

Copy `.env.example` to the production environment and fill in every value.
`lib/env.server.ts` validates the server variables at import time, reports any
missing or malformed keys, and disables the affected integration instead of
crashing the process.

| Variable | Notes |
| -------- | ----- |
| `DATABASE_URL` | Postgres connection string. Required. |
| `NEXT_PUBLIC_APP_URL` | Absolute URL of the deployment; used for metadata and redirect origins. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Must start with `pk_test_` or `pk_live_`. Without it, Clerk middleware degrades to a no-op and all auth-gated routes are unreachable. |
| `CLERK_SECRET_KEY` | Server-side Clerk key. |
| `CLERK_WEBHOOK_SECRET` | From the Clerk webhook endpoint you create. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-in` and `/sign-up`. |
| `STRIPE_SECRET_KEY` | Must start with `sk_test_` or `sk_live_`, otherwise order creation skips payment. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Used by the client Stripe Elements integration. |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen` locally or the dashboard endpoint in production. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image delivery and signed uploads. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client-side image URLs; defaults to `cookie-and-crumbs`. |
| `ALGOLIA_APP_ID`, `ALGOLIA_API_KEY` | Write key for indexing. |
| `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` | Search-only key for the browser. |
| `RESEND_API_KEY` | Transactional email. |
| `EMAIL_FROM` | Accepts a bare address or display-name form, e.g. `Cookie & Crumbs <orders@cookieandcrumbs.com>`. |
| `SENTRY_DSN` | Optional; error monitoring. |

## 5. Third-party setup checklist

**Clerk**
1. Create an application; copy the publishable and secret keys.
2. Add a webhook endpoint pointing at `https://<domain>/api/webhooks/clerk` and
   subscribe to `user.created`, `user.updated`, `user.deleted`.
3. Put the signing secret in `CLERK_WEBHOOK_SECRET`.

**Stripe**
1. Copy the publishable and secret keys.
2. Add a webhook endpoint for `payment_intent.succeeded`,
   `payment_intent.payment_failed`, and `charge.refunded`.
3. Put the signing secret in `STRIPE_WEBHOOK_SECRET`.
4. Verify with `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

**Cloudinary**
1. Upload product photography under a `cookie-and-crumbs/products/` prefix and
   record the public IDs, or rerun the seed and replace its placeholder IDs.
2. Ensure the cloud name matches `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`; images are
   served through `f_auto,q_auto` transformations.

**Algolia**
1. Create an index (for example `products`).
2. Index `{ objectID, slug, name, description, category, priceCents }` per
   product after seeding or on product publish.
3. Keep the search-only key in `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY`.

**Resend**
1. Verify the sending domain and confirm `EMAIL_FROM` is on it.
2. Store the API key in `RESEND_API_KEY`.

## 6. Pre-launch verification

```bash
npm run typecheck    # must be clean
npm run build        # must complete with 21 routes
npm run db:deploy
npm run db:seed
npm run start
```

Then walk this path with a real Clerk and Stripe test account:

1. `/` → featured collection renders from the database.
2. `/category/cookies` → filters by flavor and price.
3. `/product/classic-chocolate-chip` → choose flavor, size, inscription, delivery
   date, acknowledge allergens, add to cart. Verify the cart drawer updates and
   the server cart has one row.
4. Sign in → confirm the guest cart merges into the account cart.
5. `/checkout` → complete the four steps and confirm a Stripe PaymentIntent is
   created and the order row is `PENDING_PAYMENT`.
6. Complete payment in Stripe test mode → confirm the webhook moves the order to
   `PAID` and clears the cart.
7. `/account` → order history shows the new order.

## 7. Notes on deliberate fallbacks

These degrade instead of failing, so the app stays browsable when a credential
is absent. Replace them with hard failures once the real services are wired:

- No valid Clerk key → no-op middleware, no `ClerkProvider`, `getCurrentUserId()`
  returns `null`, protected pages redirect to `/sign-in`.
- No valid Stripe key → `hasValidStripe` is `false`; orders are recorded without
  a PaymentIntent. `lib/stripe.ts` throws a clear error if a Stripe call is
  attempted without credentials.
- Missing server env keys → logged as warnings, the value falls back to a
  placeholder so the process still boots.
