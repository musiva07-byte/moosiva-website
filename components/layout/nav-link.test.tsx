import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

import { NavLink } from "./nav-link";

describe("NavLink", () => {
  it("applies the active class when the current path matches the link's path", () => {
    mockUsePathname.mockReturnValue("/shop");
    const html = renderToStaticMarkup(
      <NavLink href="/shop" className="base" activeClassName="active">
        Shop
      </NavLink>,
    );
    expect(html).toContain('class="base active"');
  });

  it("ignores query strings/hashes when comparing the current path", () => {
    mockUsePathname.mockReturnValue("/shop");
    const html = renderToStaticMarkup(
      <NavLink href="/shop?sort=new_arrival" className="base" activeClassName="active">
        New Arrivals
      </NavLink>,
    );
    expect(html).toContain('class="base active"');
  });

  it("does not apply the active class on a different route", () => {
    mockUsePathname.mockReturnValue("/about");
    const html = renderToStaticMarkup(
      <NavLink href="/shop" className="base" activeClassName="active">
        Shop
      </NavLink>,
    );
    expect(html).toContain('class="base"');
    expect(html).not.toContain("active");
  });
});
