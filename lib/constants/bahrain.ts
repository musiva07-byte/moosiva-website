export const BAHRAIN_GOVERNORATES = [
  "Capital Governorate",
  "Muharraq Governorate",
  "Northern Governorate",
  "Southern Governorate",
] as const;

export const PAYMENT_PREFERENCES = [
  { value: "cash_on_delivery", label: "Cash on Delivery" },
  { value: "benefitpay", label: "BenefitPay" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "payment_link", label: "Payment Link" },
] as const;

export type PaymentPreference = (typeof PAYMENT_PREFERENCES)[number]["value"];

export const PAYMENT_PREFERENCE_LABELS: Record<PaymentPreference, string> = Object.fromEntries(
  PAYMENT_PREFERENCES.map((option) => [option.value, option.label]),
) as Record<PaymentPreference, string>;
