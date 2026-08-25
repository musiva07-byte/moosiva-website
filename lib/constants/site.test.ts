import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { FOOTER_CARE_LINKS, FOOTER_SHOP_LINKS, MAIN_NAV, POLICY_LINKS } from "./site";

/**
 * "No navbar/footer link should lead to 404" — verified against the real filesystem
 * rather than a hardcoded list, so this test fails the moment a route is renamed or
 * removed without updating navigation. Query strings/hashes (e.g. "/shop?sort=x",
 * "/#categories") are stripped first since they target a real route, not a file.
 */
function routeFileExists(href: string): boolean {
  const pathOnly = href.split("?")[0].split("#")[0] || "/";
  const segment = pathOnly === "/" ? "" : pathOnly;
  const pageFile = path.resolve(process.cwd(), "app", `.${segment}`, "page.tsx");
  return fs.existsSync(pageFile);
}

describe("MAIN_NAV", () => {
  it("every header/footer nav link points to a route that actually exists", () => {
    for (const item of MAIN_NAV) {
      expect(routeFileExists(item.href), `${item.href} (${item.label}) has no page.tsx`).toBe(true);
    }
  });

  it("includes New Arrivals, Categories, Shop, About, and Contact", () => {
    const labels = MAIN_NAV.map((item) => item.label);
    const hrefs = MAIN_NAV.map((item) => item.href);
    expect(labels).toEqual(["New Arrivals", "Categories", "Shop", "About", "Contact"]);
    expect(hrefs).toContain("/shop");
    expect(hrefs).toContain("/about");
    expect(hrefs).toContain("/contact");
  });
});

describe("POLICY_LINKS", () => {
  it("every footer policy link points to a route that actually exists", () => {
    for (const item of POLICY_LINKS) {
      expect(routeFileExists(item.href), `${item.href} (${item.label}) has no page.tsx`).toBe(true);
    }
  });

  it("includes Delivery, Returns, and Privacy policies", () => {
    const hrefs = POLICY_LINKS.map((item) => item.href);
    expect(hrefs).toContain("/policies/delivery");
    expect(hrefs).toContain("/policies/returns");
    expect(hrefs).toContain("/policies/privacy");
  });
});

describe("FOOTER_SHOP_LINKS", () => {
  it("every footer shop link points to a route that actually exists", () => {
    for (const item of FOOTER_SHOP_LINKS) {
      expect(routeFileExists(item.href), `${item.href} (${item.label}) has no page.tsx`).toBe(true);
    }
  });
});

describe("FOOTER_CARE_LINKS", () => {
  it("every footer customer-care link points to a route that actually exists", () => {
    for (const item of FOOTER_CARE_LINKS) {
      expect(routeFileExists(item.href), `${item.href} (${item.label}) has no page.tsx`).toBe(true);
    }
  });

  it("includes the three policies plus Contact", () => {
    const hrefs = FOOTER_CARE_LINKS.map((item) => item.href);
    expect(hrefs).toContain("/policies/delivery");
    expect(hrefs).toContain("/policies/returns");
    expect(hrefs).toContain("/policies/privacy");
    expect(hrefs).toContain("/contact");
  });
});
