import Image from "next/image";
import Link from "next/link";

import { ProductPrice } from "@/components/product/product-price";
import type { PublicProductListItem } from "@/types/public-product";

type ProductCardProps = {
  product: PublicProductListItem;
  variant?: "default" | "horizontal";
};

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const title = product.website_title || product.name;
  const detailHref = `/product/${product.slug}`;
  const horizontal = variant === "horizontal";

  return (
    <div className={`group flex overflow-hidden border border-border bg-surface shadow-[0_6px_16px_rgba(90,53,59,0.05)] transition-[box-shadow,transform,border-color] hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_14px_30px_rgba(90,53,59,0.12)] ${horizontal ? "h-40 w-full flex-row rounded-xl" : "flex-col rounded-2xl"}`}>
      <div className={`relative overflow-hidden bg-soft ${horizontal ? "h-full w-[48%] shrink-0" : "aspect-4/5"}`}>
        <Link href={detailHref} className="block h-full w-full">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={title}
              fill
              sizes={horizontal ? "220px" : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
              className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted">
              <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M9 3c0 1.8 1.2 3 3 3s3-1.2 3-3l2 1 1.5 5-2.5 1 1 10H7l1-10-2.5-1L7 4l2-1Z" /></svg>
              <span className="text-[11px]">Image coming soon</span>
            </div>
          )}
        </Link>

        {!horizontal && (product.new_arrival || product.featured) && (
          <div className="pointer-events-none absolute left-3 top-3 flex gap-1.5">
            {product.new_arrival && (
              <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary shadow-sm">
                New
              </span>
            )}
            {product.featured && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Featured
              </span>
            )}
          </div>
        )}
      </div>

      <div className={`flex min-w-0 flex-1 flex-col ${horizontal ? "gap-1 p-3" : "gap-1.5 p-3"}`}>
        {product.category ? (
          <p className={`uppercase tracking-wide text-ink-muted ${horizontal ? "text-[10px] text-primary" : "text-xs"}`}>{product.category.name}</p>
        ) : null}

        <Link href={detailHref} className="font-display text-base text-rose-deep hover:text-primary">
          {title}
        </Link>

        {!horizontal && product.website_description ? (
          <p className="line-clamp-2 text-sm text-ink-muted">{product.website_description}</p>
        ) : null}

        {(product.colors.length > 0 || product.sizes.length > 0) && (
          <p className={`text-ink-muted ${horizontal ? "text-[10px] leading-4" : "text-[11px]"}`}>
            {product.colors.length > 0
              ? `${product.colors.length} color${product.colors.length > 1 ? "s" : ""}`
              : null}
            {product.colors.length > 0 && product.sizes.length > 0 ? " · " : null}
            {product.sizes.length > 0 ? `Sizes: ${product.sizes.join(", ")}` : null}
          </p>
        )}

        <div className="text-xs font-medium text-ink">
          <ProductPrice
            regularPriceBhd={product.regular_price_bhd}
            discountPriceBhd={product.discount_price_bhd}
          />
        </div>

        <div className={`mt-auto flex flex-col ${horizontal ? "gap-1 pt-1" : "gap-1.5 pt-2"}`}>
          <Link
            href={detailHref}
            className={`w-full whitespace-nowrap rounded-full border border-border-input px-4 text-center font-medium text-ink transition-colors hover:border-primary hover:text-primary ${horizontal ? "py-1 text-[10px]" : "py-1.5 text-xs"}`}
          >
            View product
          </Link>
          <Link
            href={detailHref}
            className={`w-full whitespace-nowrap rounded-full bg-primary text-center font-medium text-white shadow-[0_6px_14px_rgba(155,95,104,0.22)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_10px_20px_rgba(155,95,104,0.28)] ${horizontal ? "px-4 py-1 text-[10px]" : "px-4 py-2 text-xs"}`}
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
