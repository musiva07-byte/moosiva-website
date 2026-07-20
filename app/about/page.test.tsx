import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the hero, brand story, offerings, ordering steps, and a WhatsApp CTA", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain("About Moosiva");
    expect(html).toContain("Curated selection");
    expect(html).toContain("How ordering works");
    expect(html).toContain("wa.me");
  });

  it("never claims unverified years of experience, customer counts, showroom, or international shipping", () => {
    const html = renderToStaticMarkup(<AboutPage />).toLowerCase();
    for (const forbidden of [
      "years of experience",
      "showroom",
      "international shipping",
      "worldwide shipping",
      "luxury brand partner",
    ]) {
      expect(html).not.toContain(forbidden);
    }
  });

  it("never exposes internal cost/profit/supplier fields", () => {
    const html = renderToStaticMarkup(<AboutPage />).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
