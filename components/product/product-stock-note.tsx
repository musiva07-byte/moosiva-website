import { OPTION_UNAVAILABLE_MESSAGE } from "@/lib/services/product-detail";
import type { PublicProductVariant } from "@/types/public-product";

type ProductStockNoteProps = {
  variant: PublicProductVariant | null;
  isUnavailable: boolean;
};

export function ProductStockNote({ variant, isUnavailable }: ProductStockNoteProps) {
  if (isUnavailable) {
    return <p className="text-sm text-error">{OPTION_UNAVAILABLE_MESSAGE}</p>;
  }

  if (!variant) {
    return <p className="text-sm text-ink-muted">Select your options to check availability.</p>;
  }

  return (
    <p className="text-sm text-success">In stock — {variant.stock_quantity} available</p>
  );
}
