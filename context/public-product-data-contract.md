# Public Product Data Contract — Moosiva Ecommerce Website

Defines exactly what the public website may read from the shared Supabase database, and how. This document is the source of truth for `types/public-product.ts` and `lib/services/products.ts`. Do not select or expose any column not listed here as public-safe.

## Status as of Unit 2C (2026-07-15) — Migration Applied, Views Live

The additive migration proposed by Unit 2A/2B has been **applied** to the shared Supabase project (confirmed by the user, applied from the operations system side — see `Musiva_Internal_Operations_System/database/migrations/202607150001_ecommerce_publishing.sql` for the exact DDL that ran). Five public-safe views now exist and are anon-readable:

- `public_products`
- `public_product_variants`
- `public_product_images`
- `public_categories`
- `public_site_settings`

**This changes the implementation model.** Everything below in this document that describes querying the raw `products`/`product_variants`/`product_images`/`categories`/`settings` tables directly and re-applying visibility filters is now historical (kept for context on *why* the shape is what it is) — as of Unit 2C, `lib/services/products.ts` queries **only these five views, never the raw tables**. The views already apply every visibility rule (active status, `website_visible`, `online_status`, valid slug, active category, in-stock variant) in their own `WHERE` clause, so the website does not need to re-implement that filtering — it only needs to shape the already-filtered rows into public DTOs.

The "Applied Views" section below is the current authoritative column contract. The older "Public-Safe Columns" / "Product Visibility Rules" sections further down describe the raw tables and are retained as background on the underlying data, not as what the website queries.

## Applied Views — Current Authoritative Contract

### `public_products`
`id`, `name`, `slug`, `category_id`, `collection`, `description`, `material`, `care_instructions`, `website_title`, `website_description`, `seo_title`, `seo_description`, `featured`, `new_arrival`, `sort_order`

Every row already satisfies: `status = 'active'`, `website_visible = true`, `online_status = 'published'`, `slug is not null`, category is active (or product has no category), and at least one active variant has `stock_quantity > 0`. No `sku`, no timestamps, no cost fields — none exist on this view.

### `public_product_variants`
`id`, `product_id`, `color`, `size`, `regular_selling_price_bhd`, `discount_price_bhd`, `discount_start_at`, `discount_end_at`, `stock_quantity`

Every row already satisfies: variant `status = 'active'` and `stock_quantity > 0`, and its parent product is public (per `public_products`). **No `minimum_stock` column** — the low/out-of-stock distinction used internally by the operations system is not exposed, and isn't needed: a variant that would be `out_of_stock` never appears in this view at all (filtered by `stock_quantity > 0`). No `cost_price`, `latest_landed_cost_bhd`, `average_landed_cost_bhd`, `variant_sku`, or `barcode` — none exist on this view.

### `public_product_images`
`id`, `product_id`, `url`, `is_primary`, `sort_order`

No `path` (internal storage path) and no `variant_id` — neither exists on this view.

### `public_categories`
`id`, `name`, `slug`, `description`, `sort_order`

Every row already satisfies: `status = 'active'` and has at least one product currently in `public_products`.

### `public_site_settings`
`business_name`, `logo_url`, `whatsapp_number`, `instagram_handle`

Single row. No `business_address`, `invoice_footer`, `return_policy_text`, `default_delivery_charge`, `currency`, `low_stock_default_quantity`, `receipt_theme`, `logo_path`, `id`, or timestamps — none exist on this view. **Not yet queried by this website** — Unit 2C's product service doesn't need it (no settings-reading function was in scope), so it stays an available-but-unused view until a future unit needs it (see open questions).

## Decisions Resolved By The Views As Built (Unit 2C)

