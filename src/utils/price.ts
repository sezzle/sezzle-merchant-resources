// Price parsing and locale-formatting helpers, ported from
// ../sezzle-widget-react/src/Helpers/helper.js so the modal logic behaves
// identically here. Only the pieces the payment-plan UI needs are kept; the
// widget's getLanguage/getTranslations are unnecessary because this project
// already resolves language through the Translation class.

/**
 * Returns the digits/decimal/grouping characters of a price string, ignoring
 * any currency symbols and sentence punctuation.
 */
export function parsePriceString(price: string): string {
  let formattedPrice = "";
  if (!price) return formattedPrice;
  for (let i = 0; i < price.length; i++) {
    if (isNumeric(price[i]) || price[i] === "." || price[i] === ",") {
      // Ignore actual sentence punctuation
      if (i > 0 && price[i] === "." && isAlphabet(price[i - 1])) continue;

      formattedPrice += price[i];
    }
  }
  return formattedPrice;
}

/** Parses the price from a string to a float. */
export function parsePrice(price: string): number {
  return parseFloat(parsePriceString(price));
}

/** True when the single character is numeric. */
export function isNumeric(n: string): boolean {
  return !isNaN(parseFloat(n)) && isFinite(n as unknown as number);
}

/** True when the single character is an alphabet character (or parenthesis). */
export function isAlphabet(n: string): boolean {
  return /^[a-zA-Z()]+$/.test(n);
}

/**
 * Extracts the currency symbol from a price string, falling back to the
 * provided default when none is present.
 */
export function getCurrency(priceString: string, defaultCurrency = "$"): string {
  const CURRENCY_REGEX = /[$€£₤₹]/;
  const currencyMatch = priceString.match(CURRENCY_REGEX);
  return currencyMatch ? currencyMatch[0] : defaultCurrency;
}

/**
 * Renders a numeric value with the decimal separator appropriate for the
 * language: a period for English, a comma for French/Spanish. Only the decimal
 * separator is swapped; no grouping is applied.
 */
export function formatNumberForLocale(value: number | string, lang: string): string {
  const str = String(value);
  return lang === "fr" || lang === "es" ? str.replace(".", ",") : str;
}
