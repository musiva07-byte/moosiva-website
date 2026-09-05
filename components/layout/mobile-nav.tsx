"use client";

import Link from "next/link";
import { useState } from "react";

import { MAIN_NAV } from "@/lib/constants/site";
import { WhatsAppCta } from "./whatsapp-cta";

/**
 * Extracted so it can be rendered directly in tests with `open` passed
 * explicitly, instead of needing to simulate a click on internal state
 * (this project intentionally has no jsdom/RTL — see products.test.ts
 * conventions — so tests use react-dom/server's renderToStaticMarkup).
 */
export function MobileNavPanel({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <div id="mobile-nav-panel" className="absolute inset-x-0 top-full z-40 border-b border-white/10 bg-ink px-4 py-6 shadow-xl sm:px-6">
      <nav className="flex flex-col divide-y divide-white/10">
        {MAIN_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className="py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <WhatsAppCta
        showIcon
        label="Chat on WhatsApp"
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      />
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
      >
        <span className="sr-only">Toggle menu</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open ? <MobileNavPanel onLinkClick={() => setOpen(false)} /> : null}
    </div>
  );
}
