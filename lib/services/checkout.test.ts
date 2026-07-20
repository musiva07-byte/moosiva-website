import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Mocks ──────────────────────────────────────────────────────────────────────

const mockGetPublishedProductBySlug = vi.fn();
vi.mock("@/lib/services/products", () => ({
  getPublishedProductBySlug: (...args: unknown[]) => mockGetPublishedProductBySlug(...args),
}));

const { mockGetWhatsAppUrl } = vi.hoisted(() => ({
  mockGetWhatsAppUrl: vi.fn((): string | null => "https://wa.me/97312345678?text=mocked-message"),
}));

vi.mock("@/lib/services/whatsapp", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./whatsapp")>();
  return { ...actual, getWhatsAppUrl: mockGetWhatsAppUrl };
});

const fromCalls: string[] = [];
const insertMock = vi.fn((_payload: Record<string, unknown>) => ({ select: () => ({ single: mockInsertSingle }) }));
const updateMock = vi.fn((_payload: Record<string, unknown>) => ({ eq: mockUpdateEq }));
const mockInsertSingle = vi.fn();
const mockUpdateEq = vi.fn();
let adminClientAvailable = true;

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => {
    if (!adminClientAvailable) return null;
    return {
      from: (table: string) => {
        fromCalls.push(table);
        return { insert: insertMock, update: updateMock };
      },
    };
  },
}));

import {
  CHECKOUT_SUBMIT_FAILED_MESSAGE,
  CHECKOUT_UNAVAILABLE_MESSAGE,
  createWebsiteOrderRequest,
  resolveCheckoutSelection,
} from "./checkout";

// ── Fixtures ───────────────────────────────────────────────────────────────────

const baseProduct = {
  id: "product-1",
  slug: "pearl-trim-abaya",
  name: "Pearl Trim Abaya",
  website_title: null,
  website_description: null,
  description: null,
  material: null,
  care_instructions: null,
  category: { name: "Abayas", slug: "abayas" },
  image: null,
  variants: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      color: "Black",
      size: "M",
      regular_price_bhd: 20,
      discount_price_bhd: 15,
      stock_quantity: 5,
    },
  ],
  featured: false,
  new_arrival: false,
};

const validInput = {
  productSlug: "pearl-trim-abaya",
  variantId: "11111111-1111-4111-8111-111111111111",
  quantity: 2,
  customerName: "Fatima Ali",
  mobile: "33331101",
  whatsapp: "33331101",
  governorate: "Capital Governorate",
  area: "Manama",
  block: "",
  road: "",
  building: "",
  flat: "",
  landmark: "",
  deliveryNotes: "",
  paymentPreference: "cash_on_delivery",
};

beforeEach(() => {
  fromCalls.length = 0;
  insertMock.mockClear();
  updateMock.mockClear();
  mockInsertSingle.mockReset();
  mockUpdateEq.mockReset();
  mockGetPublishedProductBySlug.mockReset();
  mockGetWhatsAppUrl.mockClear();
  adminClientAvailable = true;

  mockGetPublishedProductBySlug.mockResolvedValue(baseProduct);
  mockInsertSingle.mockResolvedValue({
    data: { id: "row-1", request_number: "MWR-20260717-0001" },
    error: null,
  });
  mockUpdateEq.mockResolvedValue({ error: null });
});

// ── resolveCheckoutSelection ───────────────────────────────────────────────────

describe("resolveCheckoutSelection", () => {
  it("resolves a valid selection with the server-computed active price", async () => {
    const result = await resolveCheckoutSelection("pearl-trim-abaya", "11111111-1111-4111-8111-111111111111", 2);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.unitPriceBhd).toBe(15);
      expect(result.totalBhd).toBe(30);
    }
  });

  it("is unavailable when the product does not exist", async () => {
    mockGetPublishedProductBySlug.mockResolvedValue(null);
    expect(await resolveCheckoutSelection("nope", "11111111-1111-4111-8111-111111111111", 1)).toEqual({
      ok: false,
      error: CHECKOUT_UNAVAILABLE_MESSAGE,
    });
  });

  it("is unavailable when the variant does not belong to the product", async () => {
    expect(await resolveCheckoutSelection("pearl-trim-abaya", "not-a-real-variant", 1)).toEqual({
      ok: false,
      error: CHECKOUT_UNAVAILABLE_MESSAGE,
    });
  });

  it("is unavailable when the requested quantity exceeds stock", async () => {
    expect(await resolveCheckoutSelection("pearl-trim-abaya", "11111111-1111-4111-8111-111111111111", 999)).toEqual({
      ok: false,
      error: CHECKOUT_UNAVAILABLE_MESSAGE,
    });
  });

  it("is unavailable for missing or invalid params, without ever querying a product", async () => {
    expect(await resolveCheckoutSelection("", "11111111-1111-4111-8111-111111111111", 1)).toEqual({
      ok: false,
      error: CHECKOUT_UNAVAILABLE_MESSAGE,
    });
    expect(await resolveCheckoutSelection("pearl-trim-abaya", "", 1)).toEqual({
      ok: false,
      error: CHECKOUT_UNAVAILABLE_MESSAGE,
    });
    expect(await resolveCheckoutSelection("pearl-trim-abaya", "11111111-1111-4111-8111-111111111111", 0)).toEqual({
      ok: false,
      error: CHECKOUT_UNAVAILABLE_MESSAGE,
    });
    expect(mockGetPublishedProductBySlug).not.toHaveBeenCalled();
  });
});

