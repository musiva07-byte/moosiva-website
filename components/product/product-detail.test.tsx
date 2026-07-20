import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { ProductDetail } from "./product-detail";
import type { PublicProductDetail } from "@/types/public-product";

const singleVariantProduct: PublicProductDetail = {
  id: "p1",
  slug: "a-line-top",
  name: "A line top",
  website_title: null,
  website_description: null,
  description: null,
  material: "Georget material",
  care_instructions: null,
  category: { name: "New Collection", slug: "new-collection" },
  image: null,
  variants: [
    { id: "v1", color: "white", size: "xxl", regular_price_bhd: 11, discount_price_bhd: null, stock_quantity: 3 },
  ],
  featured: false,
  new_arrival: false,
};

const multiVariantProduct: PublicProductDetail = {
  ...singleVariantProduct,
  slug: "pearl-trim-abaya",
  name: "Pearl Trim Abaya",
  website_title: "Pearl Trim Abaya",
  website_description: "Elegant evening wear.",
  variants: [
    { id: "v1", color: "Black", size: "M", regular_price_bhd: 20, discount_price_bhd: 15, stock_quantity: 4 },
    { id: "v2", color: "Black", size: "L", regular_price_bhd: 20, discount_price_bhd: null, stock_quantity: 2 },
    { id: "v3", color: "Beige", size: "M", regular_price_bhd: 25, discount_price_bhd: null, stock_quantity: 6 },
  ],
};

describe("ProductDetail — single-variant product", () => {
  it("renders name, category, price, stock note, and both CTAs with no selection needed", () => {
    const html = renderToStaticMarkup(<ProductDetail product={singleVariantProduct} />);

    expect(html).toContain("A line top");
    expect(html).toContain("New Collection");
    expect(html).toContain("BHD 11.000");
    expect(html).toContain("In stock");
    expect(html).toContain("3 available");
    expect(html).toContain("Buy Now");
    expect(html).toContain("Ask on WhatsApp");
    expect(html).toContain("Back to shop");
    // Single color/size — no selector should render since no choice is required.
    expect(html).not.toContain(">Color<");
    expect(html).not.toContain(">Size<");
  });

  it("shows the image placeholder when no image exists", () => {
    const html = renderToStaticMarkup(<ProductDetail product={singleVariantProduct} />);
    expect(html).toContain("Image coming soon");
  });

  it("never renders internal cost/SKU/barcode fields", () => {
    const html = renderToStaticMarkup(<ProductDetail product={singleVariantProduct} />).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier", "landed"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});

describe("ProductDetail — multi-variant product", () => {
  it("renders color and size selectors and prompts for a selection before showing availability", () => {
    const html = renderToStaticMarkup(<ProductDetail product={multiVariantProduct} />);

    expect(html).toContain("Color");
    expect(html).toContain("Size");
    expect(html).toContain("Black");
    expect(html).toContain("Beige");
    // Nothing selected yet on first render — prompts rather than claiming availability.
    expect(html).toContain("Select your options to check availability.");
  });

  it("still shows a representative discounted price before any selection is made", () => {
    const html = renderToStaticMarkup(<ProductDetail product={multiVariantProduct} />);
    // Cheapest active price among variants is Black/M's discount (15), regular 20.
    expect(html).toContain("BHD 20.000");
    expect(html).toContain("BHD 15.000");
  });
});
