import Image from "next/image";
import Link from "next/link";

import { AnnouncementBar } from "./announcement-bar";
import { MAIN_NAV } from "@/lib/constants/site";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { WhatsAppCta } from "./whatsapp-cta";

export function SiteHeader() {
  return (
    <>
      <AnnouncementBar />
      <header data-testid="site-header" data-tone="dark-fashion" className="sticky top-0 z-50 border-b border-white/10 bg-ink text-white shadow-[0_8px_24px_rgba(46,35,37,0.18)]">
        <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/moosiva-logo-mark.png"
              alt=""
              width={1032}
              height={634}
              priority
              className="h-11 w-auto object-contain brightness-0 invert"
            />
            <span className="font-display text-2xl tracking-wide text-white sm:text-3xl">
              Moosiva
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="text-[11px] font-semibold uppercase tracking-[0.13em] text-white/80 transition-colors hover:text-white"
                activeClassName="text-white"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <WhatsAppCta
              label="WhatsApp"
              showIcon
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-primary px-5 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_12px_22px_rgba(0,0,0,0.22)]"
            />
          </div>

          <MobileNav />
        </div>
      </header>
    </>
  );
}
