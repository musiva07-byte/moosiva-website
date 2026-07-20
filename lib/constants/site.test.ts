import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { MAIN_NAV, POLICY_LINKS } from "./site";

/**
 * "No navbar/footer link should lead to 404" — verified against the real filesystem
 * rather than a hardcoded list, so this test fails the moment a route is renamed or
 * removed without updating navigation.
 */
function routeFileExists(href: string): boolean {
  const segment = href === "/" ? "" : href;
  const pageFile = path.resolve(process.cwd(), "app", `.${segment}`, "page.tsx");
  return fs.existsSync(pageFile);
}

describe("MAIN_NAV", () => {
  it("every header/footer nav link points to a route that actually exists", () => {
    for (const item of MAIN_NAV) {
      expect(routeFileExists(item.href), `${item.href} (${item.label}) has no page.tsx`).toBe(true);
    }
  });

  it("includes Shop, About, and Contact", () => {
    const hrefs = MAIN_NAV.map((item) => item.href);
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
