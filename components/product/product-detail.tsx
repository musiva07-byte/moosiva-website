"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
import { ProductOptionSelector } from "@/components/product/product-option-selector";
import { ProductPrice } from "@/components/product/product-price";
import { ProductQuantitySelector } from "@/components/product/product-quantity-selector";
import { ProductStockNote } from "@/components/product/product-stock-note";
import { buildProductEnquiryMessage } from "@/lib/services/whatsapp";
import {
  buildCheckoutUrl,
  clampQuantity,
  findMatchingVariant,
  getDistinctColors,
  getDistinctSizes,
  pickDefaultVariant,
  validateSelection,
} from "@/lib/services/product-detail";
import type { PublicProductDetail } from "@/types/public-product";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosivabh.com";

type ProductDetailProps = {
  product: PublicProductDetail;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();

  const colors = useMemo(() => getDistinctColors(product.variants), [product.variants]);
  const sizes = useMemo(() => getDistinctSizes(product.variants), [product.variants]);
  const needsColor = colors.length > 1;
  const needsSize = sizes.length > 1;

  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length === 1 ? colors[0] : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

  const effectiveColor = needsColor ? selectedColor : (colors[0] ?? null);
  const effectiveSize = needsSize ? selectedSize : (sizes[0] ?? null);

  const matchedVariant = useMemo(
    () => findMatchingVariant(product.variants, effectiveColor, effectiveSize),
    [product.variants, effectiveColor, effectiveSize],
  );

  const defaultVariant = useMemo(() => pickDefaultVariant(product.variants), [product.variants]);
  const displayVariant = matchedVariant ?? defaultVariant;
  const maxQuantity = matchedVariant?.stock_quantity ?? 1;
  const title = product.website_title || product.name;
  const productUrl = `${SITE_URL}/product/${product.slug}`;

  const hasCompleteSelection = (!needsColor || selectedColor !== null) && (!needsSize || selectedSize !== null);
  const isUnavailable = hasCompleteSelection && !matchedVariant;

  function handleColorSelect(color: string) {
    setFormError(null);
    setSelectedColor(color);
  }

  function handleSizeSelect(size: string) {
    setFormError(null);
    setSelectedSize(size);
  }

  function handleQuantityChange(next: number) {
    setQuantity(clampQuantity(next, maxQuantity));
  }

  function handleBuyNow() {
    const validation = validateSelection({
      needsColor,
      needsSize,
      selectedColor,
      selectedSize,
      matchedVariant,
    });

    if (!validation.ok) {
      setFormError(validation.message);
      return;
    }

    setFormError(null);
    router.push(buildCheckoutUrl({ slug: product.slug, variantId: matchedVariant!.id, quantity }));
  }

  const whatsappMessage = buildProductEnquiryMessage({
    productName: title,
    color: effectiveColor,
    size: effectiveSize,
    quantity,
    productUrl,
  });

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-primary"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13 5 8l5-5" />
          </svg>
          Back to shop
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-soft shadow-[0_16px_36px_rgba(90,53,59,0.1)]">
            {product.image ? (
              <Image
                src={product.image.url}
                alt={title}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted">
                <svg viewBox="0 0 32 32" aria-hidden="true" className="h-10 w-10 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M9 3c0 1.8 1.2 3 3 3s3-1.2 3-3l2 1 1.5 5-2.5 1 1 10H7l1-10-2.5-1L7 4l2-1Z" /></svg>
                <span className="text-sm">Image coming soon</span>
              </div>
            )}
            {(product.new_arrival || product.featured) && (
              <div className="pointer-events-none absolute left-4 top-4 flex gap-1.5">
                {product.new_arrival && (
                  <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary shadow-sm">
                    New
                  </span>
                )}
                {product.featured && (
                  <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                    Featured
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {product.category ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{product.category.name}</p>
            ) : null}

            <h1 className="font-display text-3xl leading-tight text-rose-deep sm:text-4xl">{title}</h1>

            {product.website_description || product.description ? (
              <p className="text-sm leading-6 text-ink-muted">{product.website_description || product.description}</p>
            ) : null}

            <div className="mt-2 rounded-2xl border border-border bg-surface p-5 shadow-[0_10px_26px_rgba(90,53,59,0.06)] sm:p-6">
              <div className="text-xl font-semibold text-ink">
                <ProductPrice
                  regularPriceBhd={displayVariant?.regular_price_bhd ?? null}
                  discountPriceBhd={displayVariant?.discount_price_bhd ?? null}
                />
              </div>

              <div className="mt-4 space-y-4">
                {needsColor && (
                  <ProductOptionSelector
                    label="Color"
                    options={colors}
                    selected={selectedColor}
                    onSelect={handleColorSelect}
                  />
                )}

                {needsSize && (
                  <ProductOptionSelector
                    label="Size"
                    options={sizes}
                    selected={selectedSize}
                    onSelect={handleSizeSelect}
                  />
                )}

                <ProductStockNote variant={matchedVariant} isUnavailable={isUnavailable} />

                <ProductQuantitySelector
                  value={quantity}
                  max={maxQuantity}
                  disabled={!matchedVariant}
                  onChange={handleQuantityChange}
                />
              </div>

              {formError ? (
                <p className="mt-4 rounded-md border border-error/20 bg-error/5 p-3 text-sm text-error">{formError}</p>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(155,95,104,0.2)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_14px_26px_rgba(155,95,104,0.26)]"
                >
                  Buy Now
                </button>
                <WhatsAppCta
                  showIcon
                  label="Ask on WhatsApp"
                  message={whatsappMessage}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border-input px-6 py-3 text-center text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-soft/70 px-4 py-3 text-xs leading-5 text-ink-muted">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h9v8H3zM12 8h2.5l2.5 2.5V14h-5z" /><circle cx="6" cy="15.5" r="1.5" /><circle cx="14.5" cy="15.5" r="1.5" /></svg>
              <span>
                Delivery is coordinated across Bahrain. Exchange details are confirmed with our team on
                WhatsApp before your order is finalized.
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
