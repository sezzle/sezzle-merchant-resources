import { describe, it, expect } from "vitest";
import {
  parsePriceString,
  parsePrice,
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
