import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { resolveCheckoutSelection } from "@/lib/services/checkout";

export const metadata: Metadata = {
  title: "Checkout",
};

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const slug = getParam(params, "product") ?? "";
  const variantId = getParam(params, "variant") ?? "";
  const quantity = Number(getParam(params, "quantity") ?? "");

  const selection = await resolveCheckoutSelection(slug, variantId, quantity);

  if (!selection.ok) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-soft px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-error shadow-sm">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v5M12 15.5h.01" /></svg>
        </div>
        <p className="mt-5 max-w-sm text-base font-medium text-ink">{selection.error}</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(155,95,104,0.2)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-soft/40">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-primary"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13 5 8l5-5" />
          </svg>
          Back to shop
        </Link>

        <h1 className="mt-4 font-display text-3xl text-rose-deep">Checkout Request</h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          Fill in your details below. We&apos;ll confirm availability and payment with you on WhatsApp.
        </p>

        <div className="mt-8">
          <CheckoutSummary
            product={selection.product}
            variant={selection.variant}
            quantity={quantity}
            unitPriceBhd={selection.unitPriceBhd}
            totalBhd={selection.totalBhd}
          />
        </div>

        <div className="mt-8">
          <CheckoutForm productSlug={selection.product.slug} variantId={selection.variant.id} quantity={quantity} />
        </div>
      </div>
    </main>
  );
}
