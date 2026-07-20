/**
 * WhatsApp-based checkout request flow. Creates a *pending request*, never
 * a final order: no stock is deducted, no stock movement is recorded, no
 * orders/order_items row is touched. See
 * database/migrations/202607171000_create_website_order_requests.sql.
 *
 * Writes go through the Supabase service-role client (lib/supabase/admin.ts)
 * because website_order_requests has no anon RLS policies by design —
 * every write is gated by the validation and re-checks in this file, never
 * by a direct client-side insert.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublishedProductBySlug } from "@/lib/services/products";
import { buildCheckoutWhatsAppMessage, getWhatsAppUrl } from "@/lib/services/whatsapp";
import { normalizeBahrainPhone } from "@/lib/formatters/phone";
import { PAYMENT_PREFERENCE_LABELS, type PaymentPreference } from "@/lib/constants/bahrain";
import { checkoutRequestSchema } from "@/lib/validations/checkout";
import type { PublicProductDetail, PublicProductVariant } from "@/types/public-product";

export const CHECKOUT_UNAVAILABLE_MESSAGE =
  "This item is currently unavailable. Please return to the shop and choose another option.";
export const CHECKOUT_SUBMIT_FAILED_MESSAGE =
  "Unable to submit your request. Please contact Moosiva on WhatsApp.";
export const CHECKOUT_SAVED_NO_WHATSAPP_MESSAGE =
  "Your request was saved. Please contact Moosiva to complete the order.";

export type CheckoutSelectionResult =
  | {
      ok: true;
      product: PublicProductDetail;
      variant: PublicProductVariant;
      unitPriceBhd: number;
      totalBhd: number;
    }
  | { ok: false; error: string };

/**
 * Re-fetches the product/variant fresh via the public-safe service and
 * confirms quantity is still available. Used both to decide whether the
 * checkout page can render the form at all, and again at submission time
 * (state may have changed between page load and submit) — price and stock
 * always come from this, never from the query string or the submitted form.
 */
export async function resolveCheckoutSelection(
  slug: string,
  variantId: string,
  quantity: number,
): Promise<CheckoutSelectionResult> {
  if (!slug || !variantId || !Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, error: CHECKOUT_UNAVAILABLE_MESSAGE };
  }

  const product = await getPublishedProductBySlug(slug);
  if (!product) {
    return { ok: false, error: CHECKOUT_UNAVAILABLE_MESSAGE };
  }

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) {
    return { ok: false, error: CHECKOUT_UNAVAILABLE_MESSAGE };
  }

  if (quantity > variant.stock_quantity) {
    return { ok: false, error: CHECKOUT_UNAVAILABLE_MESSAGE };
  }

  const unitPriceBhd = variant.discount_price_bhd ?? variant.regular_price_bhd;
  if (unitPriceBhd === null) {
    return { ok: false, error: CHECKOUT_UNAVAILABLE_MESSAGE };
  }

  const totalBhd = Math.round(unitPriceBhd * quantity * 1000) / 1000;

  return { ok: true, product, variant, unitPriceBhd, totalBhd };
}

export type CreateWebsiteOrderRequestResult =
  | {
      ok: true;
      requestNumber: string;
      whatsappUrl: string | null;
      productName: string;
      totalBhd: number;
      paymentPreferenceLabel: string;
    }
  | { ok: false; error: string };

export async function createWebsiteOrderRequest(
  rawInput: unknown,
): Promise<CreateWebsiteOrderRequestResult> {
  const parsed = checkoutRequestSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  const input = parsed.data;

  const mobileNormalized = normalizeBahrainPhone(input.mobile);
  if (!mobileNormalized) {
    return { ok: false, error: "Please enter a valid Bahrain mobile number." };
  }

  const whatsappNormalized = normalizeBahrainPhone(input.whatsapp);
  if (!whatsappNormalized) {
    return { ok: false, error: "Please enter a valid Bahrain WhatsApp number." };
  }

  const selection = await resolveCheckoutSelection(input.productSlug, input.variantId, input.quantity);
  if (!selection.ok) {
    return selection;
  }
  const { product, variant, unitPriceBhd, totalBhd } = selection;

  const productName = product.website_title || product.name;
  const paymentPreferenceLabel = PAYMENT_PREFERENCE_LABELS[input.paymentPreference as PaymentPreference];

  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: CHECKOUT_SUBMIT_FAILED_MESSAGE };
  }

  const { data: createdRow, error: insertError } = await admin
    .from("website_order_requests")
    .insert({
      product_id: product.id,
      product_variant_id: variant.id,
      product_name_snapshot: productName,
      color_snapshot: variant.color,
      size_snapshot: variant.size,
      quantity: input.quantity,
      unit_price_snapshot: unitPriceBhd,
      total_snapshot: totalBhd,
      customer_name: input.customerName,
      mobile_display: input.mobile,
      mobile_normalized: mobileNormalized,
      whatsapp_display: input.whatsapp,
      whatsapp_normalized: whatsappNormalized,
      governorate: input.governorate,
      area: input.area,
      block: input.block ?? null,
      road: input.road ?? null,
      building: input.building ?? null,
      flat: input.flat ?? null,
      landmark: input.landmark ?? null,
      delivery_notes: input.deliveryNotes ?? null,
      payment_preference: input.paymentPreference,
      // Overwritten immediately below once the DB-generated request_number
      // is known — whatsapp_message is NOT NULL, so a placeholder is
      // required for this first insert.
      whatsapp_message: "Pending",
    })
    .select("id, request_number")
    .single();

  if (insertError || !createdRow) {
    return { ok: false, error: CHECKOUT_SUBMIT_FAILED_MESSAGE };
  }

  const message = buildCheckoutWhatsAppMessage({
    requestNumber: createdRow.request_number,
    productName,
    color: variant.color,
    size: variant.size,
    quantity: input.quantity,
    unitPriceBhd,
    totalBhd,
    customerName: input.customerName,
    mobileDisplay: input.mobile,
    whatsappDisplay: input.whatsapp,
    governorate: input.governorate,
    area: input.area,
    block: input.block ?? null,
    road: input.road ?? null,
    building: input.building ?? null,
    flat: input.flat ?? null,
    landmark: input.landmark ?? null,
    deliveryNotes: input.deliveryNotes ?? null,
    paymentPreferenceLabel,
  });

  const { error: updateError } = await admin
    .from("website_order_requests")
    .update({ whatsapp_message: message })
    .eq("id", createdRow.id);

  if (updateError) {
    // Non-fatal: the customer's WhatsApp URL below is built from `message`
    // regardless, so their flow is unaffected — only this row's stored
    // whatsapp_message column would be left as "Pending" for staff review.
    console.error("[checkout] failed to store whatsapp_message", updateError);
  }

  return {
    ok: true,
    requestNumber: createdRow.request_number,
    whatsappUrl: getWhatsAppUrl(message),
    productName,
    totalBhd,
    paymentPreferenceLabel,
  };
}
