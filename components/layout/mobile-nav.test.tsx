import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { MobileNav, MobileNavPanel } from "./mobile-nav";
import { MAIN_NAV } from "@/lib/constants/site";

describe("MobileNav", () => {
  it("renders a closed toggle button by default, with the nav panel and links not yet in the DOM", () => {
    const html = renderToStaticMarkup(<MobileNav />);

    expect(html).toContain("Toggle menu");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="mobile-nav-panel"');
    // The panel only mounts once open=true (client state), so nav labels aren't in the closed markup.
    for (const item of MAIN_NAV) {
      expect(html).not.toContain(item.label);
    }
  });
});

describe("MobileNavPanel", () => {
  it("renders every main nav link with its correct href, plus a WhatsApp CTA, when open", () => {
    const html = renderToStaticMarkup(<MobileNavPanel onLinkClick={vi.fn()} />);

    for (const item of MAIN_NAV) {
      expect(html).toContain(item.label);
      expect(html).toContain(`href="${item.href}"`);
    }
    expect(html).toContain("Chat on WhatsApp");
    expect(html).toContain("wa.me");
  });
});
