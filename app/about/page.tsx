import type { Metadata } from "next";
import Image from "next/image";

import { WhatsAppCta } from "@/components/layout/whatsapp-cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Moosiva Lux Wear is a curated ladies' fashion boutique for Bahrain, offering elegant pieces you can request directly on WhatsApp.",
};

const OFFERINGS = [
  {
    title: "Curated selection",
    body: "Every piece is chosen for everyday wear, special occasions, and modest styling — not a mass catalog.",
  },
  {
    title: "Comfort and elegance",
    body: "Fabrics and silhouettes that feel as good as they look, for real life in Bahrain's climate.",
  },
  {
    title: "Personal service",
    body: "Message us directly and a real person helps you choose sizes, colors, and availability.",
  },
];

const ORDER_STEPS = [
  { step: "1", title: "Browse", body: "Explore the collection online, no account needed." },
  { step: "2", title: "Choose", body: "Pick your size, color, and quantity on the product page." },
  { step: "3", title: "Request", body: "Submit your details and delivery address." },
  { step: "4", title: "Confirm", body: "We confirm availability and payment with you on WhatsApp." },
];

function OfferingIcon({ title }: { title: string }) {
  if (title.includes("Comfort")) {
    return <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M26 5C15 7 8 13 6 26c8-2 14-7 20-21Z" /><path d="M7 25c5-7 9-10 16-16M13 17l-1-6M17 13l5 1" /></svg>;
  }
  if (title.includes("Personal")) {
    return <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M16 27S5 20 5 11a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 9-11 16-11 16Z" /></svg>;
  }
  return <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5c0 3 8 3 8 0M12 5l-3 8 3 3-4 12h16l-4-12 3-3-3-8" /></svg>;
}

