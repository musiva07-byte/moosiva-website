import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { CheckoutForm } from "./checkout-form";

describe("CheckoutForm", () => {
  it("renders customer, address, and payment sections with the submit button", () => {
    const html = renderToStaticMarkup(
      <CheckoutForm productSlug="pearl-trim-abaya" variantId="variant-1" quantity={2} />,
    );

    expect(html).toContain("Customer details");
    expect(html).toContain("Full name");
    expect(html).toContain("Mobile number");
    expect(html).toContain("WhatsApp number");
    expect(html).toContain("Same as mobile number");

    expect(html).toContain("Delivery address");
    expect(html).toContain("Governorate");
    expect(html).toContain("Area");
    expect(html).toContain("Block");
    expect(html).toContain("Landmark");

    expect(html).toContain("Payment preference");
    expect(html).toContain("Cash on Delivery");
    expect(html).toContain("BenefitPay");
    expect(html).toContain("Bank Transfer");
    expect(html).toContain("Payment Link");

    expect(html).toContain("Submit to WhatsApp");
  });

  it("never renders internal cost/SKU/barcode fields", () => {
    const html = renderToStaticMarkup(
      <CheckoutForm productSlug="pearl-trim-abaya" variantId="variant-1" quantity={1} />,
    ).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
