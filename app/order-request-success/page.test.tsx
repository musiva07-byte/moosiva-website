import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import OrderRequestSuccessPage from "./page";

describe("OrderRequestSuccessPage", () => {
  it("renders request number, product name, total, payment preference, and both buttons when a WhatsApp URL is present", async () => {
    const element = await OrderRequestSuccessPage({
      searchParams: Promise.resolve({
        request: "MWR-20260717-0001",
        product: "Pearl Trim Abaya",
        total: "30",
        payment: "Cash on Delivery",
        whatsapp: "https://wa.me/97312345678?text=hello",
      }),
    });
    const html = renderToStaticMarkup(element);

    expect(html).toContain("MWR-20260717-0001");
    expect(html).toContain("Pearl Trim Abaya");
    expect(html).toContain("BHD 30.000");
    expect(html).toContain("Cash on Delivery");
    expect(html).toContain("Open WhatsApp");
    expect(html).toContain("Continue shopping");
    expect(html).toContain("Your request has been prepared");
  });

  it("shows the no-WhatsApp fallback message and hides the Open WhatsApp button when no URL is present", async () => {
    const element = await OrderRequestSuccessPage({
      searchParams: Promise.resolve({
        request: "MWR-20260717-0002",
        product: "A Line Top",
        total: "11",
        payment: "BenefitPay",
      }),
    });
    const html = renderToStaticMarkup(element);

    expect(html).toContain("Your request was saved. Please contact Moosiva to complete the order.");
    expect(html).not.toContain("Open WhatsApp");
    expect(html).toContain("Continue shopping");
  });

  it("never exposes internal IDs or cost fields", async () => {
    const element = await OrderRequestSuccessPage({
      searchParams: Promise.resolve({
        request: "MWR-20260717-0003",
        product: "A Line Top",
        total: "11",
        payment: "Bank Transfer",
      }),
    });
    const html = renderToStaticMarkup(element).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "product_id", "variant_id"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
