import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProductEmptyState } from "./product-empty-state";

describe("ProductEmptyState", () => {
  it("renders the empty-catalog copy and a WhatsApp CTA by default", () => {
    const html = renderToStaticMarkup(<ProductEmptyState />);
    expect(html).toContain("No products available right now.");
    expect(html).toContain(
      "Our latest collection is being prepared. Message us on WhatsApp to check current availability.",
    );
    expect(html).toContain("Chat on WhatsApp");
    expect(html).toContain("wa.me");
  });

  it("renders the error copy without leaking a raw error message", () => {
    const html = renderToStaticMarkup(<ProductEmptyState variant="error" />);
    expect(html).toContain("Unable to load products.");
    expect(html).toContain("Please try again or contact Moosiva on WhatsApp.");
    expect(html).toContain("wa.me");
  });
});
