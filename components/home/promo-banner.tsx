import Image from "next/image";
import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="bg-page px-4 py-10 sm:px-6 lg:px-8 lg:py-12" aria-labelledby="promo-banner-heading">
      <div className="relative mx-auto h-[23rem] max-w-7xl overflow-hidden rounded-2xl bg-rose-deep shadow-[0_18px_45px_rgba(46,35,37,0.18)] sm:h-[25rem]">
        <Image
          src="/moosiva-about-boutique.png"
          alt="Curated Moosiva pieces displayed in a warm boutique setting"
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--text-primary)_0%,var(--text-rose-deep)_42%,rgba(90,53,59,0.68)_60%,rgba(90,53,59,0.08)_100%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-primary/15" aria-hidden="true" />

        <div className="relative flex h-full items-center px-6 sm:px-10 lg:px-14">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-accent">New Season Collection</p>
            <h2 id="promo-banner-heading" className="mt-3 max-w-lg font-display text-4xl leading-[1.02] text-white sm:text-5xl">
              Ethnic elegance for every occasion
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
              Explore modest, ethnic, and occasion wear. Request your favorite piece on WhatsApp.
            </p>
            <Link
              href="/shop?sort=new_arrival"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-white px-6 text-xs font-bold uppercase tracking-[0.08em] text-rose-deep shadow-lg transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Shop New Arrivals
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
