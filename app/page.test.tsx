import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const mockGetPublishedProducts = vi.fn();
const mockGetPublishedCategories = vi.fn();
vi.mock("@/lib/services/products", () => ({
  getPublishedProducts: (...args: unknown[]) => mockGetPublishedProducts(...args),
  getPublishedCategories: (...args: unknown[]) => mockGetPublishedCategories(...args),
}));

import HomePage from "./page";

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
  colors: ["black"],
  sizes: ["xl"],
  featured: false,
  new_arrival: true,
};

const category = { id: "cat-1", name: "Abayas", slug: "abayas", description: "Elegant abayas", sort_order: 1 };

describe("HomePage", () => {
  it("renders real new arrivals and categories when published data exists", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [product], total: 1, page: 1, pageSize: 4, pageCount: 1 });
    mockGetPublishedCategories.mockResolvedValue([category]);

    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("A line top");
    expect(html).toContain("Abayas");
    expect(html).not.toContain("New arrivals are being prepared.");
    expect(html).not.toContain("Categories coming soon");
  });

  it("shows premium empty-state copy instead of mock products/categories when none are published", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategories.mockResolvedValue([]);

    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("New arrivals are being prepared.");
    expect(html).toContain("Categories coming soon");
    // No mock product/category names ever appear.
    expect(html).not.toContain("A line top");
    expect(html).not.toContain("Sample");
    expect(html).not.toContain("Lorem");
  });

  it("renders the hero, How to Order, and Why shop with Moosiva sections", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategories.mockResolvedValue([]);

    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("Shop the Collection");
    expect(html).toContain("How to Order");
    expect(html).toContain("Browse products");
    expect(html).toContain("Confirm on WhatsApp");
    expect(html).toContain("Why shop with Moosiva");
    expect(html).toContain("Curated styles");
    expect(html).toContain("wa.me");
  });

  it("never exposes internal cost/profit/supplier fields", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [product], total: 1, page: 1, pageSize: 4, pageCount: 1 });
    mockGetPublishedCategories.mockResolvedValue([category]);

    const html = renderToStaticMarkup(await HomePage()).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier", "landed"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
