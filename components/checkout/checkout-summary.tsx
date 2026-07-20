import Image from "next/image";

import { formatBhd } from "@/lib/formatters/currency";
import type { PublicProductDetail, PublicProductVariant } from "@/types/public-product";

type CheckoutSummaryProps = {
  product: PublicProductDetail;
  variant: PublicProductVariant;
  quantity: number;
  unitPriceBhd: number;
  totalBhd: number;
};

export function CheckoutSummary({ product, variant, quantity, unitPriceBhd, totalBhd }: CheckoutSummaryProps) {
  const title = product.website_title || product.name;

  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[0_10px_26px_rgba(90,53,59,0.06)] sm:gap-5 sm:p-5">
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-soft sm:h-32 sm:w-28">
        {product.image ? (
          <Image src={product.image.url} alt={title} fill sizes="112px" className="object-cover object-top" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center text-ink-muted">
            <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M9 3c0 1.8 1.2 3 3 3s3-1.2 3-3l2 1 1.5 5-2.5 1 1 10H7l1-10-2.5-1L7 4l2-1Z" /></svg>
            <span className="text-[10px]">No image</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 text-sm">
        {product.category ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.category.name}</p>
        ) : null}
        <p className="font-display text-base text-rose-deep">{title}</p>
        <p className="text-ink-muted">
          Color: {variant.color} · Size: {variant.size}
        </p>
        <p className="text-ink-muted">Quantity: {quantity}</p>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
          <span className="text-xs text-ink-muted">Unit price: {formatBhd(unitPriceBhd)}</span>
          <span className="font-semibold text-ink">{formatBhd(totalBhd)}</span>
        </div>
      </div>
    </div>
  );
}
