import type { Metadata } from "next";

import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Moosiva Lux Wear on WhatsApp or Instagram.",
};

const WHATSAPP_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_50%_45%,var(--bg-surface-soft),var(--bg-soft))]">
        <svg viewBox="0 0 240 260" aria-hidden="true" className="pointer-events-none absolute -left-8 bottom-0 hidden h-full w-56 text-primary opacity-[0.13] md:block" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 248c36-58 65-100 112-137 28-22 45-47 53-88" strokeWidth="1.4" />
          <path d="M48 192c-17-3-31 2-41 15 18 4 33-1 45-14M73 159c-4-19 1-35 15-47 6 19 1 35-14 49M102 126c-16-7-31-5-44 6 16 9 31 7 46-5M133 91c-5-17-1-32 11-45 7 16 3 32-10 47M158 55c-13-8-25-8-37 0 13 10 26 10 38 1" strokeWidth="1.1" />
          <path d="M28 223c-13-1-24 4-31 15 15 2 26-3 34-15M84 149c-15-13-29-17-43-11 13 15 28 19 44 12M121 105c-1-16 5-29 18-38 3 16-3 29-17 39M148 73c-11-11-22-15-34-10 10 12 22 16 35 11" strokeWidth="0.8" />
        </svg>

        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Get in touch</p>
          <div className="mx-auto mt-3 flex w-28 items-center gap-2 text-primary/50" aria-hidden="true">
            <span className="h-px flex-1 bg-current" />
            <svg viewBox="0 0 18 18" className="h-4 w-4 fill-current"><path d="M12.8 1.7c.5 3.4-.4 5.9-2.7 7.6-1.9 1.4-4.2 1.5-6.8.3 1-2.6 2.6-4.3 4.9-5.1 1.7-.6 3.2-1.5 4.6-2.8Zm-4.4 7c2.5.7 4.2 2.2 5 4.5-2.3.8-4.3.5-5.8-.9-1.1-1-1.6-2.2-1.5-3.8.8-.1 1.5 0 2.3.2Z" /></svg>
          </div>
          <h1 className="mt-3 text-balance font-display text-4xl leading-tight text-rose-deep sm:text-5xl">Contact {SITE_NAME}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-muted">Have a question about a piece, sizing, or delivery? Reach us on WhatsApp and our team will help.</p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface/90 px-6 py-8 text-center shadow-[0_18px_55px_rgba(90,53,59,0.06)] sm:px-12 sm:py-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-soft text-rose-deep shadow-sm">
            <svg viewBox="0 0 32 32" aria-hidden="true" className="h-9 w-9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
              <path d="M6.5 17v-2a9.5 9.5 0 0 1 19 0v2" />
              <path d="M8.5 23H7a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1.5v8Zm15 0H25a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1.5v8Z" />
              <path d="M23.5 23c0 2.2-2.2 4-5 4h-2" />
              <rect x="13" y="25.5" width="4" height="2.5" rx="1.25" />
            </svg>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Service area</p>
          <p className="mt-1 font-display text-2xl text-rose-deep">Bahrain</p>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-ink-muted">Send us your selected product through WhatsApp and our team will confirm availability and payment.</p>

          <div className="mx-auto mt-7 flex max-w-sm flex-col items-stretch gap-3">
            {WHATSAPP_CONFIGURED ? (
              <WhatsAppCta label="Chat on WhatsApp" message="Hi Moosiva, I'd like some help with an order." showIcon className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
            ) : (
              <p className="rounded-full border border-dashed border-border-input px-6 py-3 text-sm text-ink-muted">WhatsApp contact will be available here soon.</p>
            )}

            {INSTAGRAM_URL ? (
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-input bg-surface px-6 py-3 text-sm font-medium text-primary transition-[border-color,color,transform] hover:-translate-y-0.5 hover:border-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                Follow us on Instagram
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}