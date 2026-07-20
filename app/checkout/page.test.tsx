import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockGetPublishedProductBySlug = vi.fn();
vi.mock("@/lib/services/products", () => ({
  getPublishedProductBySlug: (...args: unknown[]) => mockGetPublishedProductBySlug(...args),
}));

import CheckoutPage from "./page";
import { CHECKOUT_UNAVAILABLE_MESSAGE } from "@/lib/services/checkout";

const product = {
  id: "product-1",
  slug: "pearl-trim-abaya",
  name: "Pearl Trim Abaya",
  website_title: null,
  website_description: null,
  description: null,
  material: null,
  care_instructions: null,
  category: { name: "Abayas", slug: "abayas" },
  image: null,
  variants: [
    { id: "variant-1", color: "Black", size: "M", regular_price_bhd: 20, discount_price_bhd: null, stock_quantity: 5 },
  ],
  featured: false,
  new_arrival: false,
};

describe("CheckoutPage — query param validation", () => {
  it("shows the unavailable message and a Back to shop button when product is missing", async () => {
    const element = await CheckoutPage({
      searchParams: Promise.resolve({ variant: "variant-1", quantity: "1" }),
    });
    const html = renderToStaticMarkup(element);
    expect(html).toContain(CHECKOUT_UNAVAILABLE_MESSAGE);
    expect(html).toContain("Back to shop");
  });

  it("shows the unavailable message when variant is missing", async () => {
    const element = await CheckoutPage({
      searchParams: Promise.resolve({ product: "pearl-trim-abaya", quantity: "1" }),
    });
    const html = renderToStaticMarkup(element);
    expect(html).toContain(CHECKOUT_UNAVAILABLE_MESSAGE);
  });

  it("shows the unavailable message when quantity is not a positive integer", async () => {
    mockGetPublishedProductBySlug.mockResolvedValue(product);
    const element = await CheckoutPage({
      searchParams: Promise.resolve({ product: "pearl-trim-abaya", variant: "variant-1", quantity: "0" }),
    });
    const html = renderToStaticMarkup(element);
    expect(html).toContain(CHECKOUT_UNAVAILABLE_MESSAGE);
  });

  it("shows the unavailable message when the product/variant no longer resolves", async () => {
    mockGetPublishedProductBySlug.mockResolvedValue(null);
    const element = await CheckoutPage({
      searchParams: Promise.resolve({ product: "does-not-exist", variant: "variant-1", quantity: "1" }),
    });
    const html = renderToStaticMarkup(element);
    expect(html).toContain(CHECKOUT_UNAVAILABLE_MESSAGE);
  });

  it("renders the checkout summary and form for a valid selection", async () => {
    mockGetPublishedProductBySlug.mockResolvedValue(product);
    const element = await CheckoutPage({
      searchParams: Promise.resolve({ product: "pearl-trim-abaya", variant: "variant-1", quantity: "1" }),
    });
    const html = renderToStaticMarkup(element);
    expect(html).toContain("Pearl Trim Abaya");
    expect(html).toContain("Submit to WhatsApp");
    expect(html).not.toContain(CHECKOUT_UNAVAILABLE_MESSAGE);
  });
});
