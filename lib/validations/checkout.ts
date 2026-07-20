import { z } from "zod";

import { PAYMENT_PREFERENCES } from "@/lib/constants/bahrain";

const PAYMENT_PREFERENCE_VALUES = PAYMENT_PREFERENCES.map((option) => option.value) as [
  string,
  ...string[],
];

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.string().trim().nullable().optional(),
);

export const checkoutRequestSchema = z.object({
  productSlug: z.string().trim().min(1, "Missing product."),
  variantId: z.string().uuid("Missing product option."),
  quantity: z.coerce.number().int("Quantity must be a whole number.").min(1, "Quantity must be at least 1."),

  customerName: z.string().trim().min(2, "Please enter your full name."),
  mobile: z.string().trim().min(1, "Please enter your mobile number."),
  whatsapp: z.string().trim().min(1, "Please enter your WhatsApp number."),

  governorate: z.string().trim().min(1, "Please select your governorate."),
  area: z.string().trim().min(1, "Please enter your area."),
  block: optionalText,
  road: optionalText,
  building: optionalText,
  flat: optionalText,
  landmark: optionalText,
  deliveryNotes: optionalText,

  paymentPreference: z.enum(PAYMENT_PREFERENCE_VALUES, {
    message: "Please select a payment preference.",
  }),
});

export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;
