import { PAYMENT_PREFERENCES, type PaymentPreference } from "@/lib/constants/bahrain";

type PaymentPreferenceSelectorProps = {
  value: PaymentPreference | "";
  onChange: (value: PaymentPreference) => void;
};

function PaymentIcon({ value }: { value: PaymentPreference }) {
  if (value === "cash_on_delivery") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="6" width="19" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }
  if (value === "benefitpay") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path d="M2.5 9.5h19" />
        <path d="M6 14h4" />
      </svg>
    );
  }
  if (value === "bank_transfer") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10 12 4l9 6" />
        <path d="M4.5 10v9M9 10v9M15 10v9M19.5 10v9" />
        <path d="M2.5 19h19" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 14.5 15 9" />
      <path d="M11 6.5 12.5 5a3 3 0 0 1 4.5 4l-1.5 1.5" />
      <path d="M13 17.5 11.5 19a3 3 0 0 1-4.5-4l1.5-1.5" />
    </svg>
  );
}

export function PaymentPreferenceSelector({ value, onChange }: PaymentPreferenceSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-ink">Payment preference</p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {PAYMENT_PREFERENCES.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={
                isSelected
                  ? "flex items-center gap-3 rounded-xl border border-primary bg-primary px-4 py-3 text-left text-sm font-medium text-white shadow-[0_8px_18px_rgba(155,95,104,0.22)]"
                  : "flex items-center gap-3 rounded-xl border border-border-input bg-surface px-4 py-3 text-left text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
              }
            >
              <span
                className={
                  isSelected
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft text-primary"
                }
              >
                <PaymentIcon value={option.value} />
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
