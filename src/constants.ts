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

// Sezzle app download targets. Shared by the app-promo banner and the in-store
// "Get the app" step, so the links can't drift apart.
export const APP_URL = "https://sezzle.com/app";
export const APP_STORE_URL =
  "https://apps.apple.com/us/app/sezzle-buy-now-pay-later/id1434922495";
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.sezzle.sezzlemobile";

// As-of date for the store ratings shown in the app-promo pills. The ratings
// themselves live in the translation bundle; update both together so the claim
// and its date never drift apart.
export const APP_RATINGS_AS_OF = "07/2026";
