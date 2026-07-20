import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import NotFound from "./not-found";

describe("NotFound (custom 404)", () => {
  it("renders Moosiva-branded copy, a Back to shop link, and a WhatsApp CTA", () => {
    const html = renderToStaticMarkup(<NotFound />);

    expect(html).toContain("Page not found");
    expect(html).toContain("The page you");
    expect(html).toContain("doesn");
    expect(html).toContain('href="/shop"');
    expect(html).toContain("Back to shop");
    expect(html).toContain("wa.me");
  });

  it("does not use raw/default Next.js 404 styling classes", () => {
    const html = renderToStaticMarkup(<NotFound />);
    expect(html).not.toContain("bg-black");
  });
});
