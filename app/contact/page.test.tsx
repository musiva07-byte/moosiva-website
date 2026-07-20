import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

describe("ContactPage", () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = ORIGINAL_WHATSAPP;
    vi.resetModules();
  });

  it("shows business name, Bahrain as service area, ordering note, and a WhatsApp CTA using the configured number", async () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "97312345678";
    vi.resetModules();
    const { default: ContactPage } = await import("./page");

    const html = renderToStaticMarkup(<ContactPage />);

    expect(html).toContain("Moosiva Lux Wear");
    expect(html).toContain("Bahrain");
    expect(html).toContain(
      "Send us your selected product through WhatsApp and our team will confirm availability and payment.",
    );
    expect(html).toContain("wa.me/97312345678");
  });

  it("shows a friendly fallback, never a fake number, when WhatsApp is not configured", async () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    vi.resetModules();
    const { default: ContactPage } = await import("./page");

    const html = renderToStaticMarkup(<ContactPage />);

    expect(html).toContain("WhatsApp contact will be available here soon.");
    expect(html).not.toContain("wa.me");
  });

  it("never uses a fake email or physical address", async () => {
    vi.resetModules();
    const { default: ContactPage } = await import("./page");
    const html = renderToStaticMarkup(<ContactPage />).toLowerCase();

    expect(html).not.toContain("@moosivabh.com");
    expect(html).not.toContain("street");
    expect(html).not.toContain("road,");
  });

  it("never exposes internal cost/profit/supplier fields", async () => {
    vi.resetModules();
    const { default: ContactPage } = await import("./page");
    const html = renderToStaticMarkup(<ContactPage />).toLowerCase();

    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