function AboutStepIcon({ title }: { title: string }) {
  if (title === "Choose") {
    return <svg viewBox="0 0 28 28" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M8 10h12l1 14H7L8 10Z" /><path d="M10.5 10V7a3.5 3.5 0 0 1 7 0v3" /></svg>;
  }
  if (title === "Request") {
    return <svg viewBox="0 0 28 28" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M5 7h18v13H11l-5 4v-4H5V7Z" /><path d="M9 11h10M9 15h7" /></svg>;
  }
  if (title === "Confirm") {
    return <svg viewBox="0 0 28 28" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 8h13v12H3zM16 12h4l4 4v4h-8z" /><circle cx="8" cy="22" r="2" /><circle cx="20" cy="22" r="2" /></svg>;
  }
  return <svg viewBox="0 0 28 28" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="5" y="5" width="18" height="18" rx="1" /><path d="M9 8v4h4V8H9ZM16 8v4h3V8h-3ZM9 15v4h4v-4H9ZM16 15v4h3v-4h-3Z" /></svg>;
}

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_50%_20%,var(--bg-surface)_0%,var(--bg-soft)_100%)]">
        <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-72 rotate-[-18deg] rounded-[50%] bg-surface/70 shadow-[0_20px_50px_rgba(199,154,135,0.15)]" aria-hidden="true" />
        <svg className="pointer-events-none absolute bottom-0 right-0 h-44 w-48 text-primary opacity-[0.13]" viewBox="0 0 190 170" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><path d="M188 168C154 115 130 75 76 20" /><path d="M133 81c3-26 14-41 31-49 2 23-8 40-31 49ZM112 58C96 37 78 31 60 35c11 19 28 27 52 23ZM155 116c4-22 15-34 30-40 1 19-8 33-30 40Z" /><circle cx="90" cy="35" r="2" fill="currentColor" /><circle cx="164" cy="30" r="2" fill="currentColor" /></svg>
        <div className="relative mx-auto max-w-4xl px-4 py-10 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
            Moosiva Lux Wear
          </p>
          <h1 className="mt-3 font-display text-4xl text-rose-deep sm:text-5xl">About Moosiva</h1>
          <div className="mx-auto mt-2 h-px w-16 bg-primary/45" />
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-muted">
            A curated ladies&apos; fashion boutique for Bahrain, bringing elegant pieces for
            everyday wear, occasions, and modest styling — straight to your WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-[245px_1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-b-xl rounded-t-[4rem] shadow-[0_12px_28px_rgba(90,53,59,0.1)]">
            <Image src="/moosiva-about-boutique.png" alt="Curated modest dresses displayed in the Moosiva boutique style" fill sizes="245px" className="object-cover" />
          </div>
          <div>
        <h2 className="font-display text-3xl text-rose-deep">Our story</h2>
        <div className="mt-2 h-0.5 w-14 bg-primary" />
        <p className="mt-4 text-sm leading-6 text-ink-muted">
          Moosiva Lux Wear was created for women in Bahrain who want elegant, comfortable pieces
          without the hassle of crowded stores. We curate a small, considered collection —
          dresses, abayas, tops, and more — spanning everyday wear, special occasions, and modest
          styling.
        </p>
        <p className="mt-4 text-sm leading-6 text-ink-muted">
          Rather than a large impersonal storefront, Moosiva keeps ordering simple and personal:
          browse the collection online, then request your favorite pieces directly through
          WhatsApp, where our team helps confirm availability, sizing, and payment.
        </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface-soft">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl text-rose-deep">What we offer</h2>
          <div className="mx-auto mt-1 flex w-14 items-center gap-1 text-primary/50" aria-hidden="true"><span className="h-px flex-1 bg-current" /><span className="h-1.5 w-1.5 rotate-45 bg-current" /><span className="h-px flex-1 bg-current" /></div>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {OFFERINGS.map((item) => (
              <div key={item.title} className="flex min-h-32 items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-[0_8px_18px_rgba(90,53,59,0.07)]">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-soft text-primary"><OfferingIcon title={item.title} /></div>
                <div>
                  <p className="font-display text-base text-rose-deep">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-ink-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl text-rose-deep">How ordering works</h2>
        <div className="mx-auto mt-2 h-px w-12 bg-primary/60" />
        <div className="relative mt-5 grid gap-7 sm:grid-cols-4 sm:gap-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-4 hidden border-t border-dotted border-primary/35 sm:block" aria-hidden="true" />
          {ORDER_STEPS.map((item) => (
            <div key={item.step} className="relative z-10 text-center">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-[0_0_0_5px_var(--bg-base)]">
                {item.step}
              </div>
              <div className="mx-auto mt-2 flex justify-center text-primary"><AboutStepIcon title={item.title} /></div>
              <p className="mt-1 text-xs font-semibold text-ink">{item.title}</p>
              <p className="mx-auto mt-1 max-w-40 text-[10px] leading-4 text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-[radial-gradient(circle_at_50%_0%,var(--bg-surface)_0%,var(--bg-soft)_100%)]">
        <svg className="pointer-events-none absolute -bottom-12 -left-5 h-32 w-40 text-primary opacity-[0.06]" viewBox="0 0 150 120" fill="none" stroke="currentColor" aria-hidden="true"><path d="M0 110c35-35 65-57 120-78M42 80C28 58 12 52 0 55M68 61C63 37 72 21 88 9M93 45c11-18 26-23 42-19" /></svg>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-2 px-4 py-5 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl text-rose-deep">Ready to find your piece?</h2>
          <p className="max-w-md text-sm text-ink-muted">
            Browse the collection or message us directly — we&apos;re happy to help you choose.
          </p>
          <WhatsAppCta
            showIcon
            label="Chat on WhatsApp"
            message="Hi Moosiva, I'd like to know more about your collection."
            className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-medium text-white shadow-[0_8px_18px_rgba(155,95,104,0.2)] transition-colors hover:bg-primary-hover"
          />
        </div>
      </section>
    </main>
  );
}
