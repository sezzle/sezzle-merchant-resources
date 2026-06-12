// Eligibility + price-formatting helpers, ported from
// ../sezzle-widget-react/src/Helpers/renderFunctions.js so the payment-plan UI
// computes the same Pay-in-4 / Pay-in-5 / long-term eligibility and amounts as
// the widget modal.

import { parsePriceString, parsePrice } from "./price";
import { selectTermsToShow, TermsToShow } from "./ltConfig";

export const PI5_MIN_PRICE = 50;

export function isProductEligibleLT(
  priceText: string,
  minPriceLT: number,
  maxPriceLT: number
): boolean {
  if (!minPriceLT) return false;
  const price = parsePrice(priceText);
  return Number.isFinite(price) && price >= minPriceLT && price <= maxPriceLT;
}

export function isProductEligiblePI4(
  priceText: string,
  minPrice: number,
  maxPrice: number
): boolean {
  const price = parsePrice(priceText);
  return Number.isFinite(price) && price >= minPrice && price <= maxPrice;
}

export function isProductEligiblePI5(
  priceText: string,
  maxPrice: number,
  numberOfPayments: number
): boolean {
  if (numberOfPayments !== 5) return false;
  const price = parsePrice(priceText);
  return Number.isFinite(price) && price >= PI5_MIN_PRICE && price <= maxPrice;
}

export function isInputAmountValid(
  priceText: string,
  minPrice: number,
  maxPrice: number,
  minPriceLT: number,
  maxPriceLT: number
): boolean {
  const price = parsePrice(priceText);
  if (!Number.isFinite(price) || price <= 0) return false;
  // LT is only active when minPriceLT is set; otherwise maxPriceLT is ignored
  // and maxPrice is the sole upper bound.
  const upper = minPriceLT > 0 ? Math.max(maxPrice, maxPriceLT || 0) : maxPrice;
  return price >= minPrice && price <= upper;
}

// Inserts a single thousands comma (e.g. 1234.5 -> "1,234.50"). This assumes
// prices stay below $1,000,000 — only one comma group is added, so anything at
// or above a million would render incorrectly (e.g. "1000,000.00"). Safe given
// the current maxPriceLT of 15000; revisit (e.g. Intl.NumberFormat) if that
// limit ever exceeds $999,999.
export function addDelimiters(priceString: number | string): string {
  const parsedPrice = Number(priceString).toFixed(2);
  if (parsedPrice.length > 6) {
    return (
      parsedPrice.substring(0, parsedPrice.indexOf(".") - 3) +
      "," +
      parsedPrice.substring(parsedPrice.indexOf(".") - 3, parsedPrice.length)
    );
  }
  return parsedPrice;
}

export function calculateMonthlyWithInterest(
  priceText: string,
  term: number,
  APR: number
): number {
  const price = Number(priceText);
  if (APR <= 0) {
    return price / term;
  }
  const rate = APR / 100 / 12;
  const numerator = price * rate * Math.pow(1 + rate, term);
  const denominator = Math.pow(1 + rate, term) - 1;
  return numerator / denominator;
}

export function getFormattedPrice(
  price: string,
  numberOfPayments: number,
  minPriceLT: number,
  maxPriceLT: number,
  medianAPR: number,
  termsConfig: TermsToShow | null
): string {
  const priceString = parsePriceString(price);
  const priceReplacer = parsePrice(price);
  const formatter = price.replace(priceString, "{price}");

  // Default to the bi-weekly installment price; override only when LT-eligible
  // with valid terms. The default also acts as a defensive guard: when
  // LT-eligible but no terms match (e.g. a malformed termsToShow that slipped
  // past validation), we keep the bi-weekly price rather than producing NaN.
  const biweeklyInstallmentPrice = priceReplacer / numberOfPayments;
  let sezzleInstallmentPrice = biweeklyInstallmentPrice;
  if (isProductEligibleLT(priceString, minPriceLT, maxPriceLT)) {
    const terms = selectTermsToShow(priceReplacer, termsConfig);
    if (Array.isArray(terms) && terms.length > 0) {
      sezzleInstallmentPrice = calculateMonthlyWithInterest(
        priceString,
        terms[terms.length - 1],
        medianAPR
      );
    }
  }

  const sezzleInstallmentFormattedPrice = formatter.replace(
    "{price}",
    sezzleInstallmentPrice.toFixed(2)
  );

  return sezzleInstallmentFormattedPrice;
}
