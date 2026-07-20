import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Supabase mock ──────────────────────────────────────────────────────────────
// Records every table name passed to .from(), and returns canned results per
// table from `tableResults` (set per-test). The chain object supports every
// method products.ts actually calls, and is directly awaitable (mirrors
// PostgrestFilterBuilder's thenable behavior) as well as exposing
// .maybeSingle() as a terminal method.

const fromCalls: string[] = [];
let tableResults: Record<string, { data: unknown; error: unknown; count?: number }> = {};

function defaultResult() {
  return { data: [], error: null, count: 0 };
}

function makeChain(result: { data: unknown; error: unknown; count?: number }) {
  const chain: Record<string, unknown> = {};
  for (const method of ["select", "eq", "or", "order", "range", "limit", "in"]) {
    chain[method] = vi.fn(() => chain);
  }
  chain.maybeSingle = vi.fn(() => Promise.resolve(result));
  chain.then = (
    onFulfilled: (value: typeof result) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) => Promise.resolve(result).then(onFulfilled, onRejected);
  return chain;
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) => {
      fromCalls.push(table);
      return makeChain(tableResults[table] ?? defaultResult());
    },
  })),
}));

import {
  DEFAULT_PAGE_SIZE,
  buildProductDetail,
  buildProductListItem,
  getPublishedCategories,
  getPublishedProductBySlug,
  getPublishedProducts,
  normalizePage,
  normalizePageSize,
  pickRepresentativeVariant,
  sanitizeSearchTerm,
  sortListItemsByPrice,
  summarizeProductPricing,
  summarizeVariantOptions,
} from "./products";
import type { PublicProductListItem } from "@/types/public-product";

beforeEach(() => {
  fromCalls.length = 0;
  tableResults = {};
});

// ── Price / discount logic ────────────────────────────────────────────────────

const regularVariant = {
  id: "v1",
  product_id: "p1",
  color: "Black",
  size: "M",
  regular_selling_price_bhd: 15,
  discount_price_bhd: null,
  discount_start_at: null,
  discount_end_at: null,
  stock_quantity: 5,
};

const onSaleVariant = {
  ...regularVariant,
  id: "v2",
  color: "Beige",
  discount_price_bhd: 10,
};

describe("summarizeProductPricing", () => {
  it("uses the regular price when no variant has a discount", () => {
    const result = summarizeProductPricing([regularVariant]);
    expect(result.regular_price_bhd).toBe(15);
    expect(result.discount_price_bhd).toBeNull();
  });

  it("reports the active discount price", () => {
    const result = summarizeProductPricing([onSaleVariant]);
    expect(result.regular_price_bhd).toBe(15);
    expect(result.discount_price_bhd).toBe(10);
  });

  it("does not show a discount that hasn't started yet", () => {
    const future = { ...onSaleVariant, discount_start_at: "2099-01-01T00:00:00Z" };
    const result = summarizeProductPricing([future]);
    expect(result.discount_price_bhd).toBeNull();
    expect(result.regular_price_bhd).toBe(15);
  });

  it("does not show a discount that has already ended", () => {
    const past = { ...onSaleVariant, discount_end_at: "2020-01-01T00:00:00Z" };
    const result = summarizeProductPricing([past]);
    expect(result.discount_price_bhd).toBeNull();
  });

  it("does not show a discount that is not lower than the regular price", () => {
    const bad = { ...onSaleVariant, discount_price_bhd: 20 };
    const result = summarizeProductPricing([bad]);
    expect(result.discount_price_bhd).toBeNull();
  });

  it("picks the variant with the lowest active selling price", () => {
    const expensive = { ...regularVariant, id: "v3", regular_selling_price_bhd: 30 };
    const result = summarizeProductPricing([expensive, onSaleVariant]);
    // onSaleVariant's active price is 10 (its discount), lower than expensive's 30.
    expect(result.regular_price_bhd).toBe(15);
    expect(result.discount_price_bhd).toBe(10);
  });

  it("returns null prices when no variant has a valid price", () => {
    const unpriced = { ...regularVariant, regular_selling_price_bhd: null };
    const result = summarizeProductPricing([unpriced]);
    expect(result.regular_price_bhd).toBeNull();
    expect(result.discount_price_bhd).toBeNull();
  });

  it("returns null prices for an empty variant list", () => {
    const result = summarizeProductPricing([]);
    expect(result.regular_price_bhd).toBeNull();
  });
});

describe("pickRepresentativeVariant", () => {
  it("returns null when no variant is priced", () => {
    expect(pickRepresentativeVariant([{ ...regularVariant, regular_selling_price_bhd: null }])).toBeNull();
  });
});

describe("summarizeVariantOptions", () => {
  it("dedupes colors and sizes", () => {
    const variants = [
      { ...regularVariant, color: "Black", size: "M" },
      { ...regularVariant, color: "Black", size: "L" },
      { ...regularVariant, color: "Beige", size: "M" },
    ];
    const result = summarizeVariantOptions(variants);
    expect(result.colors).toEqual(["Black", "Beige"]);
    expect(result.sizes).toEqual(["M", "L"]);
  });

  it("returns empty arrays for no variants", () => {
    expect(summarizeVariantOptions([])).toEqual({ colors: [], sizes: [] });
  });
});

