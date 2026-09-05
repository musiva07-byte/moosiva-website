import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { SiteHeader } from "./site-header";
import { ANNOUNCEMENT_TEXT, MAIN_NAV } from "@/lib/constants/site";

describe("SiteHeader", () => {
  it("renders the announcement bar above the header", () => {
    const html = renderToStaticMarkup(<SiteHeader />);
    expect(html).toContain(ANNOUNCEMENT_TEXT);
  });

  it("renders every main nav item, including New Arrivals and Categories", () => {
    const html = renderToStaticMarkup(<SiteHeader />);
    for (const item of MAIN_NAV) {
      expect(html).toContain(item.label);
    }
  });

  it("renders each desktop nav link with its correct href", () => {
    const html = renderToStaticMarkup(<SiteHeader />);
    for (const item of MAIN_NAV) {
      expect(html).toContain(`href="${item.href}"`);
    }
  });

  it("renders the desktop nav so it is visible from lg (1024px) up, not gated behind an md/lg mismatch with the mobile toggle", () => {
    const html = renderToStaticMarkup(<SiteHeader />);
    // Desktop nav must be "hidden ... lg:flex" and the mobile toggle "lg:hidden" —
    // matching breakpoints so there's no width range where neither shows.
    expect(html).toMatch(/<nav class="hidden[^"]*\blg:flex\b[^"]*"/);
    expect(html).toContain('class="lg:hidden"');
  });

  it("renders logo, mobile menu toggle, and a WhatsApp CTA", () => {
    const html = renderToStaticMarkup(<SiteHeader />);
    expect(html).toContain("Moosiva");
    expect(html).toContain("moosiva-logo-mark.png");
    expect(html).toContain("bg-page px-2 py-1 object-contain");
    expect(html).toContain("border-rose-gold/80");
    expect(html).toContain("Toggle menu");
    expect(html).toContain("wa.me");
  });

  it("renders the main navigation as a dark fashion header", () => {
    const html = renderToStaticMarkup(<SiteHeader />);
    expect(html).toContain('data-tone="dark-fashion"');
    expect(html).toContain("bg-ink");
    expect(html).toContain("text-white");
  });
});
