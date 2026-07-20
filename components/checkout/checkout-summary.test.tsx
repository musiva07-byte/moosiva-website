import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CheckoutSummary } from "./checkout-summary";
import type { PublicProductDetail, PublicProductVariant } from "@/types/public-product";

const product: PublicProductDetail = {
  id: "product-1",
  slug: "pearl-trim-abaya",
  name: "Pearl Trim Abaya",
  website_title: null,
  website_description: null,
  description: null,
  material: "Silk",
  care_instructions: null,
  category: { name: "Abayas", slug: "abayas" },
  image: null,
  variants: [],
  featured: false,
  new_arrival: false,
};

const variant: PublicProductVariant = {
  id: "variant-1",
  color: "Black",
  size: "M",
  regular_price_bhd: 20,
  discount_price_bhd: 15,
  stock_quantity: 5,
};

describe("CheckoutSummary", () => {
  it("renders image placeholder, name, category, color, size, quantity, unit price, and total", () => {
    const html = renderToStaticMarkup(
      <CheckoutSummary product={product} variant={variant} quantity={2} unitPriceBhd={15} totalBhd={30} />,
    );

    expect(html).toContain("Pearl Trim Abaya");
    expect(html).toContain("Abayas");
    expect(html).toContain("Black");
    expect(html).toContain("M");
    expect(html).toContain("Quantity: 2");
    expect(html).toContain("BHD 15.000");
    expect(html).toContain("BHD 30.000");
    expect(html).toContain("No image");
  });

  it("never renders material, cost, or SKU fields", () => {
    const html = renderToStaticMarkup(
      <CheckoutSummary product={product} variant={variant} quantity={1} unitPriceBhd={15} totalBhd={15} />,
    ).toLowerCase();
    for (const forbidden of ["silk", "cost", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