// ── Pagination helpers ────────────────────────────────────────────────────────

describe("pagination helpers", () => {
  it("default page size is 12", () => {
    expect(DEFAULT_PAGE_SIZE).toBe(12);
    expect(normalizePageSize(undefined)).toBe(12);
  });

  it("normalizePage defaults to 1 for invalid input", () => {
    expect(normalizePage(undefined)).toBe(1);
    expect(normalizePage(0)).toBe(1);
    expect(normalizePage(-5)).toBe(1);
    expect(normalizePage(3)).toBe(3);
  });

  it("normalizePageSize caps an excessive request", () => {
    expect(normalizePageSize(1000)).toBeLessThanOrEqual(48);
  });
});

describe("sanitizeSearchTerm", () => {
  it("strips characters that break PostgREST .or() syntax", () => {
    expect(sanitizeSearchTerm("abc,name.eq.x")).not.toContain(",");
    expect(sanitizeSearchTerm("a(b)c")).not.toMatch(/[()]/);
  });

  it("trims and truncates long input", () => {
    expect(sanitizeSearchTerm("  hello  ")).toBe("hello");
    expect(sanitizeSearchTerm("a".repeat(500)).length).toBe(100);
  });
});

describe("sortListItemsByPrice", () => {
  const items = [
    { regular_price_bhd: 30, discount_price_bhd: null } as PublicProductListItem,
    { regular_price_bhd: 10, discount_price_bhd: null } as PublicProductListItem,
    { regular_price_bhd: 20, discount_price_bhd: 5 } as PublicProductListItem,
    { regular_price_bhd: null, discount_price_bhd: null } as PublicProductListItem,
  ];

  it("sorts ascending by effective (discount-aware) price, unpriced items last", () => {
    const sorted = sortListItemsByPrice(items, "price_asc");
    expect(sorted.map((i) => i.discount_price_bhd ?? i.regular_price_bhd)).toEqual([5, 10, 30, null]);
  });

  it("sorts descending by effective price, unpriced items last", () => {
    const sorted = sortListItemsByPrice(items, "price_desc");
    expect(sorted.map((i) => i.discount_price_bhd ?? i.regular_price_bhd)).toEqual([30, 10, 5, null]);
  });
});

// ── DTO builders never include cost/internal fields ───────────────────────────

describe("buildProductListItem / buildProductDetail — no cost leakage", () => {
  const product = {
    id: "p1",
    name: "Pearl Trim Abaya",
    slug: "pearl-trim-abaya",
    category_id: "c1",
    collection: "Ramadan",
    description: "A lovely abaya.",
    material: "Silk",
    care_instructions: "Dry clean only",
    website_title: "Pearl Trim Abaya",
    website_description: "Elegant evening wear.",
    featured: true,
    new_arrival: false,
    sort_order: 0,
  };
  const image = { id: "img1", product_id: "p1", url: "https://x.supabase.co/storage/v1/object/public/product-images/p1.jpg" };
  const category = { id: "c1", name: "Abayas", slug: "abayas", description: null, sort_order: 20 };

  const FORBIDDEN = [
    "cost_price",
    "landed_cost",
    "average_cost",
    "buying",
    "supplier",
    "profit",
    "margin",
    "barcode",
    "variant_sku",
    '"sku"',
  ];

  it("list item contains no forbidden fields", () => {
    const item = buildProductListItem(product, [regularVariant], image, category);
    const serialized = JSON.stringify(item).toLowerCase();
    for (const forbidden of FORBIDDEN) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(item.slug).toBe("pearl-trim-abaya");
    expect(item.category).toEqual({ name: "Abayas", slug: "abayas" });
    expect(item.image).toEqual({ id: "img1", url: image.url });
  });

  it("detail contains no forbidden fields", () => {
    const detail = buildProductDetail(product, [regularVariant, onSaleVariant], image, category);
    const serialized = JSON.stringify(detail).toLowerCase();
    for (const forbidden of FORBIDDEN) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(detail.variants).toHaveLength(2);
  });
});

// ── Service functions only ever query public_* views ──────────────────────────

describe("public product service queries only public_* views", () => {
  it("getPublishedCategories queries only public_categories", async () => {
    await getPublishedCategories();
    expect(fromCalls).toEqual(["public_categories"]);
  });

  it("getPublishedProducts never queries a raw table", async () => {
    await getPublishedProducts();
    expect(fromCalls.length).toBeGreaterThan(0);
    for (const table of fromCalls) {
      expect(table.startsWith("public_")).toBe(true);
    }
    expect(fromCalls).not.toContain("products");
    expect(fromCalls).not.toContain("product_variants");
    expect(fromCalls).not.toContain("product_images");
    expect(fromCalls).not.toContain("categories");
  });

  it("getPublishedProductBySlug never queries a raw table", async () => {
    await getPublishedProductBySlug("some-slug");
    for (const table of fromCalls) {
      expect(table.startsWith("public_")).toBe(true);
    }
  });

  it("hidden/unpublished products cannot appear because only public_products is queried — an empty view result means an empty page, not a fallback to raw data", async () => {
    tableResults.public_products = { data: [], error: null, count: 0 };
    const result = await getPublishedProducts();
    expect(result.items).toEqual([]);
    expect(fromCalls).not.toContain("products");
  });
});

