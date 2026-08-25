import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

const mockGetPublishedProducts = vi.fn();
const mockGetPublishedCategoriesWithImages = vi.fn();
vi.mock("@/lib/services/products", () => ({
  getPublishedProducts: (...args: unknown[]) => mockGetPublishedProducts(...args),
  getPublishedCategoriesWithImages: (...args: unknown[]) => mockGetPublishedCategoriesWithImages(...args),
}));

const product = {
  id: "product-1",
  slug: "a-line-top",
  name: "A line top",
  website_title: null,
  website_description: null,
  category: { name: "New Collection", slug: "new-collection" },
  image: { id: "img-p1", url: "https://cdn.example.com/a-line-top.jpg" },
  regular_price_bhd: 11,
  discount_price_bhd: null,
  colors: ["black"],
  sizes: ["xl"],
  featured: false,
  new_arrival: true,
};

const category = {
  id: "cat-1",
  name: "Abayas",
  slug: "abayas",
  description: "Elegant abayas",
  sort_order: 1,
  image: { id: "img-1", url: "https://cdn.example.com/abayas.jpg" },
};

describe("HomePage", () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_INSTAGRAM_URL = ORIGINAL_INSTAGRAM;
    vi.resetModules();
  });

  it("renders real new arrivals and categories when published data exists", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [product], total: 1, page: 1, pageSize: 4, pageCount: 1 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([category]);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("A line top");
    expect(html).toContain("Abayas");
    expect(html).toContain("Explore now");
    expect(html).not.toContain("New arrivals are being prepared.");
    expect(html).not.toContain("Categories are being prepared.");
  });

  it("shows premium empty-state copy instead of mock products/categories when none are published", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([]);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("New arrivals are being prepared.");
    expect(html).toContain("Categories are being prepared.");
    // No mock product/category names ever appear.
    expect(html).not.toContain("A line top");
    expect(html).not.toContain("Sample");
    expect(html).not.toContain("Lorem");
  });

  it("shows a placeholder tile for a category with no product image yet", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([{ ...category, image: null }]);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("Abayas");
    expect(html).toContain("Image coming soon");
  });

  it("fetches four New Arrivals and a separate seven-image real-product lookbook feed", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([]);

    const { default: HomePage } = await import("./page");
    await HomePage();

    expect(mockGetPublishedProducts).toHaveBeenCalledWith(
      expect.objectContaining({ sort: "new_arrival", pageSize: 4 }),
    );
    expect(mockGetPublishedProducts).toHaveBeenCalledWith({ pageSize: 7 });
  });

  it("renders sections in the required order: hero, category, new arrivals, trust, promo, lookbook, how to order", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [product], total: 1, page: 1, pageSize: 4, pageCount: 1 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([category]);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    const order = [
      "Where elegance",
      'id="categories"',
      ">New Arrivals<",
      "Finest fabrics",
      "Fresh styles curated for Bahrain",
      "#MOOSIVA STYLE",
      "How to Order",
    ];
    let lastIndex = -1;
    for (const marker of order) {
      const index = html.indexOf(marker);
      expect(index, `expected to find "${marker}"`).toBeGreaterThan(-1);
      expect(index, `expected "${marker}" to appear after the previous section`).toBeGreaterThan(lastIndex);
      lastIndex = index;
    }
  });

  it("renders the hero with the required copy and both CTAs", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([]);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("New Season Collection");
    expect(html).toContain("Where elegance");
    expect(html).toContain("meets modern");
    expect(html).toContain("Fashion");
    expect(html).toContain("Curated ladies");
    expect(html).toContain("Shop New Arrivals");
    expect(html).toContain("Explore Collection");
    expect(html).toContain('href="/shop?sort=new_arrival"');
    expect(html).toContain('href="/shop"');
  });

  it("renders the lookbook before How to Order with a working WhatsApp CTA", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([]);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("How to Order");
    expect(html).toContain("Browse products");
    expect(html).toContain("Confirm on WhatsApp");
    expect(html).toContain("wa.me");
    expect(html.indexOf("#MOOSIVA STYLE")).toBeLessThan(html.indexOf("How to Order"));
  });

  it("renders the trust strip with all five required items", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([]);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("Finest fabrics");
    expect(html).toContain("Trend-led styles");
    expect(html).toContain("Bahrain delivery");
    expect(html).toContain("Easy exchange support");
    expect(html).toContain("WhatsApp ordering");
  });

  it("renders the promo banner with the required copy, no fake discount, and a link to new arrivals", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([]);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("New Season Collection");
    expect(html).toContain("Fresh styles curated for Bahrain");
    expect(html).toContain("/shop?sort=new_arrival");
    expect(html).not.toMatch(/\d+%\s*off/i);
  });

  it("renders the lookbook strip using real product images only, and shows the Instagram CTA when configured", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [product], total: 1, page: 1, pageSize: 4, pageCount: 1 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([]);

    process.env.NEXT_PUBLIC_INSTAGRAM_URL = "https://instagram.com/moosivaluxwear";
    vi.resetModules();
    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("#MOOSIVA STYLE");
    // next/image rewrites the src into /_next/image?url=..., so check for the
    // encoded filename rather than the raw URL.
    expect(html).toContain("a-line-top.jpg");
    expect(html).toContain("Shop the look");
    expect(html).toContain("Follow on Instagram");
    expect(html).toContain("https://instagram.com/moosivaluxwear");
  });

  it("falls back to a WhatsApp CTA (never a fake Instagram link) when Instagram isn't configured", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 4, pageCount: 0 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([]);

    delete process.env.NEXT_PUBLIC_INSTAGRAM_URL;
    vi.resetModules();
    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain("#MOOSIVA STYLE");
    expect(html).toContain("Chat on WhatsApp");
    expect(html).not.toContain("Follow on Instagram");
  });

  it("never exposes internal cost/profit/supplier fields", async () => {
    mockGetPublishedProducts.mockResolvedValue({ items: [product], total: 1, page: 1, pageSize: 4, pageCount: 1 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue([category]);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage()).toLowerCase();
    for (const forbidden of ["buying cost", "landed cost", "exchange rate", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(html).not.toContain(forbidden);
    }
  });

  it("caps the homepage at six balanced categories and four larger arrival product cards", async () => {
    const products = Array.from({ length: 6 }, (_, index) => ({
      ...product,
      id: `product-${index + 1}`,
      slug: `product-${index + 1}`,
      name: `Arrival ${index + 1}`,
      image: null,
    }));
    const categories = Array.from({ length: 7 }, (_, index) => ({
      ...category,
      id: `cat-${index + 1}`,
      slug: `category-${index + 1}`,
      name: `Category ${index + 1}`,
      image: null,
    }));
    mockGetPublishedProducts.mockResolvedValue({ items: products, total: 6, page: 1, pageSize: 6, pageCount: 1 });
    mockGetPublishedCategoriesWithImages.mockResolvedValue(categories);

    const { default: HomePage } = await import("./page");
    const html = renderToStaticMarkup(await HomePage());

    expect(html.match(/<article/g)).toHaveLength(4);
    expect(html.match(/title="Save look"/g)).toHaveLength(4);
    expect(html).toContain("lg:grid-cols-6");
    expect(html).toContain("sm:grid-cols-3");
    expect(html).toContain("Category 6");
    expect(html).not.toContain("Category 7");
    expect(html).toContain("Arrival 4");
    expect(html).not.toContain("Arrival 5");
    expect(html).toContain("grid-cols-2 lg:grid-cols-4");
  });
});
