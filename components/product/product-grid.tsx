import { ProductCard } from "@/components/product/product-card";
import type { PublicProductListItem } from "@/types/public-product";

type ProductGridProps = {
  products: PublicProductListItem[];
  variant?: "default" | "horizontal";
};

// Caps columns/width to the actual item count so a sparse catalog (e.g. one
// published product) renders a compact, centered row instead of a single
// card stretched across an otherwise-empty 4-column grid.
const DEFAULT_GRID_CLASS_BY_COUNT: Record<number, string> = {
  1: "mx-auto max-w-70 grid-cols-1",
  2: "mx-auto max-w-144 grid-cols-2",
  3: "mx-auto max-w-218 grid-cols-2 sm:grid-cols-3",
};

export function ProductGrid({ products, variant = "default" }: ProductGridProps) {
  if (variant === "horizontal") {
    return (
      <div className="grid max-w-215 gap-4 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant={variant} />
        ))}
      </div>
    );
  }

  const columnsClass =
    DEFAULT_GRID_CLASS_BY_COUNT[products.length] ?? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`grid gap-3 lg:gap-2 ${columnsClass}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
}
