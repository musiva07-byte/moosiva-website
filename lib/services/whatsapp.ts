import { formatBhd } from "@/lib/formatters/currency";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

/**
 * Returns a wa.me deep link for the configured Moosiva WhatsApp number, or
 * null when the number is not configured yet so callers can render an
 * empty state instead of a broken link.
 */
export function getWhatsAppUrl(message?: string): string | null {
  if (!WHATSAPP_NUMBER) {
    return null;
  }

  const digitsOnly = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

  if (!digitsOnly) {
    return null;
  }

  const query = message ? `?text=${encodeURIComponent(message)}` : "";

  return `https://wa.me/${digitsOnly}${query}`;
}

/**
 * Product-enquiry message shown to the customer before they send it —
 * WhatsApp opens with this prefilled, the customer still has to hit send.
 */
export function buildProductEnquiryMessage(params: {
  productName: string;
  color: string | null;
  size: string | null;
  quantity: number;
  productUrl: string;
}): string {
  return [
    "Hello Moosiva, I would like to ask about this product:",
    "",
    `Product: ${params.productName}`,
    `Color: ${params.color ?? "Not selected"}`,
    `Size: ${params.size ?? "Not selected"}`,
    `Quantity: ${params.quantity}`,
    `Link: ${params.productUrl}`,
    "",
    "Please confirm availability.",
  ].join("\n");
}

const DASH = "-";
const fallbackDash = (value: string | null) => (value && value.trim() ? value : DASH);

/**
 * The order-request message stored on website_order_requests.whatsapp_message
 * and opened for the customer after a checkout request is created. Exact
 * format required — see context/progress-tracker.md Unit 2E.
 */
export function buildCheckoutWhatsAppMessage(params: {
  requestNumber: string;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  unitPriceBhd: number;
  totalBhd: number;
  customerName: string;
  mobileDisplay: string;
  whatsappDisplay: string;
  governorate: string;
  area: string;
  block: string | null;
  road: string | null;
  building: string | null;
  flat: string | null;
  landmark: string | null;
  deliveryNotes: string | null;
  paymentPreferenceLabel: string;
}): string {
  return [
    "Hello Moosiva, I would like to order:",
    "",
    `Request No: ${params.requestNumber}`,
    "",
    `Product: ${params.productName}`,
    `Color: ${params.color}`,
    `Size: ${params.size}`,
    `Quantity: ${params.quantity}`,
    `Unit price: ${formatBhd(params.unitPriceBhd)}`,
    `Total: ${formatBhd(params.totalBhd)}`,
    "",
    `Customer name: ${params.customerName}`,
    `Mobile: ${params.mobileDisplay}`,
    `WhatsApp: ${params.whatsappDisplay}`,
    "",
    "Delivery address:",
    `Governorate: ${params.governorate}`,
    `Area: ${params.area}`,
    `Block: ${fallbackDash(params.block)}`,
    `Road: ${fallbackDash(params.road)}`,
    `Building: ${fallbackDash(params.building)}`,
    `Flat: ${fallbackDash(params.flat)}`,
    `Landmark: ${fallbackDash(params.landmark)}`,
    "",
    `Delivery note: ${fallbackDash(params.deliveryNotes)}`,
    "",
    `Payment preference: ${params.paymentPreferenceLabel}`,
    "",
    "Please confirm availability and payment details.",
  ].join("\n");
}
