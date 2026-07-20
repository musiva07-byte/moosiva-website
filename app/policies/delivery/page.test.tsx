import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import DeliveryPolicyPage from "./page";

describe("DeliveryPolicyPage", () => {
  it("renders the required delivery policy points", () => {
    const html = renderToStaticMarkup(<DeliveryPolicyPage />);

    expect(html).toContain("Delivery Policy");
    expect(html).toContain("confirmed through WhatsApp");
    expect(html).toContain("confirmed by Moosiva staff");
    expect(html).toContain("may vary");
    expect(html).toContain("contact number and delivery address are correct");
  });

  it("never exposes internal cost/profit/supplier fields", () => {
    const html = renderToStaticMarkup(<DeliveryPolicyPage />).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
