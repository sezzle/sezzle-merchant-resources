import { describe, it, expect } from "vitest";
import {
  PI5_MIN_PRICE,
  isProductEligibleLT,
  isProductEligiblePI4,
  isProductEligiblePI5,
  isInputAmountValid,
  addDelimiters,
  calculateMonthlyWithInterest,
  getFormattedPrice,
} from "./renderFunctions";
import { LT_GROUPS } from "./ltConfig";

describe("isProductEligibleLT", () => {
  it("is false when minPriceLT is 0 (LT disabled)", () => {
    expect(isProductEligibleLT("500", 0, 15000)).toBe(false);
  });
  it("is true within [minPriceLT, maxPriceLT]", () => {
    expect(isProductEligibleLT("150", 150, 15000)).toBe(true);
    expect(isProductEligibleLT("15000", 150, 15000)).toBe(true);
  });
  it("is false outside the range", () => {
    expect(isProductEligibleLT("149", 150, 15000)).toBe(false);
    expect(isProductEligibleLT("15001", 150, 15000)).toBe(false);
  });
});

describe("isProductEligiblePI4", () => {
  it("respects min/max bounds", () => {
    expect(isProductEligiblePI4("10", 0, 2500)).toBe(true);
    expect(isProductEligiblePI4("10", 20, 2500)).toBe(false);
    expect(isProductEligiblePI4("2501", 0, 2500)).toBe(false);
  });
});

describe("isProductEligiblePI5", () => {
  it("requires numberOfPayments to be 5", () => {
    expect(isProductEligiblePI5("100", 2500, 4)).toBe(false);
    expect(isProductEligiblePI5("100", 2500, 5)).toBe(true);
  });
  it("requires the price to clear PI5_MIN_PRICE", () => {
    expect(isProductEligiblePI5(String(PI5_MIN_PRICE - 1), 2500, 5)).toBe(false);
    expect(isProductEligiblePI5(String(PI5_MIN_PRICE), 2500, 5)).toBe(true);
  });
});

describe("isInputAmountValid", () => {
  it("rejects non-positive or unparseable amounts", () => {
    expect(isInputAmountValid("0", 0, 2500, 0, 0)).toBe(false);
    expect(isInputAmountValid("abc", 0, 2500, 0, 0)).toBe(false);
  });
  it("uses maxPrice as the upper bound when LT is off", () => {
    expect(isInputAmountValid("2500", 0, 2500, 0, 0)).toBe(true);
    expect(isInputAmountValid("2501", 0, 2500, 0, 0)).toBe(false);
  });
  it("extends the upper bound to maxPriceLT when LT is on", () => {
    expect(isInputAmountValid("10000", 0, 2500, 150, 15000)).toBe(true);
    expect(isInputAmountValid("15001", 0, 2500, 150, 15000)).toBe(false);
  });
});

describe("addDelimiters", () => {
  it("formats to two decimals", () => {
    expect(addDelimiters(75)).toBe("75.00");
  });
  it("inserts a thousands comma for large amounts", () => {
    expect(addDelimiters(1234.5)).toBe("1,234.50");
  });
});

describe("calculateMonthlyWithInterest", () => {
  it("returns a simple division when APR is 0", () => {
    expect(calculateMonthlyWithInterest("300", 3, 0)).toBe(100);
  });
  it("amortizes with interest when APR > 0", () => {
    const monthly = calculateMonthlyWithInterest("1200", 12, 21.99);
    expect(monthly).toBeGreaterThan(100); // more than principal/term
    expect(monthly).toBeCloseTo(112.33, 1);
  });
});

describe("getFormattedPrice", () => {
  it("splits bi-weekly when not LT-eligible", () => {
    // $300 over 4 payments, LT disabled (minPriceLT 0) => $75.00
    expect(getFormattedPrice("$300", 4, 0, 0, 0, null)).toBe("$75.00");
  });
  it("uses the longest term's monthly amount when LT-eligible", () => {
    const a = LT_GROUPS.a;
    // $600 => terms [12,18,24]; uses 24-month monthly with median APR.
    const expected = calculateMonthlyWithInterest("600", 24, a.medianAPR).toFixed(2);
    expect(getFormattedPrice("$600", 5, a.minPriceLT, a.maxPriceLT, a.medianAPR, a.termsToShow)).toBe(
      `$${expected}`
    );
  });
});
