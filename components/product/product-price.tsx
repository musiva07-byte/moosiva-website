import { formatBhd } from "@/lib/formatters/currency";

type ProductPriceProps = {
  regularPriceBhd: number | null;
  discountPriceBhd: number | null;
  className?: string;
};

export function ProductPrice({ regularPriceBhd, discountPriceBhd, className }: ProductPriceProps) {
  if (regularPriceBhd === null) {
    return <span className={className}>Price on request</span>;
  }

  const hasDiscount = discountPriceBhd !== null && discountPriceBhd < regularPriceBhd;

  if (!hasDiscount) {
    return <span className={className}>{formatBhd(regularPriceBhd)}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span className="text-ink-muted line-through">{formatBhd(regularPriceBhd)}</span>
      <span className="font-semibold text-primary">{formatBhd(discountPriceBhd)}</span>
    </span>
  );
}
