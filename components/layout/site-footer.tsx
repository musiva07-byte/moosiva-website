import Image from "next/image";
import Link from "next/link";

import { FOOTER_CARE_LINKS, FOOTER_SHOP_LINKS, SITE_NAME } from "@/lib/constants/site";
import { WhatsAppCta } from "./whatsapp-cta";

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-rose-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.35fr_0.75fr_1fr_1.25fr] lg:gap-12 lg:px-8 lg:py-16">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/moosiva-logo-mark.png" alt="" width={1032} height={634} className="h-14 w-auto object-contain brightness-0 invert" />
            <p className="font-display text-2xl leading-tight text-white">Moosiva Lux Wear</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">Elegant ladies&apos; wear curated for Bahrain.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <WhatsAppCta
              label="WhatsApp"
              showIcon
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            />
            {INSTAGRAM_URL ? (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Shop</p>
          <ul className="mt-5 space-y-3">
            {FOOTER_SHOP_LINKS.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link href={item.href} className="text-sm text-white/70 transition-colors hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Customer Care</p>
          <ul className="mt-5 space-y-3">
            {FOOTER_CARE_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white/70 transition-colors hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white px-6 py-7 text-ink shadow-[0_16px_38px_rgba(0,0,0,0.16)]">
          <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-accent" aria-hidden="true" />
          <p className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Personal support</p>
          <p className="relative mt-3 font-display text-xl leading-snug text-rose-deep">Need help choosing your piece?</p>
          <p className="relative mt-2 text-sm leading-6 text-ink-muted">Message us on WhatsApp.</p>
          <WhatsAppCta
            label="Chat on WhatsApp"
            showIcon
            className="relative mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-rose-deep px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(90,53,59,0.22)] transition-colors hover:bg-ink"
          />
        </div>
      </div>

      <div className="border-t border-white/10 bg-ink px-4 py-5 text-center text-xs text-white/60 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
