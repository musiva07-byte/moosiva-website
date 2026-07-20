# Moosiva Ecommerce Website — Project Overview

## Overview

Moosiva Ecommerce Website is the public customer-facing website for **Moosiva Lux Wear**, a Bahrain-based ladies' boutique. The website will showcase products from the existing internal operations system and support a simple WhatsApp-based purchase flow. Customers browse products, choose size/color/quantity, fill delivery details, and submit a request that opens WhatsApp with a prefilled message. The request is also stored in Supabase as a website order request so staff can follow up from the operations workflow.

The website is separate from the already deployed internal system at `operation.moosivabh.com`, but both systems share the same Supabase database.

## Goals

1. Launch a premium, fast, mobile-first public ecommerce/product showcase website at `www.moosivabh.com`.
2. Read only published/public-safe product data from the existing Supabase database.
3. Provide a WhatsApp-based checkout flow without online payment gateway in Phase 1.
4. Store customer purchase requests as pending website order requests without deducting stock immediately.
5. Keep the existing operations system safe and untouched unless an integration field/table is explicitly required.
6. Prevent any public exposure of buying price, landed cost, supplier data, profit, staff data, or internal reports.
7. Optimize for Vercel Free + Supabase Free.

## Core Customer Flow

1. Customer visits `www.moosivabh.com`.
2. Customer browses homepage, shop, category, search, or product detail pages.
3. Customer chooses product, size/color option, and quantity.
4. Customer clicks **Buy Now**.
5. Website opens a checkout/request form with selected product details.
6. Customer enters name, mobile, WhatsApp number, Bahrain delivery address, notes, and payment preference.
7. Website validates input and re-checks product/variant availability server-side.
8. Website creates a `website_order_requests` record in Supabase.
9. Website generates a WhatsApp prefilled message.
10. Customer is redirected/opened to WhatsApp to message Moosiva.
11. Customer sees an order request success page.
12. Staff confirms the request manually through WhatsApp and/or the operations system.
13. Stock is deducted only after staff confirms the actual order in the operations system.

## Features

### Public Product Discovery

- Homepage with brand hero, featured/new arrivals, categories, and WhatsApp CTA.
- Shop page with paginated published products.
- Category product listing.
- Product search.
- Product detail page with image, description, price, color/size options, stock indication, and Buy Now.
- Product visibility controlled from operations system using website fields.

### WhatsApp-Based Checkout

- Buy Now flow for selected product/variant/quantity.
- Customer and Bahrain delivery detail form.
- Payment preference selection:
  - Cash on Delivery
  - BenefitPay
  - Bank Transfer
  - Payment Link
- Server-side availability validation before creating request.
- Pending website order request stored in Supabase.
- WhatsApp message generated for staff/customer communication.
- No online payment gateway in Phase 1.
- No stock deduction on website request.

### Website Order Requests

- Store request snapshot of product, variant, price, quantity, customer, address, and WhatsApp message.
- Status values:
  - `new`
  - `contacted`
  - `confirmed`
  - `cancelled`
- Must be visible later in the operations system as website leads/pending WhatsApp order requests.
- Must not create duplicate customers or final orders unless explicitly implemented from operations workflow.

### Content and Policies

- About page.
- Contact page with WhatsApp and Instagram.
- Delivery policy.
- Returns/exchange policy.
- Privacy policy.

### SEO and Sharing

- Clean product slugs.
- Metadata title/description.
- Open Graph tags.
- Product metadata.
- `robots.txt`.
- Sitemap if practical.

## Scope

### In Scope — Phase 1

- New separate Next.js public website project.
- Supabase connection to existing database.
- Public product listing from published products only.
- Product detail page.
- Simple Buy Now checkout form.
- WhatsApp message handoff.
- Website order request creation.
- Static content pages.
- Public/private data separation.
- Vercel deployment readiness.
- Supabase Free optimization.

### Out of Scope — Phase 1

- Online payment gateway.
- Customer login/account.
- Complex multi-product cart, unless implemented as a small safe enhancement.
- Loyalty points.
- Coupons/discount codes beyond existing product discount price.
- Customer order tracking portal.
- Admin dashboard inside public website.
- Staff operations features.
- Automatic stock deduction on website inquiry.
- Exposing supplier/buying/landed/profit data publicly.

## Success Criteria

1. Public website builds and deploys independently from the operations system.
2. Only products with `status = active`, `website_visible = true`, and `online_status = published` appear publicly.
3. Hidden, archived, inactive, draft, and internal-only products do not appear publicly.
4. Public website never renders buying price, supplier cost, landed cost, margin, profit, staff data, or internal IDs.
5. Customer can open a product, select variant and quantity, and submit checkout form.
6. Checkout creates a pending website order request in Supabase.
7. Checkout opens WhatsApp with all order/customer/address details.
8. Stock is not deducted from website inquiry creation.
9. Website handles empty product data gracefully.
10. App passes lint, typecheck, tests, and production build.
