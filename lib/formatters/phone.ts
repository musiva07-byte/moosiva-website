/**
 * Normalizes a Bahrain phone number to "+973XXXXXXXX" (8-digit local
 * number, single canonical form regardless of how it was typed). Returns
 * null when the input doesn't reduce to exactly 8 digits after stripping
 * formatting and any country/IDD prefix — never guesses.
 *
 * Accepted input examples that all normalize to the same value:
 *   "33331101", "+97333331101", "+973 3333 1101", "00973 3333 1101"
 */
export function normalizeBahrainPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }
  if (digits.startsWith("973")) {
    digits = digits.slice(3);
  }

  if (!/^[0-9]{8}$/.test(digits)) {
    return null;
  }

  return `+973${digits}`;
}
