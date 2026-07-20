import type { Metadata } from "next";
import Link from "next/link";

import { formatBhd } from "@/lib/formatters/currency";

export const metadata: Metadata = {
  title: "Request Submitted",
};

type OrderRequestSuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Purely a display page — the request was already created server-side
 * (with full validation) before the customer was redirected here. Every
 * value below is echoed from query params for display only, never used
 * for any further mutation. No internal IDs are ever put in these params —
 * only the human-facing request number, product name, total, and payment
 * preference label.
 */
export default async function OrderRequestSuccessPage({ searchParams }: OrderRequestSuccessPageProps) {
  const params = await searchParams;
  const requestNumber = getParam(params, "request") ?? "";
  const productName = getParam(params, "product") ?? "";
  const totalRaw = getParam(params, "total");
  const total = totalRaw ? Number(totalRaw) : null;
  const paymentPreference = getParam(params, "payment") ?? "";
  const whatsappUrl = getParam(params, "whatsapp") ?? "";

  const details = [
    productName ? { label: "Product", value: productName } : null,
    total !== null && Number.isFinite(total) ? { label: "Total", value: formatBhd(total) } : null,
    paymentPreference ? { label: "Payment preference", value: paymentPreference } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <main className="flex flex-1 items-center justify-center bg-soft px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-[0_18px_48px_rgba(90,53,59,0.1)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success ring-1 ring-success/25">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5 10 17l9-10" />
          </svg>
        </div>

        <h1 className="mt-5 font-display text-2xl text-rose-deep">Request submitted</h1>

        {requestNumber ? (
          <p className="mx-auto mt-4 inline-flex items-center rounded-full bg-soft px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
            {requestNumber}
          </p>
        ) : null}

        {details.length > 0 ? (
          <div className="mt-5 space-y-2 rounded-xl border border-border bg-surface-soft p-4 text-left text-sm">
            {details.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <span className="text-ink-muted">{row.label}</span>
                <span className="font-medium text-ink">{row.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        <p className="mt-6 text-sm leading-6 text-ink-muted">
          {whatsappUrl
            ? "Your request has been prepared. Please send the WhatsApp message so Moosiva can confirm availability and payment."
            : "Your request was saved. Please contact Moosiva to complete the order."}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(155,95,104,0.2)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z" /><path d="M8.5 8.2c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.5.9 1.2 1.7 2.1 2.2.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .4-.2 1.2-.7 1.6-.5.5-1.3.8-2.1.6-1-.2-2.3-.7-3.9-2.1-1.3-1.2-2.2-2.7-2.5-3.7-.3-1 0-1.8.3-2.2Z" /></svg>
              Open WhatsApp
            </a>
          ) : null}
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border-input px-6 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
