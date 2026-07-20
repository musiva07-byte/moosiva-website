import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const mockGetPublishedProducts = vi.fn();
const mockGetPublishedCategories = vi.fn();
vi.mock("@/lib/services/products", () => ({
  getPublishedProducts: (...args: unknown[]) => mockGetPublishedProducts(...args),
  getPublishedCategories: (...args: unknown[]) => mockGetPublishedCategories(...args),
}));

import ShopPage from "./page";

const product = {
  id: "product-1",
  slug: "a-line-top",
  name: "A line top",
  website_title: null,
  website_description: null,
  category: { name: "New Collection", slug: "new-collection" },
  image: null,
  regular_price_bhd: 11,
  discount_price_bhd: null,
  colors: ["black", "white"],
  sizes: ["xl", "xxl"],
  featured: false,
  new_arrival: true,
};

describe("ShopPage", () => {
  it("shows the elegant empty state when no products are published — never mock products", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, pageCount: 0 });
    mockGetPublishedCategories.mockResolvedValue([]);

    const element = await ShopPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(element);

    expect(html).toContain("No products available right now.");
    expect(html).toContain("Our latest collection is being prepared");
    expect(html).toContain("Chat on WhatsApp");
    // No fabricated product name should ever appear.
    expect(html).not.toContain("Sample");
    expect(html).not.toContain("Lorem");
  });

  it("renders a single published product as a compact, centered card — not a mock, not stretched", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [product], total: 1, page: 1, pageSize: 12, pageCount: 1 });
    mockGetPublishedCategories.mockResolvedValue([{ id: "c1", name: "New Collection", slug: "new-collection", description: null, sort_order: 1 }]);

    const element = await ShopPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(element);

    expect(html).toContain("A line top");
    expect(html).toContain("BHD 11.000");
    // The one-item grid uses the capped/centered column class, not the full 4-column track.
    expect(html).toContain("grid-cols-1");
    expect(html).not.toContain("No products available right now.");
  });

  it("hides the category filter when no categories are published", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, pageCount: 0 });
    mockGetPublishedCategories.mockResolvedValue([]);

    const element = await ShopPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(element);

    expect(html).not.toContain("All categories");
  });

  it("never exposes internal cost/profit/supplier fields", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [product], total: 1, page: 1, pageSize: 12, pageCount: 1 });
    mockGetPublishedCategories.mockResolvedValue([]);

    const element = await ShopPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(element).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier", "landed"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
