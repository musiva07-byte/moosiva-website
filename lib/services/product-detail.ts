/**
 * Pure variant-selection/validation/checkout-handoff logic for the product
 * detail page. Kept separate from components/product/product-detail.tsx so
 * these rules are testable without rendering React or mocking next/navigation.
 */
import type { PublicProductVariant } from "@/types/public-product";

export const SELECTION_REQUIRED_MESSAGE = "Please select your option before continuing.";
export const OPTION_UNAVAILABLE_MESSAGE = "This option is currently unavailable.";

export function getDistinctColors(variants: PublicProductVariant[]): string[] {
  return Array.from(new Set(variants.map((v) => v.color)));
}

export function getDistinctSizes(variants: PublicProductVariant[]): string[] {
  return Array.from(new Set(variants.map((v) => v.size)));
}

/**
 * The variant matching the given color/size, or null if none matches (or a
 * required selection is still missing). `null` for selectedColor/selectedSize
 * means "this dimension has only one option and doesn't need a selection" —
 * pass the actual (single) value from getDistinctColors/Sizes for that case,
 * not null, or every variant will match on that dimension.
 */
export function findMatchingVariant(
  variants: PublicProductVariant[],
  selectedColor: string | null,
  selectedSize: string | null,
): PublicProductVariant | null {
  if (selectedColor === null || selectedSize === null) {
    return null;
  }
  return variants.find((v) => v.color === selectedColor && v.size === selectedSize) ?? null;
}

/** Preview variant shown before the customer finishes selecting — lowest current price among priced variants. */
export function pickDefaultVariant(variants: PublicProductVariant[]): PublicProductVariant | null {
  let best: PublicProductVariant | null = null;
  let bestPrice = Infinity;

  for (const variant of variants) {
    const price = variant.discount_price_bhd ?? variant.regular_price_bhd;
    if (price === null) {
      continue;
    }
    if (price < bestPrice) {
      bestPrice = price;
      best = variant;
    }
  }

  return best;
}

/** Clamps to [1, maxQuantity], flooring non-integer input and falling back to 1 for invalid input. */
export function clampQuantity(value: number, maxQuantity: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  const floored = Math.floor(value);
  const max = Math.max(maxQuantity, 1);
  return Math.min(Math.max(floored, 1), max);
}

export type SelectionValidation = { ok: true } | { ok: false; message: string };

export function validateSelection(params: {
  needsColor: boolean;
  needsSize: boolean;
  selectedColor: string | null;
  selectedSize: string | null;
  matchedVariant: PublicProductVariant | null;
}): SelectionValidation {
  if ((params.needsColor && !params.selectedColor) || (params.needsSize && !params.selectedSize)) {
    return { ok: false, message: SELECTION_REQUIRED_MESSAGE };
  }
  if (!params.matchedVariant) {
    return { ok: false, message: OPTION_UNAVAILABLE_MESSAGE };
  }
  return { ok: true };
}

/**
 * Buy Now handoff URL. Only carries the slug, variant id, and quantity —
 * never price or stock (those are re-checked server-side once checkout is
 * built), and never customer data.
 */
export function buildCheckoutUrl(params: { slug: string; variantId: string; quantity: number }): string {
  const query = new URLSearchParams({
    product: params.slug,
    variant: params.variantId,
    quantity: String(params.quantity),
  });
  return `/checkout?${query.toString()}`;
}
