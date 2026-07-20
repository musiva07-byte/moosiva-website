/**
 * Public product reads for the Moosiva ecommerce website.
 *
 * Queries only the public-safe Supabase views documented in
 * context/public-product-data-contract.md — public_products,
 * public_product_variants, public_product_images, public_categories. Never
 * queries the raw products/product_variants/product_images/categories
 * tables (those are staff-only, authenticated-RLS-protected, and contain
 * internal cost/SKU fields this service must never touch).
 */
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type {
  PublicCategory,
  PublicProductDetail,
  PublicProductImage,
  PublicProductListItem,
  PublicProductVariant,
} from "@/types/public-product";

// ── Raw view row shapes (mirrors the confirmed columns in the contract doc) ──

type PublicProductsViewRow = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  collection: string | null;
  description: string | null;
  material: string | null;
  care_instructions: string | null;
  website_title: string | null;
  website_description: string | null;
  featured: boolean;
  new_arrival: boolean;
  sort_order: number;
};

type PublicProductVariantsViewRow = {
  id: string;
  product_id: string;
  color: string;
  size: string;
  regular_selling_price_bhd: number | null;
  discount_price_bhd: number | null;
  discount_start_at: string | null;
  discount_end_at: string | null;
  stock_quantity: number;
};

type PublicProductImagesViewRow = {
  id: string;
  product_id: string;
  url: string;
};

type PublicCategoriesViewRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

const PRODUCTS_SELECT =
  "id, name, slug, category_id, collection, description, material, care_instructions, website_title, website_description, featured, new_arrival, sort_order";
const VARIANTS_SELECT =
  "id, product_id, color, size, regular_selling_price_bhd, discount_price_bhd, discount_start_at, discount_end_at, stock_quantity";
const IMAGES_SELECT = "id, product_id, url";
const CATEGORIES_SELECT = "id, name, slug, description, sort_order";

function toVariantRow(raw: {
  id: string;
  product_id: string;
  color: string;
  size: string;
  regular_selling_price_bhd: number | string | null;
  discount_price_bhd: number | string | null;
  discount_start_at: string | null;
  discount_end_at: string | null;
  stock_quantity: number | string;
}): PublicProductVariantsViewRow {
  return {
    id: raw.id,
    product_id: raw.product_id,
    color: raw.color,
    size: raw.size,
    regular_selling_price_bhd:
      raw.regular_selling_price_bhd === null ? null : Number(raw.regular_selling_price_bhd),
    discount_price_bhd: raw.discount_price_bhd === null ? null : Number(raw.discount_price_bhd),
    discount_start_at: raw.discount_start_at,
    discount_end_at: raw.discount_end_at,
    stock_quantity: Number(raw.stock_quantity),
  };
}

// ── Price/discount logic — mirrors the operations system's calculations.ts ──
// (see context/public-product-data-contract.md "Price Selection Rules").

function isVariantDiscountActive(variant: PublicProductVariantsViewRow, now: Date): boolean {
  if (variant.regular_selling_price_bhd === null || variant.discount_price_bhd === null) {
    return false;
  }
  if (variant.discount_price_bhd >= variant.regular_selling_price_bhd) {
    return false;
  }
  if (variant.discount_start_at && new Date(variant.discount_start_at) > now) {
    return false;
  }
  if (variant.discount_end_at && new Date(variant.discount_end_at) < now) {
    return false;
  }
  return true;
}

function getVariantActiveSellingPrice(variant: PublicProductVariantsViewRow, now: Date): number | null {
  if (variant.regular_selling_price_bhd === null) {
    return null;
  }
  return isVariantDiscountActive(variant, now) ? variant.discount_price_bhd : variant.regular_selling_price_bhd;
}