- **"Stock availability summary" is a color/size list, not an in/low/out-of-stock status.** The requested product-card field "stock availability summary" can't be a `StockAvailability` enum the way earlier drafts of this doc assumed, because `public_product_variants` has no `minimum_stock` to compute `low_stock` from, and every row it returns is already in-stock by construction (`stock_quantity > 0` is baked into the view). `PublicProductListItem`/`PublicProductDetail` instead expose `colors: string[]` and `sizes: string[]` derived from the available variants — a non-empty list *is* the availability summary. Documented here rather than guessed into the DTO.
- **Out-of-stock display is answered by construction: hidden, not badged.** This was an open question in Unit 2A/2B ("hide out-of-stock products, or show an 'Out of stock' badge?"). The applied views resolve it: a variant disappears from `public_product_variants` the moment its stock hits 0, and a product disappears from `public_products` the moment none of its variants have stock. There is currently no "show as out of stock" option — if the business wants that later, it requires a further schema/view change (a separate, explicit unit), not something this website can offer today.
- **No product-level "from price" computed in SQL.** The views don't compute an aggregate price — `regular_selling_price_bhd`/`discount_price_bhd` live per-variant on `public_product_variants`. The service picks the variant with the lowest *active* selling price per product and reports that variant's regular/discount price as the card's price, per the existing price-selection rule below.

## Schema Source

Confirmed against the operations system's actual database, found locally at
`../Musiva_Internal_Operations_System` (sibling directory to this project):

- `database/migrations/*.sql` — canonical DDL (16 migration files, latest: `202607080003_dashboard_rpc.sql`)
- `src/types/database.ts` — hand-maintained TypeScript mirror of the schema, kept in sync with migrations (see Phase 11 pricing fields)
- `src/lib/pricing/calculations.ts` — authoritative price/discount/stock-status computation logic (has test coverage in `calculations.test.ts`)
- `src/lib/services/product-image.service.ts` — confirms the Storage bucket configuration

No `.env`/credentials were read from the operations project — schema was established entirely from migration files and the generated types file, not a live introspection query. This website project still has no live Supabase connection configured (see `context/progress-tracker.md` open questions).

This is a snapshot as of 2026-07-15. If the operations system's schema changes, this document must be re-verified before the product service is trusted again.

## Source Tables

| Table | Purpose |
| --- | --- |
| `categories` | Product categories. Has a `slug`. |
| `products` | Base product record. **Has no `slug` column.** |
| `product_variants` | Color/size variants — the actual sellable unit. Price and stock live here, not on `products`. |
| `product_images` | One row per product in practice (DB-enforced via `uniq_product_images_product_id` unique index on `product_id`). Stores a ready-to-use public URL. |
| `settings` | Singleton business settings row (WhatsApp number, Instagram handle, business name, logo). Public-safe columns exist but are not currently anon-readable — see RLS section below. |

## RLS Status — Resolved (Unit 2C)

**Historical context, no longer a blocker.** The raw tables (`categories`, `products`, `product_variants`, `product_images`, `settings`) still restrict `select` to `authenticated` only — that hasn't changed, and this website still never queries them directly. What changed is that the five `public_*` views (owned by a role with `BYPASSRLS`, per the migration's security model) are now granted `select` `to anon`, with each view's own `WHERE` clause acting as the security boundary instead of table-level RLS. See `202607150001_ecommerce_publishing.sql` in the operations project for the exact grants.

## Public-Safe Columns (raw tables — background only, not queried directly)

This section describes the underlying tables the views above are built from. **The website does not query these directly** — see "Applied Views" above for what's actually used.

### `categories`
`id`, `name`, `slug`, `description`, `status`, `sort_order`

### `products`
`id`, `name`, `sku`*, `category_id`, `collection`, `description`, `material`, `care_instructions`, `status`

\* `sku` is an internal stock-keeping code, not a secret, but it has no public purpose. Do not render it in public UI; excluding it entirely from the public SELECT is the safer default. If a future unit needs it (e.g. support reference), revisit explicitly.

### `product_variants`
`id`, `product_id`, `color`, `size`, `regular_selling_price_bhd` (fallback: `selling_price`), `discount_price_bhd`, `discount_start_at`, `discount_end_at`, `stock_quantity`, `status`

### `product_images`
`id`, `product_id`, `url`, `is_primary`, `sort_order`

### `settings` (once anon-readable)
`business_name`, `logo_url`, `whatsapp_number`, `instagram_handle`

## Internal Columns That Must Never Be Selected Publicly

