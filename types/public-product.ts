/**
 * Public-safe product DTOs for the Moosiva ecommerce website.
 *
 * Shape and field-level rationale are defined in
 * context/public-product-data-contract.md — do not add a field here without
 * adding it there first. Never add cost/supplier/margin/internal fields.
 *
 * These are built exclusively from the public_* Supabase views
 * (public_products, public_product_variants, public_product_images,
 * public_categories) — see lib/services/products.ts. There is no
 * StockAvailability enum: public_product_variants only ever contains
 * in-stock rows (the view filters stock_quantity > 0), and it has no
 * minimum_stock column, so an in/low/out-of-stock status can't be computed
 * publicly. Availability is instead conveyed by non-empty `colors`/`sizes`.
 */

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type PublicProductImage = {
  id: string;
  url: string;
};

export type PublicProductVariant = {
  id: string;
  color: string;
  size: string;
  /** Null means this variant has no valid price and is excluded from price calculations. */
  regular_price_bhd: number | null;
  /** Set only when a discount is currently active and lower than the regular price. */
  discount_price_bhd: number | null;
  /** Always > 0 — public_product_variants only ever contains in-stock rows. */
  stock_quantity: number;
};

export type PublicProductListItem = {
  id: string;
  slug: string;
  name: string;
  website_title: string | null;
  website_description: string | null;
  category: Pick<PublicCategory, "name" | "slug"> | null;
  image: PublicProductImage | null;
  /** Regular price of the variant with the lowest active selling price. Null when no variant has a valid price. */
  regular_price_bhd: number | null;
  /** That same variant's discount price, only when its discount is currently active. */
  discount_price_bhd: number | null;
  /** Distinct colors across the product's available variants — doubles as the stock availability summary (see module doc). */
  colors: string[];
  /** Distinct sizes across the product's available variants. */
  sizes: string[];
  featured: boolean;
  new_arrival: boolean;
};

export type PublicProductDetail = {
  id: string;
  slug: string;
  name: string;
  website_title: string | null;
  website_description: string | null;
  description: string | null;
  material: string | null;
  care_instructions: string | null;
  category: Pick<PublicCategory, "name" | "slug"> | null;
  image: PublicProductImage | null;
  variants: PublicProductVariant[];
  featured: boolean;
  new_arrival: boolean;
};
