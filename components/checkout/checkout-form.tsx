"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { submitCheckoutRequestAction } from "@/app/checkout/actions";
import { AddressFields, type AddressFieldValues } from "@/components/checkout/address-fields";
import { PaymentPreferenceSelector } from "@/components/checkout/payment-preference-selector";
import type { PaymentPreference } from "@/lib/constants/bahrain";

type CheckoutFormProps = {
  productSlug: string;
  variantId: string;
  quantity: number;
};

type FormState = AddressFieldValues & {
  customerName: string;
  mobile: string;
  whatsapp: string;
  whatsappSameAsMobile: boolean;
  paymentPreference: PaymentPreference | "";
};

const INITIAL_STATE: FormState = {
  customerName: "",
  mobile: "",
  whatsapp: "",
  whatsappSameAsMobile: true,
  governorate: "",
  area: "",
  block: "",
  road: "",
  building: "",
  flat: "",
  landmark: "",
  deliveryNotes: "",
  paymentPreference: "",
};

const inputClassName =
  "h-11 w-full rounded-xl border border-border-input bg-surface px-3.5 text-sm text-ink transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:bg-soft";

export function CheckoutForm({ productSlug, variantId, quantity }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [formError, setFormError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleMobileChange(value: string) {
    setForm((prev) => ({
      ...prev,
      mobile: value,
      whatsapp: prev.whatsappSameAsMobile ? value : prev.whatsapp,
    }));
  }

  function handleWhatsappSameToggle(checked: boolean) {
    setForm((prev) => ({
      ...prev,
      whatsappSameAsMobile: checked,
      whatsapp: checked ? prev.mobile : prev.whatsapp,
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isPending) {
      // Belt-and-braces: the button is already disabled while pending, but
      // guard the handler itself against a stray second submit event too.
      return;
    }
    setFormError(null);

    startTransition(async () => {
      const result = await submitCheckoutRequestAction({
        productSlug,
        variantId,
        quantity,
        customerName: form.customerName,
        mobile: form.mobile,
        whatsapp: form.whatsapp,
        governorate: form.governorate,
        area: form.area,
        block: form.block,
        road: form.road,
        building: form.building,
        flat: form.flat,
        landmark: form.landmark,
        deliveryNotes: form.deliveryNotes,
        paymentPreference: form.paymentPreference,
      });

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      if (result.whatsappUrl) {
        // Opened from this click handler (a direct user gesture), so most
        // browsers allow it — the success page still has its own "Open
        // WhatsApp" button as a fallback if a popup blocker steps in anyway.
        window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      const params = new URLSearchParams({
        request: result.requestNumber,
        product: result.productName,
        total: String(result.totalBhd),
        payment: result.paymentPreferenceLabel,
      });
      if (result.whatsappUrl) {
        params.set("whatsapp", result.whatsappUrl);
      }

      router.push(`/order-request-success?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-[0_10px_26px_rgba(90,53,59,0.06)] sm:p-6">
        <h2 className="font-display text-xl text-rose-deep">Customer details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="customerName" className="text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="customerName"
              type="text"
              required
              value={form.customerName}
              onChange={(e) => update("customerName", e.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="mobile" className="text-sm font-medium text-ink">
              Mobile number
            </label>
            <input
              id="mobile"
              type="tel"
              required
              placeholder="e.g. 33331101"
              value={form.mobile}
              onChange={(e) => handleMobileChange(e.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="whatsapp" className="text-sm font-medium text-ink">
              WhatsApp number
            </label>
            <input
              id="whatsapp"
              type="tel"
              required
              disabled={form.whatsappSameAsMobile}
              value={form.whatsapp}
              onChange={(e) => {
                update("whatsapp", e.target.value);
                update("whatsappSameAsMobile", false);
              }}
              className={inputClassName}
            />
            <label className="flex items-center gap-2 pt-1 text-xs text-ink-muted">
              <input
                type="checkbox"
                checked={form.whatsappSameAsMobile}
                onChange={(e) => handleWhatsappSameToggle(e.target.checked)}
              />
              Same as mobile number
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-[0_10px_26px_rgba(90,53,59,0.06)] sm:p-6">
        <h2 className="font-display text-xl text-rose-deep">Delivery address</h2>
        <AddressFields
          values={{
            governorate: form.governorate,
            area: form.area,
            block: form.block,
            road: form.road,
            building: form.building,
            flat: form.flat,
            landmark: form.landmark,
            deliveryNotes: form.deliveryNotes,
          }}
          onChange={(field, value) => update(field, value)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_10px_26px_rgba(90,53,59,0.06)] sm:p-6">
        <PaymentPreferenceSelector
          value={form.paymentPreference}
          onChange={(value) => update("paymentPreference", value)}
        />
      </div>

      {formError ? (
        <p className="flex items-start gap-2 rounded-xl border border-error/20 bg-error/5 p-3.5 text-sm text-error">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="7.5" /><path d="M10 6.5v4M10 13.5h.01" /></svg>
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(155,95,104,0.22)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_14px_28px_rgba(155,95,104,0.28)] disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {isPending ? "Submitting…" : "Submit to WhatsApp"}
      </button>
    </form>
  );
}