| Table | Column | Why |
| --- | --- | --- |
| `product_variants` | `cost_price` | Deprecated buying cost — internal. |
| `product_variants` | `selling_price` | Deprecated; use `regular_selling_price_bhd`. Not itself a cost field, but superseded — don't select the deprecated column. |
| `product_variants` | `discount_price` | Deprecated; use `discount_price_bhd`. |
| `product_variants` | `latest_landed_cost_bhd` | Landed/import cost — internal. |
| `product_variants` | `average_landed_cost_bhd` | Weighted average landed cost — internal. |
| `product_variants` | `barcode`, `variant_sku`, `minimum_stock` | Internal inventory operations detail, not needed publicly. `minimum_stock` doubles as a low-stock threshold used only for staff reordering. |
| `products` | `sku` | Internal stock code (see above). |
| — | any `purchase_orders`, `purchase_order_items`, `inventory_batches`, `suppliers`, `exchange_rates` row | Buying price, supplier identity, landed cost, exchange rate — all explicitly prohibited by `architecture.md` invariant 1. |
| — | any `profiles`, `roles`, `permissions`, `audit_logs`, `stock_movements` row | Staff/internal-operations data. |
| `settings` | `invoice_footer`, `return_policy_text`, `receipt_theme`, `low_stock_default_quantity`, `default_delivery_charge`, `business_address` | Internal/operational config not part of the confirmed public contract yet. (`return_policy_text` may become public-safe later for the Returns policy page — revisit as its own unit, don't wire it in speculatively now.) |

## Product Visibility Rules — Resolved (Unit 2C)

**Historical context, no longer something this website needs to implement.** `architecture.md`'s original visibility model (`status = 'active'` AND `website_visible = true` AND `online_status = 'published'` AND valid slug AND active category AND in-stock variant) is now enforced entirely inside the `public_products`/`public_product_variants` view definitions on the database side. The website's job is only to `select` from those views — it must not re-derive or second-guess visibility with its own filters, and it must not query the raw `products`/`product_variants` tables (doing so would bypass the view's filtering and RLS boundary entirely).

Slug-based routing (`app/product/[slug]/`) is now possible: `public_products.slug` is guaranteed non-null (the view itself requires `slug is not null`).

## Price Selection Rules

Ported from the operations system's `src/lib/pricing/calculations.ts` (`isDiscountActive`, `getActiveSellingPrice`) — do not invent different discount logic. `public_product_variants` only exposes `regular_selling_price_bhd` (the deprecated `selling_price` fallback column isn't on the view at all, so there's nothing to fall back to — treat a null `regular_selling_price_bhd` as "this variant has no valid price" and exclude it from price calculations, don't guess a value):

1. Regular price = `regular_selling_price_bhd` (null means unpriced — exclude the variant).
2. A discount is active when all of:
   - `discount_price_bhd` is not null, and
   - `discount_price_bhd < regular price`, and
   - `discount_start_at` is null or `<= now`, and
   - `discount_end_at` is null or `>= now`.
3. Active selling price = `discount_price_bhd` when a discount is active, otherwise the regular price.
4. A product card's displayed price = the regular/discount price pair of the variant with the lowest *active* selling price among the product's variants. This is the same "from price" concept as before, but now reported as a (regular, discount) pair instead of a single blended number, so the UI can show a strikethrough only when that specific variant has a genuine active discount.

## Image URL Strategy

`public_product_images.url` is already a fully resolved public URL (same storage/URL strategy as before — `product-images` bucket, `public: true`). Read it directly with no signing/transformation step. The view has no `path` column to accidentally select.

One image per product is DB-enforced upstream (`uniq_product_images_product_id`), matching `ui-context.md`'s "one image per product" rule — no defensive multi-image handling is needed in Phase 1 beyond a placeholder when a product has zero images.

## Required Indexes

Satisfied by the applied migration (`idx_products_website_visibility`, `idx_products_slug_unique`, `idx_product_variants_public_lookup`, `idx_product_images_public_lookup` — see `202607150001_ecommerce_publishing.sql` on the operations side). Nothing further needed from this website project.

## Historical: Proposed Additive Migration (Applied — Kept For Record Only)

Everything in this subsection describes what was *proposed* in Unit 2A/2B, before the migration existed. It has since been **applied** with a materially different shape than what's sketched below (real `online_status` values are `draft | published | hidden`, not `unpublished | published`; five views were added rather than raw anon RLS policies). Treat the "Applied Views" section at the top of this document as authoritative — this SQL sketch is kept only so the historical reasoning ("why default hidden," "why anon shouldn't read raw tables") isn't lost. Do not copy this SQL as if it were the real migration; see `Musiva_Internal_Operations_System/database/migrations/202607150001_ecommerce_publishing.sql` for the real one.

This is a proposal only. Nothing described here has been applied to any project. Do not apply without explicit approval, and it must be authored/run against the operations system, not this website project.

```sql
-- Proposed — NOT applied. For operations-system review.

alter table products
  add column if not exists slug text,
  add column if not exists website_visible boolean not null default false,
  add column if not exists online_status text not null default 'unpublished'
    check (online_status in ('unpublished', 'published'));

create unique index if not exists idx_products_slug on products(slug) where slug is not null;

-- Anon read policy, scoped to public-safe rows only (columns are still restricted
-- by what the website's SELECT list requests, but RLS should also gate the rows):
create policy "Public can read published products"
on products for select
to anon
using (status = 'active' and website_visible = true and online_status = 'published');

create policy "Public can read categories"
on categories for select
to anon
using (status = 'active');

create policy "Public can read variants of published products"
on product_variants for select
to anon
using (
  status = 'active'
  and exists (
    select 1 from products p
    where p.id = product_variants.product_id
      and p.status = 'active'
      and p.website_visible = true
      and p.online_status = 'published'
  )
);

create policy "Public can read images of published products"
on product_images for select
to anon
using (
  exists (
    select 1 from products p
    where p.id = product_images.product_id
      and p.status = 'active'
      and p.website_visible = true
      and p.online_status = 'published'
  )
);

create policy "Public can read business contact settings"
on settings for select
to anon
using (true);
-- Note: this grants anon SELECT on the whole settings row. If any column added to
-- `settings` in the future is not public-safe, switch this to a view exposing only
-- (business_name, logo_url, whatsapp_number, instagram_handle) instead of a table-level policy.
```

(Historical rationale, preserved: defaulting new visibility columns to hidden meant no existing product became publicly visible automatically when the real migration ran — staff had to explicitly opt each product in. The applied migration followed the same principle.)

## Resolved Questions (were open as of Unit 2A/2B)

- ~~Who approves and applies schema changes to the operations Supabase project?~~ Applied — confirmed by the user, from the operations-system side.
- ~~Should `website_visible`/`online_status` be two separate fields or collapsed into one?~~ Applied as two fields, matching the original proposal.
- ~~Product slugs: automatic or manual?~~ Applied as auto-generated-when-blank with a SKU-suffix uniqueness strategy, staff-editable afterward (see the operations system's `lib/utils/slug.ts` and `product-publishing.ts`).
- ~~Out-of-stock display: hide entirely or show "Out of stock"?~~ Resolved by construction — see "Decisions Resolved By The Views As Built" above. Out-of-stock variants/products are hidden, not badged.

## Still Open

- Is `public_site_settings` the right source for the public WhatsApp number/Instagram handle, replacing this website's own `NEXT_PUBLIC_WHATSAPP_NUMBER`/`NEXT_PUBLIC_INSTAGRAM_URL` env vars? The view exists and is anon-readable now, but Unit 2C did not wire it in — no settings-reading function was in scope. Using the DB would let staff update these from the operations system without a website redeploy; env vars are simpler and already implemented. Worth deciding as its own small unit rather than folding it into a product-listing unit.
- Should Phase 1 support one product per request only, or a simple multi-item cart? (Checkout-flow question, not yet relevant until that unit starts.)
- Are delivery charges fixed, area-based, or confirmed manually through WhatsApp? (Checkout-flow question.)
- Should the public site support Arabic now or English first only?