/** The variant a product card's price is based on: lowest active selling price among priced variants. */
export function pickRepresentativeVariant(
  variants: PublicProductVariantsViewRow[],
  now: Date = new Date(),
): PublicProductVariantsViewRow | null {
  let best: PublicProductVariantsViewRow | null = null;
  let bestPrice = Infinity;

  for (const variant of variants) {
    const price = getVariantActiveSellingPrice(variant, now);
    if (price === null) {
      continue;
    }
    if (price < bestPrice) {
      bestPrice = price;
      best = variant;
    }
  }

  return best;
}

export function summarizeProductPricing(
  variants: PublicProductVariantsViewRow[],
  now: Date = new Date(),
): { regular_price_bhd: number | null; discount_price_bhd: number | null } {
  const representative = pickRepresentativeVariant(variants, now);
  if (!representative) {
    return { regular_price_bhd: null, discount_price_bhd: null };
  }
  return {
    regular_price_bhd: representative.regular_selling_price_bhd,
    discount_price_bhd: isVariantDiscountActive(representative, now)
      ? representative.discount_price_bhd
      : null,
  };
}

/** Non-empty colors/sizes double as the public stock-availability summary — see contract doc. */
export function summarizeVariantOptions(
  variants: PublicProductVariantsViewRow[],
): { colors: string[]; sizes: string[] } {
  return {
    colors: Array.from(new Set(variants.map((v) => v.color))),
    sizes: Array.from(new Set(variants.map((v) => v.size))),
  };
}

// ── DTO builders ─────────────────────────────────────────────────────────────

export function buildProductListItem(
  product: PublicProductsViewRow,
  variants: PublicProductVariantsViewRow[],
  image: PublicProductImagesViewRow | null,
  category: PublicCategoriesViewRow | null,
  now: Date = new Date(),
): PublicProductListItem {
  const pricing = summarizeProductPricing(variants, now);
  const { colors, sizes } = summarizeVariantOptions(variants);

  const listItem: PublicProductListItem = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    website_title: product.website_title,
    website_description: product.website_description,
    category: category ? { name: category.name, slug: category.slug } : null,
    image: image ? ({ id: image.id, url: image.url } satisfies PublicProductImage) : null,
    regular_price_bhd: pricing.regular_price_bhd,
    discount_price_bhd: pricing.discount_price_bhd,
    colors,
    sizes,
    featured: product.featured,
    new_arrival: product.new_arrival,
  };

  return listItem;
}

export function buildProductDetail(
  product: PublicProductsViewRow,
  variants: PublicProductVariantsViewRow[],
  image: PublicProductImagesViewRow | null,
  category: PublicCategoriesViewRow | null,
  now: Date = new Date(),
): PublicProductDetail {
  const variantDtos: PublicProductVariant[] = variants.map((v) => ({
    id: v.id,
    color: v.color,
    size: v.size,
    regular_price_bhd: v.regular_selling_price_bhd,
    discount_price_bhd: isVariantDiscountActive(v, now) ? v.discount_price_bhd : null,
    stock_quantity: v.stock_quantity,
  }));

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    website_title: product.website_title,
    website_description: product.website_description,
    description: product.description,
    material: product.material,
    care_instructions: product.care_instructions,
    category: category ? { name: category.name, slug: category.slug } : null,
    image: image ? { id: image.id, url: image.url } : null,
    variants: variantDtos,
    featured: product.featured,
    new_arrival: product.new_arrival,
  };
}

// ── Listing params/result + small pure helpers ────────────────────────────────

export type PublicProductSort =
  | "default"
  | "featured"
  | "new_arrival"
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc";

export type PublicProductListParams = {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
  sort?: PublicProductSort;
};

export type PublicProductListResult = {
  items: PublicProductListItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  /** Set only when the underlying query failed. Never render this string directly — show a generic message. */
  loadError?: string;
};

export const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;
/** Price sort can't be pushed to SQL (price lives per-variant, not per-product), so it's computed
 *  over a capped, unpaginated batch instead — bounded and safe for a boutique-sized catalog. */
const PRICE_SORT_SCAN_LIMIT = 500;

