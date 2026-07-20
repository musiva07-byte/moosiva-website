# Code Standards — Moosiva Ecommerce Website

## General

- Keep modules small and single-purpose.
- Fix root causes, not surface symptoms.
- Do not mix unrelated concerns in one component or route.
- Do not modify the deployed operations system project from this ecommerce project.
- Do not add mock/demo/sample business data to production pages.
- Prefer simple, maintainable code over clever abstractions.
- Build one feature unit at a time.

## TypeScript

- Strict TypeScript is required.
- Avoid `any`. Use explicit interfaces, generated Supabase types, or narrowly scoped unknown parsing.
- Validate unknown external input at boundaries using Zod.
- Keep public DTOs separate from internal database rows when filtering sensitive fields.
- Do not expose internal cost/profit fields through public types.

## Next.js

- Use the App Router.
- Default to server components for public pages and data loading.
- Use client components only for interactivity such as cart state, checkout form, product option selection, and mobile menu.
- Use server actions or API routes for website order request creation.
- Keep route handlers focused on one responsibility.
- Add metadata for public pages.
- Use loading and error states where appropriate.

## Supabase

- Use anon key only for public-safe reads.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- Select only the columns required for public UI.
- Filter products by public visibility in every public product query.
- Re-check stock/availability server-side before creating request.
- Do not fetch all rows into the browser.
- Use pagination for shop/category/search.
- Handle Supabase errors with user-friendly messages.

## Security

Public website must never show buying price, Indian supplier price, landed cost, average cost, profit, margin, supplier information, staff users, audit logs, internal reports, or internal UUIDs where avoidable.

Validate checkout fields server-side. Normalize Bahrain mobile numbers. Do not trust client-provided price, stock, or product status. Use server-fetched snapshots for request creation. Do not deduct stock from public website requests.

## Styling

- Use CSS custom property tokens from `ui-context.md`.
- Avoid hardcoded hex values in components.
- Use Tailwind utility classes consistently.
- Preserve responsive behavior.
- Keep customer-facing UI clean and premium.

## API Routes / Server Actions

- Validate and parse input before logic runs.
- Return consistent response shapes.
- Do not leak raw Supabase errors to users.
- Prevent duplicate submissions where possible.
- Use idempotency strategy for checkout requests if implemented.

## Data and Storage

- Metadata belongs in Supabase PostgreSQL.
- Product images belong in Supabase Storage and are managed by operations.
- Public website creates `website_order_requests` only in Phase 1.
- Do not store image binaries in PostgreSQL.
- Do not create final orders or stock movements from website request submission in Phase 1.
- Store request snapshots for product, variant, price, customer, address, and message.

## WhatsApp

- Generate WhatsApp URL safely with encoded message.
- Use configured Moosiva WhatsApp number from public settings or `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Do not automatically send messages. Open WhatsApp for customer review/send.
- Keep message clear and staff-friendly.

## File Organization

- `app/` — routes, layouts, metadata, and page components.
- `components/` — reusable UI components.
- `components/product/` — product cards, price display, variant selector.
- `components/checkout/` — checkout form and checkout UI.
- `lib/supabase/` — client factories and query helpers.
- `lib/services/` — product, checkout, WhatsApp, settings services.
- `lib/validations/` — Zod schemas.
- `lib/formatters/` — BHD, phone, slug, date formatters.
- `lib/constants/` — Bahrain and ecommerce constants.
- `types/` — database and app-level types.
- `context/` — spec files and progress tracker.

## Testing

At minimum, cover public product filtering, hidden/archived product exclusion, checkout validation, Bahrain phone normalization, website request creation, no stock deduction on website request, WhatsApp message generation, and no internal cost/profit data exposure.

Before completion of any unit, run lint, typecheck, tests, and build.

## Protected Files

- Do not edit generated shadcn/ui components unless explicitly required.
- Do not edit third-party library files.
- Do not edit operations project files from this ecommerce project.
