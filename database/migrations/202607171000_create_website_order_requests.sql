-- Website order requests — created by the public ecommerce website
-- (www.moosivabh.com), NOT the operations system project. This table does
-- not exist yet as of this migration (confirmed via a direct REST check —
-- PostgREST returned PGRST205 "Could not find the table"). No other
-- migration in the operations system references it either.
--
-- This is a PENDING customer request, not a final confirmed order:
--   - no stock is deducted here
--   - no stock_movements row is created here
--   - no orders/order_items row is created here
-- Staff convert a request into a real order manually (via WhatsApp and/or
-- the operations system) once they've confirmed availability and payment.
-- That conversion step is a future operations-system unit, not this one.
--
-- Security model: RLS is enabled with NO policies for anon or authenticated.
-- The public website only ever writes here via a Next.js Server Action using
-- the Supabase service role key (server-only, never sent to the browser —
-- see lib/supabase/admin.ts and lib/services/checkout.ts in the
-- moosiva-website project). There is intentionally no direct anon insert
-- path (no RLS insert policy, no RPC): every request goes through
-- server-side Zod validation and a live product/variant/stock re-check
-- first, using the public-safe product service, before this table is
-- touched at all. A later operations-system unit will need its own
-- `to authenticated` policies (scoped to staff roles) so staff can view and
-- manage these requests — none are added here, matching this unit's scope.
--
-- Not applied automatically — this project has no migration tooling
-- (confirmed in Unit 2A: no supabase/config.toml, no CLI setup). Apply by
-- hand against the shared Supabase project, the same way
-- 202607150001_ecommerce_publishing.sql was applied from the operations
-- system side.

create extension if not exists "pgcrypto";

-- Backs request_number's default below. A global monotonic sequence
-- (not reset daily) is used instead of a per-day-reset counter — still
-- produces "MWR-YYYYMMDD-0001"-shaped numbers, but sidesteps the race
-- conditions a same-day counter would need extra locking to avoid.
-- Postgres sequences are inherently concurrency-safe.
create sequence if not exists website_order_request_number_seq;

create table if not exists website_order_requests (
  id                     uuid primary key default gen_random_uuid(),
  request_number         text unique not null default (
    'MWR-' || to_char(now(), 'YYYYMMDD') || '-' ||
    lpad(nextval('website_order_request_number_seq')::text, 4, '0')
  ),
  product_id             uuid not null references products(id) on delete restrict,
  product_variant_id     uuid not null references product_variants(id) on delete restrict,
  product_name_snapshot  text not null,
  color_snapshot         text,
  size_snapshot          text,
  quantity               integer not null check (quantity >= 1),
  unit_price_snapshot    numeric(12, 3) not null check (unit_price_snapshot >= 0),
  total_snapshot         numeric(12, 3) not null check (total_snapshot >= 0),
  customer_name          text not null,
  mobile_display         text not null,
  mobile_normalized      text not null,
  whatsapp_display       text not null,
  whatsapp_normalized    text not null,
  governorate            text not null,
  area                   text not null,
  block                  text,
  road                   text,
  building               text,
  flat                   text,
  landmark               text,
  delivery_notes         text,
  payment_preference     text not null check (
    payment_preference in ('cash_on_delivery', 'benefitpay', 'bank_transfer', 'payment_link')
  ),
  status                 text not null default 'new' check (
    status in ('new', 'contacted', 'confirmed', 'cancelled')
  ),
  whatsapp_message       text not null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists idx_website_order_requests_status
  on website_order_requests(status);
create index if not exists idx_website_order_requests_created_at
  on website_order_requests(created_at);
create index if not exists idx_website_order_requests_product_variant
  on website_order_requests(product_variant_id);

-- Reuses the shared set_updated_at() trigger function already defined by
-- the operations system's Phase 2 migration
-- (202605230002_products_inventory.sql) — same database, same function,
-- no need to redefine it here. If that function is ever renamed/removed,
-- this trigger creation will fail loudly rather than silently no-op.
drop trigger if exists website_order_requests_set_updated_at on website_order_requests;
create trigger website_order_requests_set_updated_at
before update on website_order_requests
for each row execute function set_updated_at();

alter table website_order_requests enable row level security;
-- No policies for anon or authenticated — see security model note above.
