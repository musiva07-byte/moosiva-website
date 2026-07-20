import { describe, expect, it } from "vitest";
import {
  OPTION_UNAVAILABLE_MESSAGE,
  SELECTION_REQUIRED_MESSAGE,
  buildCheckoutUrl,
  clampQuantity,
  findMatchingVariant,
  getDistinctColors,
  getDistinctSizes,
  pickDefaultVariant,
  validateSelection,
} from "./product-detail";
import type { PublicProductVariant } from "@/types/public-product";

const blackM: PublicProductVariant = {
  id: "v1",
  color: "Black",
  size: "M",
  regular_price_bhd: 20,
  discount_price_bhd: null,
  stock_quantity: 4,
};
const blackL: PublicProductVariant = {
  id: "v2",
  color: "Black",
  size: "L",
  regular_price_bhd: 20,
  discount_price_bhd: 15,
  stock_quantity: 2,
};
const beigeM: PublicProductVariant = {
  id: "v3",
  color: "Beige",
  size: "M",
  regular_price_bhd: 25,
  discount_price_bhd: null,
  stock_quantity: 6,
};
const variants = [blackM, blackL, beigeM];

describe("getDistinctColors / getDistinctSizes", () => {
  it("dedupes in first-seen order", () => {
    expect(getDistinctColors(variants)).toEqual(["Black", "Beige"]);
    expect(getDistinctSizes(variants)).toEqual(["M", "L"]);
  });
});

describe("findMatchingVariant", () => {
  it("finds the variant matching both color and size", () => {
    expect(findMatchingVariant(variants, "Black", "L")).toBe(blackL);
  });

  it("returns null for a color/size combination that doesn't exist (unavailable option)", () => {
    expect(findMatchingVariant(variants, "Beige", "L")).toBeNull();
  });

  it("returns null when color or size hasn't been selected yet", () => {
    expect(findMatchingVariant(variants, null, "M")).toBeNull();
    expect(findMatchingVariant(variants, "Black", null)).toBeNull();
  });
});

describe("pickDefaultVariant", () => {
  it("picks the variant with the lowest current (discount-aware) price", () => {
    // blackL's active price is 15 (its discount) — lower than blackM's 20 and beigeM's 25.
    expect(pickDefaultVariant(variants)).toBe(blackL);
  });

  it("returns null when no variant has a valid price", () => {
    const unpriced: PublicProductVariant = { ...blackM, regular_price_bhd: null, discount_price_bhd: null };
    expect(pickDefaultVariant([unpriced])).toBeNull();
  });

  it("returns null for an empty list", () => {
    expect(pickDefaultVariant([])).toBeNull();
  });
});

describe("clampQuantity", () => {
  it("keeps a valid quantity within range unchanged", () => {
    expect(clampQuantity(3, 5)).toBe(3);
  });

  it("never returns less than 1", () => {
    expect(clampQuantity(0, 5)).toBe(1);
    expect(clampQuantity(-4, 5)).toBe(1);
  });

  it("never exceeds the maximum stock quantity", () => {
    expect(clampQuantity(10, 5)).toBe(5);
  });

  it("floors non-integer input", () => {
    expect(clampQuantity(2.9, 5)).toBe(2);
  });

  it("falls back to 1 for non-finite input", () => {
    expect(clampQuantity(NaN, 5)).toBe(1);
    expect(clampQuantity(Infinity, 5)).toBe(1);
  });

  it("treats a max of 0 as a max of 1 (still allows quantity 1 to be selected)", () => {
    expect(clampQuantity(1, 0)).toBe(1);
  });
});

describe("validateSelection", () => {
  it("requires color when the product has multiple colors and none is selected", () => {
    const result = validateSelection({
      needsColor: true,
      needsSize: false,
      selectedColor: null,
      selectedSize: null,
      matchedVariant: null,
    });
    expect(result).toEqual({ ok: false, message: SELECTION_REQUIRED_MESSAGE });
  });

  it("requires size when the product has multiple sizes and none is selected", () => {
    const result = validateSelection({
      needsColor: false,
      needsSize: true,
      selectedColor: null,
      selectedSize: null,
      matchedVariant: null,
    });
    expect(result).toEqual({ ok: false, message: SELECTION_REQUIRED_MESSAGE });
  });

  it("reports the option as unavailable when a full selection doesn't map to a real variant", () => {
    const result = validateSelection({
      needsColor: true,
      needsSize: true,
      selectedColor: "Beige",
      selectedSize: "L",
      matchedVariant: null,
    });
    expect(result).toEqual({ ok: false, message: OPTION_UNAVAILABLE_MESSAGE });
  });

  it("passes when a real variant is matched", () => {
    const result = validateSelection({
      needsColor: true,
      needsSize: true,
      selectedColor: "Black",
      selectedSize: "L",
      matchedVariant: blackL,
    });
    expect(result).toEqual({ ok: true });
  });

  it("passes for a single-variant product with no selection required", () => {
    const result = validateSelection({
      needsColor: false,
      needsSize: false,
      selectedColor: null,
      selectedSize: null,
      matchedVariant: beigeM,
    });
    expect(result).toEqual({ ok: true });
  });
});

describe("buildCheckoutUrl", () => {
  it("includes only product slug, variant id, and quantity", () => {
    const url = buildCheckoutUrl({ slug: "pearl-trim-abaya", variantId: "v2", quantity: 3 });
    expect(url).toBe("/checkout?product=pearl-trim-abaya&variant=v2&quantity=3");

    const params = new URLSearchParams(url.split("?")[1]);
    expect(Array.from(params.keys()).sort()).toEqual(["product", "quantity", "variant"]);
  });

  it("never includes price, stock, or customer data", () => {
    const url = buildCheckoutUrl({ slug: "pearl-trim-abaya", variantId: "v2", quantity: 3 });
    for (const forbidden of ["price", "stock", "name", "phone", "mobile", "address"]) {
      expect(url.toLowerCase()).not.toContain(forbidden);
    }
  });
});
