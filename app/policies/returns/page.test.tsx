import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ReturnsPolicyPage from "./page";

describe("ReturnsPolicyPage", () => {
  it("renders the required returns/exchange policy points", () => {
    const html = renderToStaticMarkup(<ReturnsPolicyPage />);

    expect(html).toContain("Returns &amp; Exchange");
    expect(html).toContain("condition of the product");
    expect(html).toContain("unused, unworn, and in their original condition");
    expect(html).toContain("Final approval");
    expect(html).toContain("may not be eligible");
  });

  it("never exposes internal cost/profit/supplier fields", () => {
    const html = renderToStaticMarkup(<ReturnsPolicyPage />).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
