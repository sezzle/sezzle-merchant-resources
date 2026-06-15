import { describe, it, expect } from "vitest";
import {
  parsePriceString,
  parsePrice,
  normalizePriceString,
  getCurrency,
  formatNumberForLocale,
} from "./price";

describe("parsePriceString / parsePrice", () => {
  it("strips currency symbols and keeps digits/separators", () => {
    expect(parsePriceString("$1,234.56")).toBe("1,234.56");
    expect(parsePrice("$1234.56")).toBeCloseTo(1234.56);
  });
  it("returns empty string for falsy input", () => {
    expect(parsePriceString("")).toBe("");
  });
});

describe("normalizePriceString / parsePrice separator handling", () => {
  // A separator with 3+ trailing digits is a thousands grouping; the amount
  // has no fractional part.
  it.each(["$15,000", "$15.000", "$15,000.00", "$15.000,00"])(
    "treats %s as 15000",
    (input) => {
      expect(parsePrice(input)).toBe(15000);
    }
  );

  // A separator with exactly 2 trailing digits is the decimal point (cents).
  it.each(["$150.00", "$150,00"])("treats %s as 150", (input) => {
    expect(parsePrice(input)).toBe(150);
  });

  it("canonicalizes mixed grouping + decimal to a parseable string", () => {
    expect(normalizePriceString("$15,000.00")).toBe("15000.00");
    expect(normalizePriceString("$15.000,00")).toBe("15000.00");
    expect(normalizePriceString("$15,000")).toBe("15000");
    expect(normalizePriceString("150")).toBe("150");
  });
});

describe("getCurrency", () => {
  it("extracts a recognized currency symbol", () => {
    expect(getCurrency("£20")).toBe("£");
    expect(getCurrency("€20")).toBe("€");
  });
  it("falls back to the default when none is present", () => {
    expect(getCurrency("20")).toBe("$");
    expect(getCurrency("20", "C$")).toBe("C$");
  });
});

describe("formatNumberForLocale", () => {
  it("keeps a period for English", () => {
    expect(formatNumberForLocale(9.99, "en")).toBe("9.99");
  });
  it("swaps the decimal separator for fr/es", () => {
    expect(formatNumberForLocale(9.99, "fr")).toBe("9,99");
    expect(formatNumberForLocale(9.99, "es")).toBe("9,99");
  });
});
