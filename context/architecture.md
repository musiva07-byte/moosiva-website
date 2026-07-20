# Architecture Context — Moosiva Ecommerce Website

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Framework | Next.js App Router + TypeScript | Public ecommerce website and server actions/API routes |
| UI | Tailwind CSS + shadcn/ui where useful | Responsive premium boutique interface |
| Data | Supabase PostgreSQL | Shared business database with operations system |
| Storage | Supabase Storage | Product images already managed by operations system |
| Auth | No customer auth in Phase 1 | Public browsing and checkout request only |
| Deployment | Vercel | Hosting for `www.moosivabh.com` |
| Messaging | WhatsApp deep link / wa.me | Customer handoff to staff conversation |
| Validation | Zod | Validate public form and server inputs |
| Testing | Vitest/React Testing Library or project-standard test runner | Unit and integration confidence |

## System Boundaries

- `app/` — public website routes, layouts, metadata, and pages.
- `app/shop/` — published product listing.
- `app/product/[slug]/` — product details.
- `app/checkout/` — WhatsApp request form.
- `app/order-request-success/` — customer success page after request.
- `app/policies/` — public policy pages.
- `components/` — reusable website UI components.
- `components/product/` — product cards, selectors, price display, stock badges.
- `components/checkout/` — checkout form, address fields, payment preference UI.
- `lib/supabase/` — browser/server Supabase clients and public-safe access helpers.
- `lib/services/` — product, checkout, website order request, settings, and WhatsApp services.
- `lib/validations/` — Zod schemas for checkout and route inputs.
- `lib/formatters/` — BHD, phone, date, and product formatting.
- `lib/constants/` — Bahrain governorates, payment preferences, public status values.
- `types/` — database and application types.
- `context/` — spec-driven project documentation and progress tracking.

## Storage Model

### Supabase PostgreSQL

The public website reads these shared business records:

- products
- product_variants
- product_images or product image reference
- categories
- settings/public website settings

Confirmed real table/column names, public-safe field lists, and internal
fields that must never be selected are documented in
`context/public-product-data-contract.md` — that document is authoritative
over the field names implied elsewhere in this file (e.g. `regular_selling_price_bhd`/`discount_price_bhd` on `product_variants`, not a generic "selling price"/"discount price").

The public website creates these records:

- website_order_requests

The public website must not mutate operational records directly except the website order request table unless a later phase explicitly adds a controlled integration.

### Supabase Storage

Product images are stored in Supabase Storage and managed by the operations system.

The public website may read public/resolved product image URLs, but must not upload or delete images in Phase 1.

## Public Product Visibility Model

**Status (2026-07-15, Unit 2A): this is the target model, not the current one.** The operations database was inspected directly (migrations + generated types in the sibling `Musiva_Internal_Operations_System` project) and confirmed that `products.website_visible`, `products.online_status`, and `products.slug` **do not exist**, and no table in this model has an anon-readable RLS policy yet. See `context/public-product-data-contract.md` for the full column-by-column confirmation, what the schema supports today, and a proposed (not-applied) additive migration to close the gap. Do not implement against the rules below until that migration lands — `lib/services/products.ts` currently throws for anything beyond category listing, rather than guess.

A product is visible on the website only when all required public rules pass:

1. `products.status = 'active'`
2. `products.website_visible = true`
3. `products.online_status = 'published'`
4. product has a valid slug
5. product has a selling price or at least one sellable variant with price
6. at least one variant has available stock greater than 0 unless an explicit out-of-stock display setting is enabled

Public product queries must select only public-safe fields.

## Website Order Request Model

**Status (2026-07-17, Unit 2E): implemented, applied, and live-verified end to end.** Confirmed via direct REST check that `website_order_requests` didn't exist yet (`PGRST205`), then created `database/migrations/202607171000_create_website_order_requests.sql` in this project with precisely the columns/status values/payment-preference values below — no changes needed here, the original model was correct. The user applied the migration to the shared Supabase project; a real browser-driven form submission against the live dev server confirmed a correct snapshot row is created, `request_number` auto-generates as `MWR-YYYYMMDD-NNNN`, `status` defaults to `new`, no stock is deducted, and no other table is touched. Writes go through `lib/services/checkout.ts` using the Supabase service-role client (`lib/supabase/admin.ts`, server-only); the table has no anon RLS policies at all, by design — see the migration file for the full security-model comment.

The website creates a pending request, not a final confirmed order.

Table: `website_order_requests`

Fields:

- `id`
- `request_number`
- `product_id`
- `product_variant_id`
- `product_name_snapshot`
- `color_snapshot`
- `size_snapshot`
- `quantity`
- `unit_price_snapshot`
- `total_snapshot`
- `customer_name`
- `mobile_display`
- `mobile_normalized`
- `whatsapp_display`
- `whatsapp_normalized`
- `governorate`
- `area`
- `block`
- `road`
- `building`
- `flat`
- `landmark`
- `delivery_notes`
- `payment_preference`
- `status`
- `whatsapp_message`
- `created_at`
- `updated_at`

Status values:

- `new`
- `contacted`
- `confirmed`
- `cancelled`

Creating a website request must not deduct stock.

## Auth and Access Model

- Public visitors do not sign in in Phase 1.
- Public visitors may read only published product data.
- Public visitors may create a website order request through validated server-side code.
- Public visitors must not read staff/admin/internal tables.
- No service role key may be exposed to the browser.
- Any server-side action using elevated privileges must return only public-safe results.
- Existing operations staff access remains in the operations system, not this website.

## Domain Model

- `www.moosivabh.com` — public ecommerce website.
- `operation.moosivabh.com` — internal operations system.
- Both connect to the same Supabase project.
- Website deployment must not modify or redeploy the operations project.

## Supabase Free Plan Constraints

The website must be lightweight:

- one image per product
- paginated listing
- no heavy realtime
- no customer accounts in Phase 1
- no expensive dashboard/report queries from public site
- select only needed public columns
- cache public product data where safe
- revalidate stock/availability at checkout submission
- handle unavailable Supabase gracefully

## Invariants

1. The public website never exposes buying price, landed cost, supplier cost, average cost, profit, margin, staff data, audit logs, or internal reports.
2. The public website never deducts stock when a WhatsApp request is submitted.
3. Stock and product availability are rechecked server-side before request creation.
4. Website requests store snapshots of product/variant/price/customer/address data.
5. The operations system remains the source of truth for final order confirmation and stock deduction.
6. No production component may use mock/demo/sample product or order data.
7. Public product queries must filter by website visibility and active/published status.
8. Public forms must be validated server-side before database writes.
9. The service role key must never be exposed client-side.
10. The public website is deployed as a separate project from the existing operations system.
