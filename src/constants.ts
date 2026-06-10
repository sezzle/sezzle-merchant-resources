export const DEFAULT_LANGUAGE = "en";
export const DEFAULT_THEME = "light";
export const ABOUT_SEZZLE_ONLOAD_EVENT = "about-sezzle-onload";
export const ABOUT_SEZZLE_ERROR_EVENT = "about-sezzle-error";

// Country is merchant-provided (we no longer auto-detect via GeoIP). US is the
// default; "CA" disables Pay-in-5 and all long-term financing.
export const DEFAULT_COUNTRY_CODE = "US";
export const DEFAULT_NUMBER_OF_PAYMENTS = 5;
// Upper bound for bi-weekly installments (mirrors sezzle-widget-react maxPrice).
export const DEFAULT_MAX_PRICE = 2500;
