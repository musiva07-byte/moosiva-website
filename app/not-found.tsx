import Link from "next/link";

import { WhatsAppCta } from "@/components/layout/whatsapp-cta";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_35%,var(--bg-surface)_0%,var(--bg-soft)_85%)] px-4 py-24">
      <svg className="pointer-events-none absolute -left-10 -top-8 h-56 w-44 text-primary opacity-[0.08]" viewBox="0 0 130 190" fill="none" aria-hidden="true">
        <path d="M20-8c19 35 30 78 29 132" stroke="currentColor" strokeWidth="2" />
        {[[35, 23, -20], [48, 40, 18], [42, 59, -25]].map(([x, y, r]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="10" ry="23" fill="currentColor" transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </svg>

      <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-sm">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.3-4.3" /><path d="M8.5 11h5" /></svg>
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-2 font-display text-3xl text-rose-deep sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-ink-muted">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(155,95,104,0.2)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            Back to shop
          </Link>
          <WhatsAppCta
            showIcon
            label="Chat on WhatsApp"
            message="Hi Moosiva, I ended up on a broken link on your website."
            className="inline-flex items-center gap-2 rounded-full border border-border-input px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
          />
        </div>
      </div>
    </main>
  );
}