export function normalizePage(value: number | undefined): number {
  return Number.isInteger(value) && (value as number) > 0 ? (value as number) : 1;
}

export function normalizePageSize(value: number | undefined): number {
  if (!Number.isInteger(value) || (value as number) <= 0) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(value as number, MAX_PAGE_SIZE);
}

/** Strips characters that have special meaning in PostgREST's .or() filter syntax before it's interpolated. */
export function sanitizeSearchTerm(input: string): string {
  return input.replace(/[,()]/g, " ").trim().slice(0, 100);
}

export function sortListItemsByPrice(
  items: PublicProductListItem[],
  sort: "price_asc" | "price_desc",
): PublicProductListItem[] {
  const priced = items.filter((item) => item.regular_price_bhd !== null);
  const unpriced = items.filter((item) => item.regular_price_bhd === null);
  const effectivePrice = (item: PublicProductListItem) =>
    item.discount_price_bhd ?? item.regular_price_bhd ?? 0;

  priced.sort((a, b) =>
    sort === "price_asc" ? effectivePrice(a) - effectivePrice(b) : effectivePrice(b) - effectivePrice(a),
  );

  return [...priced, ...unpriced];
}

function groupByProductId<T extends { product_id: string }>(rows: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const list = map.get(row.product_id);
    if (list) {
      list.push(row);
    } else {
      map.set(row.product_id, [row]);
    }
  }
  return map;
}

function emptyListResult(page: number, pageSize: number, loadError?: string): PublicProductListResult {
  return { items: [], total: 0, page, pageSize, pageCount: 0, loadError };
}

// ── Public queries ─────────────────────────────────────────────────────────────

/** Published categories that currently have at least one public product. */
export async function getPublishedCategories(): Promise<PublicCategory[]> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    // Supabase unreachable/misconfigured — degrade to no categories rather than crash the page.
    return [];
  }

  const { data, error } = await supabase
    .from("public_categories")
    .select(CATEGORIES_SELECT)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as PublicCategoriesViewRow[];
}

