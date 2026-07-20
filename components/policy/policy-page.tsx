import { WhatsAppCta } from "@/components/layout/whatsapp-cta";

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  points: string[];
};

/** Shared shell for the three simple policy pages (delivery/returns/privacy). */
export function PolicyPage({ eyebrow, title, intro, points }: PolicyPageProps) {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_50%_20%,var(--bg-surface)_0%,var(--bg-soft)_90%)]">
        <svg className="pointer-events-none absolute -bottom-10 right-0 h-40 w-52 text-primary opacity-[0.09]" viewBox="0 0 210 150" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M210 130C168 94 134 72 75 48" /><path d="M143 83c3-32 18-49 38-57 2 27-10 48-38 57ZM119 69c-17-24-38-31-59-27 12 22 32 32 59 27ZM173 105c5-25 18-38 35-44 0 22-10 37-35 44Z" /></svg>
        <div className="relative mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-rose-deep sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ink-muted">{intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <ul className="space-y-3.5">
          {points.map((point, index) => (
            <li
              key={point}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 text-sm leading-6 text-ink-muted shadow-[0_8px_20px_rgba(90,53,59,0.05)]"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-soft text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-soft/60 px-6 py-8 text-center">
          <p className="text-sm font-medium text-ink">Questions? Chat with us on WhatsApp.</p>
          <WhatsAppCta
            label="Chat on WhatsApp"
            showIcon
            message="Hi Moosiva, I have a question about your policies."
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(155,95,104,0.18)] transition-colors hover:bg-primary-hover"
          />
        </div>
      </section>
    </main>
  );
}
