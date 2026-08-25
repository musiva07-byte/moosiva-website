import Image from "next/image";
import Link from "next/link";

import { WhatsAppCta } from "@/components/layout/whatsapp-cta";

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

type LookbookImage = {
  id: string;
  url: string;
};

type InstagramSectionProps = {
  /** Real product images only — never fabricated/stock photos. Renders nothing if empty. */
  lookbookImages?: LookbookImage[];
};

export function InstagramSection({ lookbookImages = [] }: InstagramSectionProps) {
  const visibleImages = lookbookImages.slice(0, 7);
  const centerImageIndex = Math.floor(visibleImages.length / 2);

  return (
    <section className="bg-[linear-gradient(105deg,var(--bg-surface-soft),var(--bg-base))]" aria-labelledby="instagram-heading">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-soft text-primary ring-1 ring-border/60">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <h2 id="instagram-heading" className="font-display text-3xl tracking-wide text-rose-deep">
            #MOOSIVA STYLE
          </h2>
          <p className="max-w-md text-sm leading-6 text-ink-muted">
            Follow Moosiva for new arrivals, styling ideas, and latest pieces.
          </p>
        </div>

        {lookbookImages.length > 0 ? (
          <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0">
            {visibleImages.map((image, index) => (
              <div key={image.id} className="group relative aspect-4/5 w-[68%] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-soft shadow-[0_10px_24px_rgba(90,53,59,0.08)] sm:w-0 sm:min-w-0 sm:flex-1">
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 230px, (min-width: 640px) 20vw, 68vw"
                  className="object-cover object-top transition-transform duration-500 hover:scale-[1.04]"
                />
                {index === centerImageIndex ? (
                  <Link href="/shop" className="absolute inset-x-3 bottom-3 flex min-h-10 items-center justify-center rounded-lg bg-rose-deep/90 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-ink">
                    Shop the look
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center">
          {INSTAGRAM_URL ? (
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/70 px-6 text-sm font-semibold text-rose-deep transition-[background-color,border-color,color,transform] hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Follow on Instagram
            </a>
          ) : (
            <WhatsAppCta
              showIcon
              label="Chat on WhatsApp"
              message="Hi Moosiva, I'd like to know more about your collection."
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(155,95,104,0.18)] transition-colors hover:bg-primary-hover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
