import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PrivacyPolicyPage from "./page";

describe("PrivacyPolicyPage", () => {
  it("renders the required privacy policy points", () => {
    const html = renderToStaticMarkup(<PrivacyPolicyPage />);

    expect(html).toContain("Privacy Policy");
    expect(html).toContain("used only to process your request or order");
    expect(html).toContain("contact you on WhatsApp");
    expect(html).toContain("do not sell your personal information");
  });

  it("does not overclaim legal guarantees", () => {
    const html = renderToStaticMarkup(<PrivacyPolicyPage />).toLowerCase();
    for (const forbidden of ["gdpr", "ccpa", "guarantee", "warrant"]) {
      expect(html).not.toContain(forbidden);
    }
  });

  it("never exposes internal cost/profit/supplier fields", () => {
    const html = renderToStaticMarkup(<PrivacyPolicyPage />).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
