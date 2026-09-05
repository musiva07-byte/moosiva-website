import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
import { InstagramSection } from "@/components/home/instagram-section";
import { PromoBanner } from "@/components/home/promo-banner";
import { TrustStrip } from "@/components/home/trust-strip";
import { getPublishedCategoriesWithImages, getPublishedProducts } from "@/lib/services/products";
import type { PublicCategoryShowcase } from "@/types/public-product";

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

function CategoryPlaceholderIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M9 3c0 1.8 1.2 3 3 3s3-1.2 3-3l2 1 1.5 5-2.5 1 1 10H7l1-10-2.5-1L7 4l2-1Z" />
    </svg>
  );
}

function CategoryTile({ category, className = "" }: { category: PublicCategoryShowcase; className?: string }) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-primary/10 bg-surface-soft shadow-[0_10px_28px_rgba(90,53,59,0.07)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-[0_20px_42px_rgba(90,53,59,0.15)] ${className}`}
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-soft">
        {category.image ? (
          <Image
            src={category.image.url}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 62vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted">
            <CategoryPlaceholderIcon />
            <span className="text-[11px]">Image coming soon</span>
          </div>
        )}
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-primary/15 bg-surface/90 text-primary shadow-md backdrop-blur-sm" aria-hidden="true">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M5 7h10l1 10H4L5 7Z" /><path d="M7 8V6a3 3 0 0 1 6 0v2" />
          </svg>
        </span>
      </div>
      <div className="px-3 py-3 text-center">
        <p className="font-display text-xl font-medium leading-tight text-rose-deep">{category.name}</p>
        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-primary transition-transform group-hover:translate-x-1">
          Explore now <span aria-hidden="true">-&gt;</span>
        </span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [newArrivals, categories, lookbookProducts] = await Promise.all([
    getPublishedProducts({ sort: "new_arrival", pageSize: 4 }),
    getPublishedCategoriesWithImages(),
    getPublishedProducts({ pageSize: 7 }),
  ]);

  const homepageCategories = categories.slice(0, 6);
  const homepageNewArrivals = newArrivals.items.slice(0, 4);
  const lookbookImages = lookbookProducts.items
    .map((item) => item.image)
    .filter((image): image is NonNullable<typeof image> => image !== null);

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-border bg-surface" aria-labelledby="hero-heading">
        <div className="grid w-full grid-cols-1 lg:min-h-[40rem] lg:grid-cols-[42%_58%]">
          <div className="relative flex min-w-0 items-center border-y-[5px] border-double border-champagne/70 bg-[linear-gradient(135deg,var(--bg-base)_0%,var(--bg-surface-soft)_58%,var(--bg-soft)_100%)] px-6 py-12 sm:px-12 sm:py-16 lg:py-14 lg:pl-[clamp(3.5rem,7vw,7rem)] lg:pr-7">
            <svg className="pointer-events-none absolute -left-8 -top-2 h-64 w-44 text-primary opacity-[0.07]" viewBox="0 0 130 190" fill="none" aria-hidden="true">
              <path d="M20-8c19 35 30 78 29 132" stroke="currentColor" strokeWidth="2" />
              {[[35, 23, -20], [48, 40, 18], [42, 59, -25], [52, 78, 20], [45, 99, -19]].map(([x, y, r]) => (
                <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="10" ry="23" fill="currentColor" transform={`rotate(${r} ${x} ${y})`} />
              ))}
            </svg>
            <div className="relative z-10 mx-auto min-w-0 w-full max-w-[540px] lg:mx-0">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-primary" aria-hidden="true" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs">ETHNIC • MODEST • OCCASION WEAR</p>
              </div>
              <h1 id="hero-heading" className="mt-5 max-w-[540px] text-balance font-display text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.98] tracking-[-0.025em] text-rose-deep lg:text-[clamp(3.25rem,4.7vw,4.75rem)]">
                Ethnic elegance, curated for Bahrain
              </h1>
              <p className="mt-7 max-w-[470px] border-l border-champagne pl-5 text-[1rem] leading-7 text-ink-muted sm:text-[1.05rem]">
                Discover elegant ethnic, modest, and occasion wear selected for women in Bahrain.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link href="/shop?sort=new_arrival" className="inline-flex min-h-12 items-center justify-center gap-4 rounded-lg bg-rose-deep px-7 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(90,53,59,0.22)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_14px_30px_rgba(46,35,37,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep">
                  Shop New Arrivals
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" /></svg>
                </Link>
                <Link href="/shop" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-rose-deep bg-surface/45 px-7 text-sm font-semibold text-rose-deep transition-[background-color,border-color,color,transform] hover:-translate-y-0.5 hover:bg-rose-deep hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep">
                  Explore Collection
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-muted" aria-hidden="true">
                <span className="h-px flex-1 bg-champagne" />
                <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-rose-gold" />
                <span className="h-px flex-1 bg-champagne" />
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full min-w-0 overflow-hidden bg-soft sm:aspect-[16/11] lg:aspect-auto lg:min-h-full">
            <Image src="/moosiva-hero-ethnic-editorial.png" alt="Woman in ivory embroidered occasion wear with a fine gold-bordered drape in a warm, naturally lit interior" fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-[65%_center]" />
            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,var(--bg-soft)_0%,transparent_18%)] opacity-80 lg:block" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-rose-deep/20 to-transparent" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="categories" className="relative overflow-hidden border-b border-border bg-[linear-gradient(105deg,var(--bg-surface-soft),var(--bg-base))] scroll-mt-24">
        <svg className="pointer-events-none absolute -bottom-10 -left-8 h-52 w-40 text-champagne opacity-[0.1]" viewBox="0 0 150 190" fill="currentColor" aria-hidden="true"><path d="M20 195c18-57 42-105 86-149l-3-2C58 87 32 137 16 193Z" /><ellipse cx="43" cy="142" rx="12" ry="30" transform="rotate(-35 43 142)" /><ellipse cx="61" cy="108" rx="12" ry="30" transform="rotate(-42 61 108)" /><ellipse cx="84" cy="76" rx="12" ry="30" transform="rotate(-48 84 76)" /></svg>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Ethnic elegance for every occasion</p>
              <h2 className="mt-1 font-display text-3xl leading-none text-rose-deep sm:text-4xl">Shop by Category</h2>
            </div>
            {homepageCategories.length > 0 ? (
              <Link href="/shop" className="hidden items-center gap-2 text-xs font-medium text-primary hover:text-primary-hover sm:inline-flex">
                View all <span aria-hidden="true">-&gt;</span>
              </Link>
            ) : null}
          </div>

          {homepageCategories.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center">
              <p className="text-base font-medium text-ink">Categories are being prepared.</p>
              <p className="mt-2 max-w-sm text-sm text-ink-muted">
                Our categories will appear here once published from Moosiva&apos;s catalog.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile: horizontal snap-scroll carousel */}
              <div className="mt-7 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:hidden">
                {homepageCategories.map((category) => (
                  <CategoryTile key={category.slug} category={category} className="w-[62%] shrink-0 snap-start" />
                ))}
              </div>
              {/* Tablet: balanced 3 x 2. Wide desktop: one complete six-card row. */}
              <div data-testid="homepage-category-grid" className="mt-8 hidden gap-5 sm:grid sm:grid-cols-3 lg:grid-cols-6">
                {homepageCategories.map((category) => (
                  <CategoryTile key={category.slug} category={category} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="border-b border-border bg-page px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-rose-deep sm:text-4xl">New Arrivals</h2>
            {homepageNewArrivals.length > 0 ? (
              <Link href="/shop?sort=new_arrival" className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary-hover">
                View all <span aria-hidden="true">-&gt;</span>
              </Link>
            ) : null}
          </div>

          {homepageNewArrivals.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
              <p className="text-base font-medium text-ink">New arrivals are being prepared.</p>
              <p className="mt-2 max-w-sm text-sm text-ink-muted">
                Check back soon, or message us on WhatsApp to ask what&apos;s coming next.
              </p>
            </div>
          ) : (
            <div data-testid="homepage-new-arrivals" className="mt-8">
              <ProductGrid products={homepageNewArrivals} layout="homepage" />
            </div>
          )}
        </div>
      </section>

      <TrustStrip />

      <PromoBanner />

      <InstagramSection lookbookImages={lookbookImages} />

      <section className="relative overflow-hidden border-b border-border bg-surface px-4 py-12 sm:px-6 lg:py-14">
        <svg className="pointer-events-none absolute -left-5 top-0 h-32 w-24 text-primary opacity-[0.06]" viewBox="0 0 80 100" fill="currentColor" aria-hidden="true"><path d="M7-5c17 23 23 52 22 91h2C33 49 27 18 10-6Z" /><ellipse cx="20" cy="24" rx="8" ry="18" transform="rotate(-28 20 24)" /><ellipse cx="33" cy="42" rx="8" ry="18" transform="rotate(24 33 42)" /><ellipse cx="25" cy="61" rx="8" ry="18" transform="rotate(-25 25 61)" /></svg>
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Personal ordering, made simple</p>
          <h2 className="mt-2 text-center font-display text-3xl text-rose-deep sm:text-4xl">How to Order</h2>
          <div className="mx-auto mt-1 flex w-16 items-center gap-2 text-primary/45" aria-hidden="true">
            <span className="h-px flex-1 bg-current" />
            <svg viewBox="0 0 18 10" className="h-2 w-4" fill="none" stroke="currentColor"><path d="M1 5h16M8 5c3-1 4-2 5-4-3 0-5 1-5 4Z" /></svg>
          </div>
          <div className="relative mt-8 grid gap-4 sm:grid-cols-4 sm:gap-0">
            <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t border-dashed border-primary/35 sm:block" aria-hidden="true" />
            {HOW_TO_ORDER.map((item) => (
              <div key={item.step} className="relative z-10 rounded-2xl border border-border bg-surface-soft px-4 py-6 text-center sm:border-0 sm:bg-transparent sm:px-3 sm:py-0">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-surface text-primary shadow-[0_0_0_7px_var(--bg-surface)]">
                  <OrderStepIcon icon={item.icon} />
                </div>
                <span className="mx-auto -mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">{item.step}</span>
                <p className="mt-4 text-sm font-semibold text-ink">{item.title}</p>
                <p className="mx-auto mt-2 max-w-44 text-xs leading-5 text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <WhatsAppCta
              showIcon
              label="Order on WhatsApp"
              message="Hi Moosiva, I'd like to know more about your collection."
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(155,95,104,0.2)] transition-colors hover:bg-primary-hover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
