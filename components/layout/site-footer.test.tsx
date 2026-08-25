import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

describe("SiteFooter", () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_INSTAGRAM_URL = ORIGINAL_INSTAGRAM;
    vi.resetModules();
  });

  it("renders Shop and Customer Care links, and the WhatsApp help CTA block", async () => {
    vi.resetModules();
    const { SiteFooter } = await import("./site-footer");
    const html = renderToStaticMarkup(<SiteFooter />);

    expect(html).toContain("Shop");
    expect(html).toContain("New Arrivals");
    expect(html).toContain("Categories");
    expect(html).toContain("All Products");
    expect(html).toContain("Customer Care");
    expect(html).toContain("Delivery Policy");
    expect(html).toContain("Returns &amp; Exchange");
    expect(html).toContain("Privacy Policy");
    expect(html).toContain("Contact");
    expect(html).toContain("Need help choosing your piece?");
    expect(html).toContain("Message us on WhatsApp.");
    expect(html).toContain("wa.me");
    expect(html).toContain("Elegant ladies&#x27; wear curated for Bahrain.");
  });

  it("shows the Instagram social link only when configured", async () => {
    delete process.env.NEXT_PUBLIC_INSTAGRAM_URL;
    vi.resetModules();
    const { SiteFooter: WithoutInstagram } = await import("./site-footer");
    const htmlWithout = renderToStaticMarkup(<WithoutInstagram />);
    expect(htmlWithout).not.toContain("Instagram");

    process.env.NEXT_PUBLIC_INSTAGRAM_URL = "https://instagram.com/moosivaluxwear";
    vi.resetModules();
    const { SiteFooter: WithInstagram } = await import("./site-footer");
    const htmlWith = renderToStaticMarkup(<WithInstagram />);
    expect(htmlWith).toContain("https://instagram.com/moosivaluxwear");
  });

  it("never exposes internal cost/profit/supplier fields", async () => {
    vi.resetModules();
    const { SiteFooter } = await import("./site-footer");
    const html = renderToStaticMarkup(<SiteFooter />).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
