import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MobileNav } from "./mobile-nav";
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
