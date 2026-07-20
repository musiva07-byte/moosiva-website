import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProductCard } from "./product-card";
import type { PublicProductListItem } from "@/types/public-product";

const baseProduct: PublicProductListItem = {
  id: "p1",
  slug: "pearl-trim-abaya",
  name: "Pearl Trim Abaya",
  website_title: null,
  website_description: "Elegant evening wear.",
  category: { name: "Abayas", slug: "abayas" },
  image: null,
  regular_price_bhd: 45,
  discount_price_bhd: null,
  colors: ["Black", "Beige"],
  sizes: ["M", "L"],
  featured: false,
  new_arrival: false,
};

describe("ProductCard", () => {
  it("renders the public fields: name, category, price, colors/sizes, CTAs", () => {
    const html = renderToStaticMarkup(<ProductCard product={baseProduct} />);

    expect(html).toContain("Pearl Trim Abaya");
    expect(html).toContain("Abayas");
    expect(html).toContain("BHD 45.000");
    expect(html).toContain("View product");
    expect(html).toContain("Buy Now");
    expect(html).toContain("/product/pearl-trim-abaya");
  });

  it("shows a strikethrough regular price and the discount price when a discount is active", () => {
    const html = renderToStaticMarkup(
      <ProductCard product={{ ...baseProduct, discount_price_bhd: 35 }} />,
    );
    expect(html).toContain("BHD 45.000");
    expect(html).toContain("BHD 35.000");
    expect(html).toContain("line-through");
  });

  it("shows a placeholder when there is no image", () => {
    const html = renderToStaticMarkup(<ProductCard product={baseProduct} />);
    expect(html).toContain("Image coming soon");
  });

  it("renders New/Featured badges only when set", () => {
    const plain = renderToStaticMarkup(<ProductCard product={baseProduct} />);
    expect(plain).not.toContain(">New<");
    expect(plain).not.toContain(">Featured<");

    const flagged = renderToStaticMarkup(
      <ProductCard product={{ ...baseProduct, featured: true, new_arrival: true }} />,
    );
    expect(flagged).toContain("New");
    expect(flagged).toContain("Featured");
  });

  it("never renders internal cost/SKU/barcode fields", () => {
    const html = renderToStaticMarkup(<ProductCard product={baseProduct} />).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier", "landed"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
