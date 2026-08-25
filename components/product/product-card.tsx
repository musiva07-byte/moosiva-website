import Image from "next/image";
import Link from "next/link";

import { ProductPrice } from "@/components/product/product-price";
import { SaveLookButton } from "@/components/product/save-look-button";
import type { PublicProductListItem } from "@/types/public-product";

type ProductCardProps = {
  product: PublicProductListItem;
  variant?: "default" | "horizontal";
};

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const title = product.website_title || product.name;
  const detailHref = `/product/${product.slug}`;
  const horizontal = variant === "horizontal";
  const sizeSummary = product.sizes.slice(0, 3).join(" / ");

  return (
    <article
      className={`group flex overflow-hidden border border-primary/10 bg-surface-soft shadow-[0_10px_30px_rgba(90,53,59,0.07)] transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_22px_45px_rgba(90,53,59,0.14)] ${
        horizontal ? "h-44 w-full flex-row rounded-xl" : "h-full flex-col rounded-xl"
      }`}
    >
      <div className={`relative overflow-hidden bg-soft ${horizontal ? "h-full w-[48%] shrink-0" : "aspect-4/5"}`}>
        {!horizontal ? <SaveLookButton productId={product.id} /> : null}
        <Link href={detailHref} className="block h-full w-full" aria-label={`View ${title}`}>
          {product.image ? (
            <Image
              src={product.image.url}
              alt={title}
              fill
              sizes={horizontal ? "220px" : "(min-width: 1280px) 17vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
              className="object-cover object-[50%_18%] transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted">
              <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M9 3c0 1.8 1.2 3 3 3s3-1.2 3-3l2 1 1.5 5-2.5 1 1 10H7l1-10-2.5-1L7 4l2-1Z" />
              </svg>
              <span className="text-[11px]">Image coming soon</span>
            </div>
          )}
        </Link>

        {!horizontal && (product.new_arrival || product.featured) ? (
          <div className="pointer-events-none absolute left-3 top-3 flex max-w-[calc(100%-4rem)] flex-wrap gap-1.5">
            {product.new_arrival ? (
              <span className="rounded-sm bg-primary px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">New</span>
            ) : null}
            {product.featured ? (
              <span className="rounded-sm bg-ink px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">Featured</span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={`flex min-w-0 flex-1 flex-col ${horizontal ? "gap-1.5 p-4" : "gap-2 p-3.5 sm:p-4"}`}>
        {product.category ? (
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{product.category.name}</p>
        ) : null}

        <Link href={detailHref} className={`line-clamp-2 font-display font-semibold leading-snug text-rose-deep transition-colors hover:text-primary ${horizontal ? "text-base" : "min-h-11 text-base sm:text-[17px]"}`}>
          {title}
        </Link>

        {product.colors.length > 0 || sizeSummary ? (
          <div className="flex min-h-5 flex-wrap items-center gap-2.5 text-[11px] text-ink-muted">
            {product.colors.length > 0 ? (
              <div className="flex items-center gap-1.5" aria-label="Available colors">
                {product.colors.slice(0, 4).map((color) => (
                  <span
                    key={color}
                    title={color}
                    className="h-3 w-3 rounded-full border border-border-input bg-soft shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ) : null}
            {sizeSummary ? <span className="truncate">{sizeSummary}{product.sizes.length > 3 ? ` +${product.sizes.length - 3}` : ""}</span> : null}
          </div>
        ) : null}

        <div className={`font-bold text-rose-deep ${horizontal ? "text-sm" : "text-base"}`}>
          <ProductPrice regularPriceBhd={product.regular_price_bhd} discountPriceBhd={product.discount_price_bhd} />
        </div>

        <div className={`mt-auto flex ${horizontal ? "flex-col gap-1.5 pt-1" : "gap-2 pt-2"}`}>
          <Link
            href={detailHref}
            aria-label={`Buy ${title}`}
            className={`flex min-h-10 flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-rose-deep text-center font-semibold text-white shadow-[0_7px_16px_rgba(90,53,59,0.2)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-ink ${horizontal ? "px-4 py-1.5 text-[11px]" : "px-2 py-2 text-[11px]"}`}
          >
            Buy Now
          </Link>
          <Link
            href={detailHref}
            className={`flex min-h-10 flex-1 items-center justify-center whitespace-nowrap rounded-lg border border-border-input bg-surface/55 text-center font-medium text-ink transition-colors hover:border-primary hover:text-primary ${horizontal ? "px-3 py-1.5 text-[11px]" : "px-2 py-2 text-[10px]"}`}
          >
            View product
          </Link>
        </div>
      </div>
    </article>
  );
}
