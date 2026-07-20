import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

describe("buildProductEnquiryMessage", () => {
  it("matches the exact required format with both options selected", async () => {
    const { buildProductEnquiryMessage } = await import("./whatsapp");
    const message = buildProductEnquiryMessage({
      productName: "Pearl Trim Abaya",
      color: "Black",
      size: "L",
      quantity: 2,
      productUrl: "https://www.moosivabh.com/product/pearl-trim-abaya",
    });

    expect(message).toBe(
      [
        "Hello Moosiva, I would like to ask about this product:",
        "",
        "Product: Pearl Trim Abaya",
        "Color: Black",
        "Size: L",
        "Quantity: 2",
        "Link: https://www.moosivabh.com/product/pearl-trim-abaya",
        "",
        "Please confirm availability.",
      ].join("\n"),
    );
  });

  it("shows 'Not selected' for color/size that haven't been chosen yet", async () => {
    const { buildProductEnquiryMessage } = await import("./whatsapp");
    const message = buildProductEnquiryMessage({
      productName: "A Line Top",
      color: null,
      size: null,
      quantity: 1,
      productUrl: "https://www.moosivabh.com/product/a-line-top",
    });

    expect(message).toContain("Color: Not selected");
    expect(message).toContain("Size: Not selected");
  });

  it("never contains cost, price, or internal fields", async () => {
    const { buildProductEnquiryMessage } = await import("./whatsapp");
    const message = buildProductEnquiryMessage({
      productName: "A Line Top",
      color: "White",
      size: "XXL",
      quantity: 1,
      productUrl: "https://www.moosivabh.com/product/a-line-top",
    }).toLowerCase();

    for (const forbidden of ["cost", "profit", "margin", "sku", "barcode", "supplier"]) {
      expect(message).not.toContain(forbidden);
    }
  });
});

const baseCheckoutMessageParams = {
  requestNumber: "MWR-20260717-0001",
  productName: "Pearl Trim Abaya",
  color: "Black",
  size: "M",
  quantity: 2,
  unitPriceBhd: 15,
  totalBhd: 30,
  customerName: "Fatima Ali",
  mobileDisplay: "33331101",
  whatsappDisplay: "33331101",
  governorate: "Capital Governorate",
  area: "Manama",
  block: "304",
  road: "1205",
  building: "12",
  flat: "3",
  landmark: "Near the mosque",
  deliveryNotes: "Call before arriving.",
  paymentPreferenceLabel: "Cash on Delivery",
};

describe("buildCheckoutWhatsAppMessage", () => {
  it("matches the exact required format with every field filled in", async () => {
    const { buildCheckoutWhatsAppMessage } = await import("./whatsapp");
    const message = buildCheckoutWhatsAppMessage(baseCheckoutMessageParams);

    expect(message).toBe(
      [
        "Hello Moosiva, I would like to order:",
        "",
        "Request No: MWR-20260717-0001",
        "",
        "Product: Pearl Trim Abaya",
        "Color: Black",
        "Size: M",
        "Quantity: 2",
        "Unit price: BHD 15.000",
        "Total: BHD 30.000",
        "",
        "Customer name: Fatima Ali",
        "Mobile: 33331101",
        "WhatsApp: 33331101",
        "",
        "Delivery address:",
        "Governorate: Capital Governorate",
        "Area: Manama",
        "Block: 304",
        "Road: 1205",
        "Building: 12",
        "Flat: 3",
        "Landmark: Near the mosque",
        "",
        "Delivery note: Call before arriving.",
        "",
        "Payment preference: Cash on Delivery",
        "",
        "Please confirm availability and payment details.",
      ].join("\n"),
    );
  });

  it("shows a dash for optional address fields that were left blank", async () => {
    const { buildCheckoutWhatsAppMessage } = await import("./whatsapp");
    const message = buildCheckoutWhatsAppMessage({
      ...baseCheckoutMessageParams,
      block: null,
      road: null,
      building: null,
      flat: null,
      landmark: null,
      deliveryNotes: null,
    });

    expect(message).toContain("Block: -");
    expect(message).toContain("Road: -");
    expect(message).toContain("Building: -");
    expect(message).toContain("Flat: -");
    expect(message).toContain("Landmark: -");
    expect(message).toContain("Delivery note: -");
  });

  it("includes BHD prices formatted to 3 decimals", async () => {
    const { buildCheckoutWhatsAppMessage } = await import("./whatsapp");
    const message = buildCheckoutWhatsAppMessage({ ...baseCheckoutMessageParams, unitPriceBhd: 11, totalBhd: 11 });
    expect(message).toContain("Unit price: BHD 11.000");
    expect(message).toContain("Total: BHD 11.000");
  });

  it("never contains cost, profit, supplier, or SKU fields", async () => {
    const { buildCheckoutWhatsAppMessage } = await import("./whatsapp");
    const message = buildCheckoutWhatsAppMessage(baseCheckoutMessageParams).toLowerCase();
    for (const forbidden of ["cost", "profit", "margin", "supplier", "sku", "barcode"]) {
      expect(message).not.toContain(forbidden);
    }
  });
});

describe("getWhatsAppUrl", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = ORIGINAL_ENV;
    vi.resetModules();
  });

  it("returns null when no WhatsApp number is configured — never a fake number", async () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "";
    const { getWhatsAppUrl } = await import("./whatsapp");
    expect(getWhatsAppUrl("hello")).toBeNull();
  });

  it("builds a wa.me link with the encoded message when a number is configured", async () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "+973 3999 0000";
    const { getWhatsAppUrl } = await import("./whatsapp");
    const url = getWhatsAppUrl("Hello Moosiva");
    expect(url).toBe(`https://wa.me/97339990000?text=${encodeURIComponent("Hello Moosiva")}`);
  });
});
