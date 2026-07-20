import { describe, expect, it } from "vitest";
import { formatBhd } from "./currency";

describe("formatBhd", () => {
  it("formats with exactly 3 decimal places", () => {
    expect(formatBhd(12.5)).toBe("BHD 12.500");
  });

  it("formats a whole number with trailing zeros", () => {
    expect(formatBhd(45)).toBe("BHD 45.000");
  });

  it("rounds to 3 decimal places", () => {
    expect(formatBhd(12.3456)).toBe("BHD 12.346");
  });

  it("formats zero correctly", () => {
    expect(formatBhd(0)).toBe("BHD 0.000");
  });
});
