/** Bahraini Dinar has 3 decimal places, e.g. "BHD 12.500". */
export function formatBhd(amount: number): string {
  return `BHD ${amount.toFixed(3)}`;
}
