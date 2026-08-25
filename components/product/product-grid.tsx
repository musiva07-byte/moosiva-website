import { ProductCard } from "@/components/product/product-card";
import type { PublicProductListItem } from "@/types/public-product";

type ProductGridProps = {
  products: PublicProductListItem[];
  variant?: "default" | "horizontal";
  layout?: "catalog" | "homepage";
};

// Caps columns/width to the actual item count so a sparse catalog (e.g. one
// published product) renders a compact, centered row instead of a single
// card stretched across an otherwise-empty 4-column grid.
const DEFAULT_GRID_CLASS_BY_COUNT: Record<number, string> = {
  1: "mx-auto max-w-70 grid-cols-1",
  2: "mx-auto max-w-144 grid-cols-2",
  3: "mx-auto max-w-218 grid-cols-2 sm:grid-cols-3",
};

export function ProductGrid({ products, variant = "default", layout = "catalog" }: ProductGridProps) {
  if (variant === "horizontal") {
    return (
      <div className="grid max-w-5xl gap-5 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant={variant} />
        ))}
      </div>
    );
  }

  const columnsClass = layout === "homepage" && products.length === 4
    ? "grid-cols-2 lg:grid-cols-4"
    : DEFAULT_GRID_CLASS_BY_COUNT[products.length] ??
      (layout === "homepage"
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4");

  return (
    <div className={`grid items-stretch gap-4 sm:gap-5 ${layout === "homepage" ? "xl:gap-5" : "lg:gap-6"} ${columnsClass}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
}
