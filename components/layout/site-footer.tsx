import Image from "next/image";
import Link from "next/link";

import { MAIN_NAV, POLICY_LINKS, SITE_NAME } from "@/lib/constants/site";
import { WhatsAppCta } from "./whatsapp-cta";

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-soft">
      <div className="mx-auto grid max-w-5xl gap-7 px-4 py-6 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/moosiva-logo-mark.png" alt="" width={1032} height={634} className="h-10 w-auto object-contain" />
            <p className="font-display text-xl text-rose-deep">Moosiva Lux Wear</p>
          </div>
          <p className="mt-2 max-w-xs text-xs text-ink-muted">
            Premium ladies&apos; wear, curated for Bahrain.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <WhatsAppCta
              label="WhatsApp"
              showIcon
              className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary"
            />
            {INSTAGRAM_URL ? (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary"
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
          <p className="text-sm font-semibold text-ink">Explore</p>
          <ul className="mt-3 space-y-1.5">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-xs text-ink-muted hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Policies</p>
          <ul className="mt-3 space-y-1.5">
            {POLICY_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-xs text-ink-muted hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-3 text-center text-[10px] text-ink-muted sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
