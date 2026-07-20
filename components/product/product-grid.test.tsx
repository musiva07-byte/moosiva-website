import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProductGrid } from "./product-grid";
import type { PublicProductListItem } from "@/types/public-product";

function makeProduct(id: string): PublicProductListItem {
  return {
    id,
    slug: `product-${id}`,
    name: `Product ${id}`,
    website_title: null,
    website_description: null,
    category: null,
    image: null,
    regular_price_bhd: 10,
    discount_price_bhd: null,
    colors: [],
    sizes: [],
    featured: false,
    new_arrival: false,
  };
}

describe("ProductGrid", () => {
  it("centers a single product in a compact single-column layout, not a stretched 4-column grid", () => {
    const html = renderToStaticMarkup(<ProductGrid products={[makeProduct("1")]} />);
    expect(html).toContain("grid-cols-1");
    expect(html).toContain("mx-auto");
    expect(html).not.toContain("lg:grid-cols-4");
  });

  it("uses a centered 2-column layout for two products", () => {
    const html = renderToStaticMarkup(<ProductGrid products={[makeProduct("1"), makeProduct("2")]} />);
    expect(html).toContain("grid-cols-2");
    expect(html).toContain("mx-auto");
    expect(html).not.toContain("lg:grid-cols-4");
  });

  it("falls back to the full responsive 2/3/4-column grid for four or more products", () => {
    const products = ["1", "2", "3", "4"].map(makeProduct);
    const html = renderToStaticMarkup(<ProductGrid products={products} />);
    expect(html).toContain("sm:grid-cols-3");
    expect(html).toContain("lg:grid-cols-4");
  });

  it("renders every real product passed in, and nothing else", () => {
    const products = [makeProduct("1"), makeProduct("2")];
    const html = renderToStaticMarkup(<ProductGrid products={products} />);
    expect(html).toContain("Product 1");
    expect(html).toContain("Product 2");
    expect(html).not.toContain("Product 3");
  });
});
