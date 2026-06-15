// Long-term (LT) product configuration.
//
// Ported from ../sezzle-widget-react/src/Helpers/ltConfig.js so this page's
// long-term offering resolves exactly like the widget/modal.
//
// The page supports long-term payment options whose defaults differ by lending
// partner. To make per-partner rollouts easy, each partner's complete set of LT
// defaults is bundled under a neutral alias ("a", "b", ...). The alias is
// deliberately non-branded so the lending partner is never exposed to
// merchants. An account manager guides the merchant on which alias to use based
// on their enrollment, so the merchant no longer has to set every LT field by
// hand. "a" is the default fallback preset.
//
// Every LT option follows a consistent contract: 0 (or unset) means "not set."
// To disable LT entirely, omit both `minPriceLT` and `LTgroup`.
//
// Units note: every LT value here is expressed in whole currency units
// (dollars) — minPriceLT, maxPriceLT, and the termsToShow thresholds are all
// dollar amounts.

export type TermsToShow = Record<string, number[]>;

export interface LTGroupPreset {
  minPriceLT: number;
  maxPriceLT: number;
  minAPR: number;
  medianAPR: number;
  maxAPR: number;
  termsToShow: TermsToShow;
}

export interface ResolvedLTConfig {
  minPriceLT: number;
  maxPriceLT: number;
  minAPR: number;
  medianAPR: number;
  maxAPR: number;
  termsToShow: TermsToShow;
}

export interface LTConfigProps {
  LTgroup?: string;
  minPriceLT?: number;
  maxPriceLT?: number;
  minAPR?: number;
  medianAPR?: number;
  maxAPR?: number;
  termsToShow?: TermsToShow;
}

export const DEFAULT_LT_GROUP = "a";

// Recursively freeze an object and all nested objects/arrays. The presets below
// are shared, long-lived references that resolve* helpers hand out directly
// (e.g. resolveTermsToShow returns the preset's termsToShow, including its term
// arrays, by reference). Freezing makes any accidental downstream mutation
// (e.g. config.termsToShow.default.push(12)) throw instead of silently
// corrupting the preset for the lifetime of the page.
function deepFreeze<T>(obj: T): T {
  for (const value of Object.values(obj as Record<string, unknown>)) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
}

// Per-partner presets. Each preset is a COMPLETE set of LT defaults:
//   minPriceLT  – lowest price (inclusive) eligible for LT
//   maxPriceLT  – highest price (inclusive) eligible for LT
//   minAPR      – lowest APR offered; lower bound of the disclaimer APR range
//   medianAPR   – representative APR; drives per-card monthly payment + per-card APR display
//   maxAPR      – highest APR offered; upper bound of the disclaimer APR range
//   termsToShow – price-threshold → term-length map (see termsToShow shape below)
//
// termsToShow shape: keys are price thresholds in dollars, values are arrays of
// term lengths in months. The `default` key handles prices below all
// thresholds. A price selects the array for the highest threshold it strictly
// exceeds, mirroring the previously hardcoded tiers.
export const LT_GROUPS: Record<string, LTGroupPreset> = deepFreeze({
  // "a" is seeded from the prior production values (APR range 9.99–34.99,
  // median 21.99, maxPriceLT 15000, and the original hardcoded term tiers).
  a: {
    minPriceLT: 150,
    maxPriceLT: 15000,
    minAPR: 9.99,
    medianAPR: 21.99,
    maxAPR: 34.99,
    termsToShow: {
      default: [3, 6, 9],
      300: [6, 9, 12],
      500: [12, 18, 24],
      1000: [24, 36, 48],
    },
  },
  b: {
    minPriceLT: 400,
    maxPriceLT: 8000,
    minAPR: 24.99,
    medianAPR: 29.99,
    maxAPR: 35.99,
    termsToShow: {
      default: [3, 6, 9],
      600: [6, 9, 12],
      800: [9, 12, 24],
      1000: [12, 24, 36],
    },
  },
});

// Resolve an LTgroup alias to its canonical (lowercased) preset key, or null
// when no alias is given. An unrecognized (non-empty) alias warns (listing the
// accepted values) and resolves to null so callers fall back to the default.
export function normalizeGroup(alias: string | undefined | null): string | null {
  if (alias === undefined || alias === null || alias === "") return null;
  const key = String(alias).toLowerCase();
  if (LT_GROUPS[key]) return key;
  console.warn(
    `[Sezzle] Unknown LTgroup "${alias}". Accepted values: ${Object.keys(LT_GROUPS)
      .map((k) => `"${k}"`)
      .join(", ")}. Falling back to "${DEFAULT_LT_GROUP}".`
  );
  return null;
}