// ── createWebsiteOrderRequest ──────────────────────────────────────────────────

describe("createWebsiteOrderRequest — validation", () => {
  it("rejects a missing customer name with a friendly message", async () => {
    const result = await createWebsiteOrderRequest({ ...validInput, customerName: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/full name/i);
  });

  it("rejects a missing governorate", async () => {
    const result = await createWebsiteOrderRequest({ ...validInput, governorate: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/governorate/i);
  });

  it("rejects an invalid payment preference", async () => {
    const result = await createWebsiteOrderRequest({ ...validInput, paymentPreference: "crypto" });
    expect(result.ok).toBe(false);
  });

  it("rejects an unparseable Bahrain mobile number", async () => {
    const result = await createWebsiteOrderRequest({ ...validInput, mobile: "123" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/valid bahrain mobile/i);
  });

  it("rejects an unparseable Bahrain WhatsApp number", async () => {
    const result = await createWebsiteOrderRequest({
      ...validInput,
      whatsapp: "not-a-number",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/valid bahrain whatsapp/i);
  });

  it("is unavailable when the product/variant is no longer valid, never reaching the database", async () => {
    mockGetPublishedProductBySlug.mockResolvedValue(null);
    const result = await createWebsiteOrderRequest(validInput);
    expect(result).toEqual({ ok: false, error: CHECKOUT_UNAVAILABLE_MESSAGE });
    expect(insertMock).not.toHaveBeenCalled();
  });
});

describe("createWebsiteOrderRequest — success path", () => {
  it("uses the server-computed price/total, never anything implied by the client", async () => {
    await createWebsiteOrderRequest(validInput);
    const payload = insertMock.mock.calls[0][0] as Record<string, unknown>;
    // validInput has no price field at all — it cannot possibly have come from the client.
    expect(payload.unit_price_snapshot).toBe(15);
    expect(payload.total_snapshot).toBe(30);
  });

  it("stores the full product/variant snapshot", async () => {
    await createWebsiteOrderRequest(validInput);
    const payload = insertMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.product_id).toBe("product-1");
    expect(payload.product_variant_id).toBe("11111111-1111-4111-8111-111111111111");
    expect(payload.product_name_snapshot).toBe("Pearl Trim Abaya");
    expect(payload.color_snapshot).toBe("Black");
    expect(payload.size_snapshot).toBe("M");
    expect(payload.quantity).toBe(2);
  });

  it("stores customer and normalized address/phone fields", async () => {
    await createWebsiteOrderRequest(validInput);
    const payload = insertMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.customer_name).toBe("Fatima Ali");
    expect(payload.mobile_display).toBe("33331101");
    expect(payload.mobile_normalized).toBe("+97333331101");
    expect(payload.whatsapp_normalized).toBe("+97333331101");
    expect(payload.governorate).toBe("Capital Governorate");
    expect(payload.area).toBe("Manama");
    expect(payload.payment_preference).toBe("cash_on_delivery");
  });

  it("only ever touches website_order_requests — no stock/order tables", async () => {
    await createWebsiteOrderRequest(validInput);
    expect(fromCalls.every((table) => table === "website_order_requests")).toBe(true);
    for (const forbidden of ["stock_movements", "orders", "order_items", "product_variants", "products"]) {
      expect(fromCalls).not.toContain(forbidden);
    }
  });

  it("never sends a status other than the default — no direct final-order creation", async () => {
    await createWebsiteOrderRequest(validInput);
    const payload = insertMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.status).toBeUndefined(); // relies on the table's own default('new'), not set here
  });

  it("returns the request number and a WhatsApp URL on success", async () => {
    const result = await createWebsiteOrderRequest(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.requestNumber).toBe("MWR-20260717-0001");
      expect(result.whatsappUrl).toBeTruthy();
      expect(result.totalBhd).toBe(30);
    }
  });

  it("still saves the request when no WhatsApp number is configured — returns whatsappUrl: null instead of failing", async () => {
    mockGetWhatsAppUrl.mockReturnValueOnce(null);
    const result = await createWebsiteOrderRequest(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.whatsappUrl).toBeNull();
      expect(result.requestNumber).toBe("MWR-20260717-0001");
    }
  });

  it("returns a friendly error, never a raw Supabase error, when the insert fails", async () => {
    mockInsertSingle.mockResolvedValue({ data: null, error: { message: "duplicate key value" } });
    const result = await createWebsiteOrderRequest(validInput);
    expect(result).toEqual({ ok: false, error: CHECKOUT_SUBMIT_FAILED_MESSAGE });
  });

  it("returns a friendly error when the service role client is unavailable", async () => {
    adminClientAvailable = false;
    const result = await createWebsiteOrderRequest(validInput);
    expect(result).toEqual({ ok: false, error: CHECKOUT_SUBMIT_FAILED_MESSAGE });
  });

  it("never includes cost/profit/supplier fields in the insert payload", async () => {
    await createWebsiteOrderRequest(validInput);
    const payload = insertMock.mock.calls[0][0] as Record<string, unknown>;
    const serialized = JSON.stringify(payload).toLowerCase();
    for (const forbidden of ["cost_price", "landed_cost", "profit", "margin", "supplier", "barcode", "sku"]) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
