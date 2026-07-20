import { WhatsAppCta } from "@/components/layout/whatsapp-cta";

type ProductEmptyStateProps = {
  /** "error" is used when the underlying query failed — never render the raw error, just this. */
  variant?: "empty" | "error";
};

const COPY = {
  empty: {
    title: "No products available right now.",
    subtitle:
      "Our latest collection is being prepared. Message us on WhatsApp to check current availability.",
    message: "Hi Moosiva, do you have any new arrivals available?",
  },
  error: {
    title: "Unable to load products.",
    subtitle: "Please try again or contact Moosiva on WhatsApp.",
    message: "Hi Moosiva, I'm having trouble loading products on the website.",
  },
} as const;

export function ProductEmptyState({ variant = "empty" }: ProductEmptyStateProps) {
  const copy = COPY[variant];

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <p className="text-base font-medium text-ink">{copy.title}</p>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">{copy.subtitle}</p>
      <WhatsAppCta
        label="Chat on WhatsApp"
        message={copy.message}
        className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      />
    </div>
  );
}
