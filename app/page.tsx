import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
import { getPublishedCategories, getPublishedProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  description:
    "Moosiva Lux Wear is a curated ladies' fashion boutique for Bahrain. Browse the collection and request your favorites on WhatsApp.",
};

const HOW_TO_ORDER = [
  { step: "1", icon: "browse", title: "Browse products", body: "Explore our latest collection and find your favorites." },
  { step: "2", icon: "choose", title: "Choose your selection", body: "Pick the option that fits your taste and size." },
  { step: "3", icon: "request", title: "Share your request", body: "Share your details and delivery address." },
  { step: "4", icon: "confirm", title: "Confirm on WhatsApp", body: "We will confirm details and payment with you." },
];

const WHY_MOOSIVA = [
  { title: "Curated styles", body: "A considered collection, not an endless catalog." },
  { title: "Easy WhatsApp ordering", body: "No accounts, no checkout friction — just message us." },
  { title: "Bahrain delivery coordination", body: "Our team confirms delivery details with you directly." },
];

const HERO_BENEFITS = [
  { icon: "dress", title: "Curated styles", body: "Handpicked pieces for every occasion and everyday elegance." },
  { icon: "whatsapp", title: "WhatsApp ordering", body: "Easy and personal ordering directly on WhatsApp." },
  { icon: "delivery", title: "Bahrain delivery", body: "We coordinate delivery across Bahrain with care." },
];

function BenefitIcon({ icon }: { icon: string }) {
  if (icon === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z" />
        <path d="M8.5 8.2c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.5.9 1.2 1.7 2.1 2.2.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .4-.2 1.2-.7 1.6-.5.5-1.3.8-2.1.6-1-.2-2.3-.7-3.9-2.1-1.3-1.2-2.2-2.7-2.5-3.7-.3-1 0-1.8.3-2.2Z" />
      </svg>
    );
  }
  if (icon === "delivery") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h11v10H3zM14 10h3l3 3v3h-6z" />
        <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
        <path d="M1 9h4M1 12h3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3c0 1.8 1.2 3 3 3s3-1.2 3-3l2 1 1.5 5-2.5 1 1 10H7l1-10-2.5-1L7 4l2-1Z" />
    </svg>
  );
}

function OrderStepIcon({ icon }: { icon: string }) {
  const common = "h-8 w-8";
  if (icon === "choose") {
    return <svg viewBox="0 0 32 32" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M9 11h14l1.5 16h-17L9 11Z" /><path d="M12 12V9a4 4 0 0 1 8 0v3" /></svg>;
  }
  if (icon === "request") {
    return <svg viewBox="0 0 32 32" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="8" y="6" width="16" height="22" rx="1.5" /><path d="M12 4h8v5h-8zM12 14l1.5 1.5L16 13M18 15h3M12 21l1.5 1.5L16 20M18 22h3" /></svg>;
  }
  if (icon === "confirm") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z" />
        <path d="M8.5 8.2c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.5.9 1.2 1.7 2.1 2.2.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .4-.2 1.2-.7 1.6-.5.5-1.3.8-2.1.6-1-.2-2.3-.7-3.9-2.1-1.3-1.2-2.2-2.7-2.5-3.7-.3-1 0-1.8.3-2.2Z" />
      </svg>
    );
  }
  return <svg viewBox="0 0 32 32" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="14" cy="14" r="8" /><path d="m20 20 7 7M9 13c2-3 5-4 8-2" /></svg>;
}

function WhyCardIcon({ title }: { title: string }) {
  if (title.includes("WhatsApp")) {
    return <BenefitIcon icon="whatsapp" />;
  }
  if (title.includes("delivery")) {
    return <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m7 11 9-5 9 5v11l-9 5-9-5V11Z" /><path d="m7 11 9 5 9-5M16 16v11M11.5 8.5l9 5" /></svg>;
  }
  return <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M14 8a3 3 0 1 1 3 3c0 2-1 2.5-2 3l-10 7h22l-10-7" /></svg>;
}

