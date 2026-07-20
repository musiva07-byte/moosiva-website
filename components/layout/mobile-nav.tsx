"use client";

import Link from "next/link";
import { useState } from "react";

import { MAIN_NAV } from "@/lib/constants/site";
import { WhatsAppCta } from "./whatsapp-cta";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink"
      >
        <span className="sr-only">Toggle menu</span>
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>

      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full z-40 border-b border-border bg-surface px-4 py-4 shadow-sm sm:px-6"
        >
          <nav className="flex flex-col gap-4">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <WhatsAppCta
            label="Chat on WhatsApp"
            className="mt-4 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          />
        </div>
      ) : null}
    </div>
  );
}
