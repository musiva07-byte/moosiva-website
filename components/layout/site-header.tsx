import Image from "next/image";
import Link from "next/link";

import { MAIN_NAV } from "@/lib/constants/site";
import { MobileNav } from "./mobile-nav";
import { WhatsAppCta } from "./whatsapp-cta";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/moosiva-logo-mark.png"
            alt=""
            width={1032}
            height={634}
            priority
            className="h-12 w-auto object-contain"
          />
          <span className="font-display text-3xl tracking-wide text-rose-deep">
            Moosiva
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppCta
            label="WhatsApp"
            showIcon
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          />
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