export async function getPublishedProducts(
  params: PublicProductListParams = {},
): Promise<PublicProductListResult> {
  const page = normalizePage(params.page);
  const pageSize = normalizePageSize(params.pageSize);

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    // Supabase unreachable/misconfigured — surface the same friendly error state as a failed query.
    return emptyListResult(page, pageSize, "Unable to load products.");
  }
  const sort = params.sort ?? "default";
  const isPriceSort = sort === "price_asc" || sort === "price_desc";
  const now = new Date();

  let categoryId: string | null = null;
  if (params.categorySlug) {
    const { data: categoryRow, error: categoryError } = await supabase
      .from("public_categories")
      .select("id")
      .eq("slug", params.categorySlug)
      .maybeSingle();

    if (categoryError) {
      return emptyListResult(page, pageSize, "Category lookup failed.");
    }
    if (!categoryRow) {
      // Unknown or currently-unpublished category slug — nothing can match.
      return emptyListResult(page, pageSize);
    }
    categoryId = (categoryRow as { id: string }).id;
  }

  let query = supabase.from("public_products").select(PRODUCTS_SELECT, { count: "exact" });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const searchTerm = params.search ? sanitizeSearchTerm(params.search) : "";
  if (searchTerm) {
    query = query.or(
      `name.ilike.%${searchTerm}%,collection.ilike.%${searchTerm}%,website_title.ilike.%${searchTerm}%`,
    );
  }

  if (isPriceSort) {
    query = query.limit(PRICE_SORT_SCAN_LIMIT);
  } else {
    switch (sort) {
      case "featured":
        query = query
          .order("featured", { ascending: false })
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true });
        break;
      case "new_arrival":
        query = query
          .order("new_arrival", { ascending: false })
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true });
        break;
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
      case "name_desc":
        query = query.order("name", { ascending: false });
        break;
      default:
        query = query.order("sort_order", { ascending: true }).order("name", { ascending: true });
    }
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);
  }

  const { data: productRows, count, error: productsError } = await query;
  if (productsError) {
    return emptyListResult(page, pageSize, "Unable to load products.");
  }

  const products = (productRows ?? []) as PublicProductsViewRow[];
  if (products.length === 0) {
    return { items: [], total: count ?? 0, page, pageSize, pageCount: 0 };
  }

  const productIds = products.map((p) => p.id);
  const categoryIds = Array.from(
    new Set(products.map((p) => p.category_id).filter((id): id is string => id !== null)),
  );

  const [variantsResult, imagesResult, categoriesResult] = await Promise.all([
    supabase.from("public_product_variants").select(VARIANTS_SELECT).in("product_id", productIds),
    supabase
      .from("public_product_images")
      .select(IMAGES_SELECT)
      .in("product_id", productIds),
    categoryIds.length
      ? supabase.from("public_categories").select(CATEGORIES_SELECT).in("id", categoryIds)
      : Promise.resolve({ data: [] as PublicCategoriesViewRow[], error: null }),
  ]);

  if (variantsResult.error || imagesResult.error || categoriesResult.error) {
    return emptyListResult(page, pageSize, "Unable to load product details.");
  }

  const variantsByProduct = groupByProductId(
    ((variantsResult.data ?? []) as PublicProductVariantsViewRow[]).map(toVariantRow),
  );
  const imageByProduct = new Map(
    ((imagesResult.data ?? []) as PublicProductImagesViewRow[]).map((img) => [img.product_id, img]),
  );
  const categoryById = new Map(
    ((categoriesResult.data ?? []) as PublicCategoriesViewRow[]).map((c) => [c.id, c]),
  );

  let items = products.map((product) =>
    buildProductListItem(
      product,
      variantsByProduct.get(product.id) ?? [],
      imageByProduct.get(product.id) ?? null,
      product.category_id ? categoryById.get(product.category_id) ?? null : null,
      now,
    ),
  );

  let total = count ?? items.length;

  if (isPriceSort) {
    items = sortListItemsByPrice(items, sort);
    total = items.length;
    const from = (page - 1) * pageSize;
    items = items.slice(from, from + pageSize);
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return { items, total, page, pageSize, pageCount };
}

/** Thin wrapper — a dedicated search entry point over the same listing logic. */
export async function searchPublishedProducts(
  query: string,
  params: Omit<PublicProductListParams, "search"> = {},
): Promise<PublicProductListResult> {
  return getPublishedProducts({ ...params, search: query });
}

/**
 * Wrapped in React's cache() because the product detail route calls this
 * once from generateMetadata and once from the page component — cache()
 * dedupes those into a single Supabase round trip per request.
 */
export const getPublishedProductBySlug = cache(async (slug: string): Promise<PublicProductDetail | null> => {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    // Supabase unreachable/misconfigured — treat like "not found" rather than crash the page.
    return null;
  }
  const now = new Date();

  const { data: productRow, error: productError } = await supabase
    .from("public_products")
    .select(PRODUCTS_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (productError || !productRow) {
    return null;
  }

  const product = productRow as PublicProductsViewRow;

  const [variantsResult, imagesResult, categoryResult] = await Promise.all([
    supabase.from("public_product_variants").select(VARIANTS_SELECT).eq("product_id", product.id),
    supabase.from("public_product_images").select(IMAGES_SELECT).eq("product_id", product.id).maybeSingle(),
    product.category_id
      ? supabase.from("public_categories").select(CATEGORIES_SELECT).eq("id", product.category_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (variantsResult.error) {
    return null;
  }

  const variants = ((variantsResult.data ?? []) as PublicProductVariantsViewRow[]).map(toVariantRow);
  const image = (imagesResult.data ?? null) as PublicProductImagesViewRow | null;
  const category = (categoryResult.data ?? null) as PublicCategoriesViewRow | null;

  return buildProductDetail(product, variants, image, category, now);
});