describe("getPublishedProducts end to end against mocked views", () => {
  const productRow = {
    id: "p1",
    name: "Pearl Trim Abaya",
    slug: "pearl-trim-abaya",
    category_id: "c1",
    collection: null,
    description: "desc",
    material: null,
    care_instructions: null,
    website_title: "Pearl Trim Abaya",
    website_description: "A lovely abaya.",
    featured: true,
    new_arrival: false,
    sort_order: 0,
  };

  it("shapes a full result with pricing, colors/sizes, category, and image", async () => {
    tableResults = {
      public_products: { data: [productRow], error: null, count: 1 },
      public_product_variants: {
        data: [
          { ...regularVariant, product_id: "p1" },
          { ...onSaleVariant, product_id: "p1" },
        ],
        error: null,
      },
      public_product_images: {
        data: [{ id: "img1", product_id: "p1", url: "https://x.supabase.co/img.jpg" }],
        error: null,
      },
      public_categories: {
        data: [{ id: "c1", name: "Abayas", slug: "abayas", description: null, sort_order: 20 }],
        error: null,
      },
    };

    const result = await getPublishedProducts();
    expect(result.items).toHaveLength(1);
    const item = result.items[0];
    expect(item.slug).toBe("pearl-trim-abaya");
    expect(item.regular_price_bhd).toBe(15);
    expect(item.discount_price_bhd).toBe(10);
    expect(item.colors.sort()).toEqual(["Beige", "Black"]);
    expect(item.category).toEqual({ name: "Abayas", slug: "abayas" });
  });

  it("returns a generic loadError (never a raw Supabase error) when the query fails", async () => {
    tableResults = {
      public_products: { data: null, error: { message: "relation does not exist" } },
    };

    const result = await getPublishedProducts();
    expect(result.items).toEqual([]);
    expect(result.loadError).toBeTruthy();
    expect(result.loadError).not.toContain("relation");
  });

  it("returns an empty result for an unknown category slug rather than throwing", async () => {
    tableResults = {
      public_categories: { data: null, error: null },
    };

    const result = await getPublishedProducts({ categorySlug: "does-not-exist" });
    expect(result.items).toEqual([]);
    expect(result.loadError).toBeUndefined();
  });
});

// ── getPublishedProductBySlug ─────────────────────────────────────────────────
// Distinct slugs per test below — getPublishedProductBySlug is wrapped in
// React's cache(), which memoizes per argument; reusing a slug across tests
// with different mock setups would return a stale cached result instead of
// re-querying the (changed) mock.

describe("getPublishedProductBySlug", () => {
  it("returns null when the product does not exist — the same result a hidden/unpublished product produces, since both are simply absent from public_products", async () => {
    tableResults = {
      public_products: { data: null, error: null },
    };

    const result = await getPublishedProductBySlug("slug-not-found-case");
    expect(result).toBeNull();
  });

  it("returns null when the underlying query errors, rather than throwing", async () => {
    tableResults = {
      public_products: { data: null, error: { message: "connection reset" } },
    };

    const result = await getPublishedProductBySlug("slug-query-error-case");
    expect(result).toBeNull();
  });

  it("returns a full detail DTO including variant stock_quantity, with no cost/internal fields", async () => {
    const productRow = {
      id: "p2",
      name: "Test Detail Product",
      slug: "slug-full-detail-case",
      category_id: "c2",
      collection: null,
      description: "Full description.",
      material: "Cotton",
      care_instructions: "Hand wash",
      website_title: null,
      website_description: null,
      featured: false,
      new_arrival: true,
      sort_order: 0,
    };

    tableResults = {
      public_products: { data: productRow, error: null },
      public_product_variants: {
        data: [{ ...regularVariant, id: "v10", product_id: "p2", stock_quantity: 7 }],
        error: null,
      },
      public_product_images: {
        data: { id: "img2", product_id: "p2", url: "https://x.supabase.co/img2.jpg" },
        error: null,
      },
      public_categories: {
        data: { id: "c2", name: "Dresses", slug: "dresses", description: null, sort_order: 10 },
        error: null,
      },
    };

    const result = await getPublishedProductBySlug("slug-full-detail-case");
    expect(result).not.toBeNull();
    expect(result?.slug).toBe("slug-full-detail-case");
    expect(result?.category).toEqual({ name: "Dresses", slug: "dresses" });
    expect(result?.variants).toHaveLength(1);
    expect(result?.variants[0].stock_quantity).toBe(7);

    const serialized = JSON.stringify(result).toLowerCase();
    for (const forbidden of ["cost_price", "landed_cost", "barcode", "variant_sku", '"sku"']) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
