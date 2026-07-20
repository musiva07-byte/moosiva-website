import { describe, expect, it } from "vitest";
import { normalizeBahrainPhone } from "./phone";

describe("normalizeBahrainPhone", () => {
  it("normalizes all accepted formats to the same value", () => {
    const expected = "+97333331101";
    expect(normalizeBahrainPhone("33331101")).toBe(expected);
    expect(normalizeBahrainPhone("+97333331101")).toBe(expected);
    expect(normalizeBahrainPhone("+973 3333 1101")).toBe(expected);
    expect(normalizeBahrainPhone("00973 3333 1101")).toBe(expected);
  });

  it("handles extra whitespace and dashes", () => {
    expect(normalizeBahrainPhone(" 3333-1101 ")).toBe("+97333331101");
  });

  it("returns null for too few digits", () => {
    expect(normalizeBahrainPhone("12345")).toBeNull();
  });

  it("returns null for too many digits", () => {
    expect(normalizeBahrainPhone("973333311019999")).toBeNull();
  });

  it("returns null for empty or non-numeric input", () => {
    expect(normalizeBahrainPhone("")).toBeNull();
    expect(normalizeBahrainPhone("not a phone number")).toBeNull();
  });
});