function CategoryIcon({ name }: { name: string }) {
  const normalized = name.toLowerCase();
  if (normalized.includes("abaya")) {
    return <svg viewBox="0 0 38 38" aria-hidden="true" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M14 7h10l5 8-4 3 2 14H11l2-14-4-3 5-8Z" /><path d="M16 7v25M22 7v25" /></svg>;
  }
  if (normalized.includes("dress")) {
    return <svg viewBox="0 0 38 38" aria-hidden="true" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M15 6c0 3 8 3 8 0M15 6l-3 9 3 3-5 14h18l-5-14 3-3-3-9" /></svg>;
  }
  if (normalized.includes("access")) {
    return <svg viewBox="0 0 38 38" aria-hidden="true" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="7" y="15" width="24" height="17" rx="3" /><path d="M13 15v-3a6 6 0 0 1 12 0v3M7 21h24M17 21v4h4v-4" /></svg>;
  }
  return <svg viewBox="0 0 38 38" aria-hidden="true" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M17 8a3.5 3.5 0 1 1 3.5 3.5c0 2-1 2.5-2 3L6 24h26l-12.5-9.5" /></svg>;
}

export default async function HomePage() {
  const [newArrivals, categories] = await Promise.all([
    getPublishedProducts({ sort: "new_arrival", pageSize: 4 }),
    getPublishedCategories(),
  ]);

  return (
    <main className="flex-1">
      <section className="overflow-hidden border-b border-border bg-surface" aria-labelledby="hero-heading">
        <div className="grid min-h-[34rem] lg:h-[33.75rem] lg:grid-cols-2">
          <div className="relative flex items-center bg-[radial-gradient(circle_at_20%_45%,var(--bg-surface)_0%,var(--bg-base)_58%,var(--bg-soft)_130%)] px-6 py-16 sm:px-12 lg:py-16 lg:pl-[clamp(6rem,15vw,15rem)] lg:pr-10">
            <svg className="pointer-events-none absolute -left-10 top-0 h-56 w-40 text-primary opacity-[0.08]" viewBox="0 0 130 190" fill="none" aria-hidden="true">
              <path d="M20-8c19 35 30 78 29 132" stroke="currentColor" strokeWidth="2" />
              {[[35, 23, -20], [48, 40, 18], [42, 59, -25], [52, 78, 20], [45, 99, -19]].map(([x, y, r]) => (
                <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="10" ry="23" fill="currentColor" transform={`rotate(${r} ${x} ${y})`} />
              ))}
            </svg>
            <div className="relative z-10 mx-auto w-full max-w-[500px] lg:mx-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">Moosiva Lux Wear</p>
              <div className="mt-3 h-px w-20 bg-accent" />
              <h1 id="hero-heading" className="mt-5 max-w-[500px] font-display text-[2.7rem] leading-[1.08] tracking-[-0.025em] text-rose-deep sm:text-5xl lg:text-[3.25rem]">
                Curated ladies&#8217; wear for Bahrain
              </h1>
              <div className="mt-6 flex w-64 items-center gap-2 text-primary/55" aria-hidden="true">
                <span className="h-px flex-1 bg-current" />
                <svg viewBox="0 0 60 18" className="h-5 w-16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M1 9h58M22 9c6-1 9-4 11-8-6 1-10 3-11 8Zm0 0c6 1 9 4 11 8-6-1-10-3-11-8Zm17 0c4-1 7-3 9-6-5 0-8 2-9 6Zm0 0c4 1 7 3 9 6-5 0-8-2-9-6Z" />
                </svg>
                <span className="h-px flex-1 bg-current" />
              </div>
              <p className="mt-5 max-w-[440px] text-[0.98rem] leading-7 text-ink-muted">
                Elegant pieces for everyday style, occasions, and modest dressing. Browse online,
                choose your favorite item, and send your request directly on WhatsApp.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/shop" className="inline-flex min-h-12 items-center justify-center gap-4 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(155,95,104,0.18)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_14px_30px_rgba(155,95,104,0.22)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Shop the Collection
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" /></svg>
                </Link>
                <WhatsAppCta showIcon label="Order on WhatsApp" message="Hi Moosiva, I'd like to know more about your collection." className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-primary/70 bg-surface/30 px-6 text-sm font-semibold text-rose-deep transition-[background-color,border-color,color,transform] hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] min-h-[28rem] overflow-hidden bg-soft sm:aspect-[16/11] lg:aspect-auto lg:min-h-full">
            <Image src="/moosiva-hero-portrait.png" alt="Woman wearing a dusty mauve embroidered abaya in a warm boutique" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-center lg:hidden" />
            <Image src="/moosiva-hero-editorial.png" alt="Woman in blush modest fashion in a warm, softly lit boutique interior" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="hidden object-cover object-[100%_center] lg:block" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(90,53,59,0.04),transparent_18%)]" aria-hidden="true" />
          </div>
        </div>
        <div className="border-t border-border/70 bg-surface px-6 py-10 sm:px-10 lg:px-16" aria-labelledby="hero-benefits-heading">
          <h2 id="hero-benefits-heading" className="sr-only">Boutique benefits</h2>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3 md:gap-0">
            {HERO_BENEFITS.map((item, index) => (
              <div key={item.title} className={`flex items-center gap-4 py-1 md:px-8 ${index > 0 ? "md:border-l md:border-border" : ""}`}>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-soft text-rose-deep ring-1 ring-border/60"><BenefitIcon icon={item.icon} /></div>
                <div><p className="font-display text-lg text-rose-deep">{item.title}</p><p className="mt-1 text-sm leading-5 text-ink-muted">{item.body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="relative overflow-hidden border-b border-border bg-surface px-4 py-8 sm:px-6">
        <svg className="pointer-events-none absolute -left-5 top-0 h-24 w-20 text-primary opacity-[0.06]" viewBox="0 0 80 100" fill="currentColor" aria-hidden="true"><path d="M7-5c17 23 23 52 22 91h2C33 49 27 18 10-6Z" /><ellipse cx="20" cy="24" rx="8" ry="18" transform="rotate(-28 20 24)" /><ellipse cx="33" cy="42" rx="8" ry="18" transform="rotate(24 33 42)" /><ellipse cx="25" cy="61" rx="8" ry="18" transform="rotate(-25 25 61)" /></svg>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl text-rose-deep">How to Order</h2>
          <div className="mx-auto mt-1 flex w-16 items-center gap-2 text-primary/45" aria-hidden="true">
            <span className="h-px flex-1 bg-current" />
            <svg viewBox="0 0 18 10" className="h-2 w-4" fill="none" stroke="currentColor"><path d="M1 5h16M8 5c3-1 4-2 5-4-3 0-5 1-5 4Z" /></svg>
          </div>
          <div className="relative mt-4 grid gap-7 sm:grid-cols-4 sm:gap-4">
            <div className="absolute left-[12.5%] right-[12.5%] top-5 hidden border-t border-dotted border-primary/35 sm:block" aria-hidden="true" />
            {HOW_TO_ORDER.map((item) => (
              <div key={item.step} className="relative z-10 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-[0_0_0_6px_var(--bg-surface)]">{item.step}</div>
                <div className="mx-auto mt-2 flex justify-center text-primary"><OrderStepIcon icon={item.icon} /></div>
                <p className="mt-1 text-xs font-semibold text-ink">{item.title}</p>
                <p className="mx-auto mt-1 max-w-40 text-[11px] leading-4 text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-page px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-rose-deep">New Arrivals</h2>
          {newArrivals.items.length > 0 ? (
            <Link href="/shop" className="inline-flex items-center gap-3 text-xs font-medium text-primary hover:text-primary-hover">
              View all <span aria-hidden="true">-&gt;</span>
            </Link>
          ) : null}
        </div>

        {newArrivals.items.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <p className="text-base font-medium text-ink">New arrivals are being prepared.</p>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              Check back soon, or message us on WhatsApp to ask what&apos;s coming next.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <ProductGrid products={newArrivals.items} variant="horizontal" />
          </div>
        )}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border bg-[radial-gradient(circle_at_50%_20%,var(--bg-surface)_0%,var(--bg-surface-soft)_75%)]">
        <svg className="pointer-events-none absolute -right-10 -top-8 h-52 w-52 text-champagne opacity-[0.08]" viewBox="0 0 180 180" fill="currentColor" aria-hidden="true"><path d="M175 0C135 28 104 68 84 124l3 1C108 71 139 32 178 4Z" /><ellipse cx="136" cy="37" rx="12" ry="30" transform="rotate(42 136 37)" /><ellipse cx="112" cy="69" rx="12" ry="30" transform="rotate(35 112 69)" /><ellipse cx="92" cy="104" rx="12" ry="30" transform="rotate(25 92 104)" /></svg>
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-36 items-center gap-2 text-primary/55" aria-hidden="true"><span className="h-px flex-1 bg-current" /><span className="h-2 w-2 rotate-45 border border-current" /><span className="h-px flex-1 bg-current" /></div>
          <h2 className="mt-3 text-center font-display text-4xl text-rose-deep">Why shop with Moosiva</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {WHY_MOOSIVA.map((item) => (
              <div key={item.title} className="flex min-h-60 flex-col items-center rounded-xl border border-border bg-surface/90 px-6 py-6 text-center shadow-[0_12px_28px_rgba(90,53,59,0.08)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-soft text-primary"><WhyCardIcon title={item.title} /></div>
                <p className="mt-4 font-display text-xl text-rose-deep">{item.title}</p>
                <div className="mt-3 flex w-20 items-center text-primary/55" aria-hidden="true"><span className="h-px flex-1 bg-current" /><span className="h-1.5 w-1.5 rotate-45 bg-current" /><span className="h-px flex-1 bg-current" /></div>
                <p className="mt-3 max-w-56 text-sm leading-6 text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(105deg,var(--bg-surface-soft),var(--bg-base))]">
        <svg className="pointer-events-none absolute -bottom-10 -left-8 h-52 w-40 text-champagne opacity-[0.1]" viewBox="0 0 150 190" fill="currentColor" aria-hidden="true"><path d="M20 195c18-57 42-105 86-149l-3-2C58 87 32 137 16 193Z" /><ellipse cx="43" cy="142" rx="12" ry="30" transform="rotate(-35 43 142)" /><ellipse cx="61" cy="108" rx="12" ry="30" transform="rotate(-42 61 108)" /><ellipse cx="84" cy="76" rx="12" ry="30" transform="rotate(-48 84 76)" /></svg>
        <div className="relative mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[180px_1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-ink">Shop by</p>
            <h2 className="mt-1 font-display text-4xl leading-none text-rose-deep">Category</h2>
            <div className="mt-5 h-0.5 w-12 bg-primary" />
          </div>
          <div>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <p className="text-base font-medium text-ink">Categories coming soon</p>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              Our categories will appear here once published from Moosiva&apos;s catalog.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group flex min-h-44 flex-col items-center justify-center rounded-xl border border-border bg-surface/90 p-5 text-center shadow-[0_10px_22px_rgba(90,53,59,0.08)] transition-all hover:-translate-y-1 hover:border-primary"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-soft text-primary"><CategoryIcon name={category.name} /></div>
                <p className="mt-3 text-base font-medium text-ink">{category.name}</p>
                {category.description ? (
                  <p className="mt-1 line-clamp-1 text-xs text-ink-muted">{category.description}</p>
                ) : null}
                <span className="mt-3 text-lg text-primary transition-transform group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
              </Link>
            ))}
          </div>
        )}
          </div>
        </div>
      </section>
    </main>
  );
}
