const TRUST_ITEMS = [
  { title: "Finest fabrics", body: "Selected pieces with care", icon: "fabric" },
  { title: "Trend-led styles", body: "Fresh arrivals updated regularly", icon: "new" },
  { title: "Bahrain delivery", body: "Delivery coordination across Bahrain", icon: "delivery" },
  { title: "Easy exchange support", body: "Boutique policy applies", icon: "exchange" },
  { title: "WhatsApp ordering", body: "Simple personal ordering support", icon: "whatsapp" },
] as const;

function TrustIcon({ icon }: { icon: (typeof TRUST_ITEMS)[number]["icon"] }) {
  const common = "h-6 w-6 shrink-0";
  if (icon === "new") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
      </svg>
    );
  }
  if (icon === "delivery") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h11v9H3zM14 10h3l3 3v2h-6z" />
        <circle cx="7.5" cy="17" r="1.6" /><circle cx="16.5" cy="17" r="1.6" />
      </svg>
    );
  }
  if (icon === "exchange") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h13l-3-3M20 17H7l3 3M17 4l3 3-3 3M7 20l-3-3 3-3" />
      </svg>
    );
  }
  if (icon === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3c0 1.4 1 2.5 2 2.5s2-1.1 2-2.5M7 3H5l-2 6 2 1v11h10V10l2-1-2-6h-2" />
    </svg>
  );
}

export function TrustStrip() {
  return (
    <section className="border-y border-primary/20 bg-soft" aria-labelledby="trust-strip-heading">
      <h2 id="trust-strip-heading" className="sr-only">Why shop with Moosiva</h2>
      <div className="mx-auto flex max-w-7xl snap-x gap-3 overflow-x-auto px-4 py-5 sm:px-6 lg:grid lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-primary/25 lg:overflow-visible lg:px-8 lg:py-6">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="flex w-[78%] shrink-0 snap-start items-center gap-3 rounded-xl bg-surface/70 px-4 py-3 sm:w-[44%] lg:w-auto lg:rounded-none lg:bg-transparent lg:px-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-surface text-rose-deep shadow-sm">
              <TrustIcon icon={item.icon} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.05em] text-rose-deep">{item.title}</p>
              <p className="mt-1 text-[11px] leading-4 text-ink-muted">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