// True when `value` is a well-formed termsToShow map: an object whose values are
// non-empty arrays of positive numbers (months).
function isValidTermsToShow(value: unknown): value is TermsToShow {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.values(value as Record<string, unknown>);
  if (entries.length === 0) return false;
  return entries.every(
    (arr) =>
      Array.isArray(arr) &&
      arr.length > 0 &&
      arr.every((n) => Number.isFinite(n) && n > 0)
  );
}

// Resolve a merchant-supplied termsToShow against the group preset. Malformed
// input warns (with the expected shape) and falls back to the preset. A valid
// map missing the `default` key warns and borrows the preset's default so
// below-threshold lookups never fall through.
export function resolveTermsToShow(
  provided: TermsToShow | undefined | null,
  presetTerms: TermsToShow
): TermsToShow {
  if (provided === undefined || provided === null) return presetTerms;
  if (!isValidTermsToShow(provided)) {
    console.warn(
      "[Sezzle] Malformed termsToShow. Expected an object mapping price " +
        "thresholds (numbers, in dollars) to arrays of term lengths in months, " +
        'plus a "default" key for prices below all thresholds, e.g. ' +
        "{ default: [3, 6, 9], 500: [12, 18, 24] }. Falling back to the " +
        "LTgroup preset."
    );
    return presetTerms;
  }
  if (!Array.isArray(provided.default)) {
    console.warn(
      '[Sezzle] termsToShow is missing a "default" key for prices below all ' +
        "thresholds. Using the LTgroup preset's default."
    );
    return { ...provided, default: presetTerms.default };
  }
  return provided;
}

// Pick an explicit prop when it is "set" (> 0), otherwise the preset value.
// A value of 0 is never a valid LT setting, so it is treated as "not set."
function pickPrice(value: number | undefined, fallback: number): number {
  return Number(value) > 0 ? Number(value) : fallback;
}

// Resolve the effective LT config from props.
//
// Every LT value defaults to a group preset, falling back to group "a" even
// when LT is off, so maxPriceLT / the APRs / termsToShow are never 0 or null
// downstream. `minPriceLT` is the sole exception: it is the render trigger
// (LT shows only when minPriceLT > 0), so it stays 0 when LT is disabled — i.e.
// when neither LTgroup nor minPriceLT is provided.
export function resolveLTConfig(props: LTConfigProps = {}): ResolvedLTConfig {
  const explicitGroup = normalizeGroup(props.LTgroup);
  // Backcompat: pre-LTgroup configs enabled LT via minPriceLT alone. When that's
  // set without an explicit LTgroup, auto-resolve to the default preset so the
  // remaining LT defaults come from the original group "a".
  const minPriceLTSet = Number(props.minPriceLT) > 0;
  const group = explicitGroup || (minPriceLTSet ? DEFAULT_LT_GROUP : null);
  const groupDefaults = LT_GROUPS[group ?? DEFAULT_LT_GROUP];

  return {
    minPriceLT: pickPrice(props.minPriceLT, group ? groupDefaults.minPriceLT : 0),
    maxPriceLT: pickPrice(props.maxPriceLT, groupDefaults.maxPriceLT),
    minAPR: pickPrice(props.minAPR, groupDefaults.minAPR),
    medianAPR: pickPrice(props.medianAPR, groupDefaults.medianAPR),
    maxAPR: pickPrice(props.maxAPR, groupDefaults.maxAPR),
    termsToShow: resolveTermsToShow(props.termsToShow, groupDefaults.termsToShow),
  };
}

// Select the term-length array for a price from a termsToShow map. Returns the
// array for the highest dollar threshold the price strictly exceeds, falling
// back to the `default` key. Returns undefined only when the map is missing /
// has no usable default — callers guard against that.
export function selectTermsToShow(
  price: number,
  termsConfig: TermsToShow | null | undefined
): number[] | undefined {
  if (!termsConfig || typeof termsConfig !== "object") return undefined;
  const thresholds = Object.keys(termsConfig)
    .filter((k) => k !== "default")
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  let selected = termsConfig.default;
  for (const threshold of thresholds) {
    if (price > threshold) selected = termsConfig[threshold];
  }
  return selected;
}

// Min and max term-month across the whole termsToShow map (the union of every
// term array, including `default`). Used for the disclaimer's term-length
// bounds. Returns null when no usable terms exist.
export function termMonthBounds(
  termsConfig: TermsToShow | null | undefined
): { min: number; max: number } | null {
  if (!termsConfig || typeof termsConfig !== "object") return null;
  const months = Object.values(termsConfig)
    .filter(Array.isArray)
    .flat()
    .filter((n) => Number.isFinite(n));
  if (months.length === 0) return null;
  return { min: Math.min(...months), max: Math.max(...months) };
}
