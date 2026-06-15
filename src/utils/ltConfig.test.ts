import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  DEFAULT_LT_GROUP,
  LT_GROUPS,
  normalizeGroup,
  resolveTermsToShow,
  resolveLTConfig,
  selectTermsToShow,
  termMonthBounds,
} from "./ltConfig";

describe("normalizeGroup", () => {
  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => warn.mockRestore());

  it("returns null when no alias is given", () => {
    expect(normalizeGroup(undefined)).toBeNull();
    expect(normalizeGroup(null)).toBeNull();
    expect(normalizeGroup("")).toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  it("resolves known aliases case-insensitively without warning", () => {
    expect(normalizeGroup("a")).toBe("a");
    expect(normalizeGroup("B")).toBe("b");
    expect(warn).not.toHaveBeenCalled();
  });

  it("warns and returns null for unknown aliases", () => {
    expect(normalizeGroup("zzz")).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("Unknown LTgroup");
  });
});

describe("resolveTermsToShow", () => {
  const preset = LT_GROUPS.a.termsToShow;
  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => warn.mockRestore());

  it("returns the preset when nothing is provided", () => {
    expect(resolveTermsToShow(undefined, preset)).toBe(preset);
    expect(resolveTermsToShow(null, preset)).toBe(preset);
    expect(warn).not.toHaveBeenCalled();
  });

  it("returns a valid provided map untouched", () => {
    const provided = { default: [3], 500: [12] };
    expect(resolveTermsToShow(provided, preset)).toBe(provided);
    expect(warn).not.toHaveBeenCalled();
  });

  it("warns and falls back to the preset on a malformed map", () => {
    expect(resolveTermsToShow({ default: "nope" } as never, preset)).toBe(preset);
    expect(resolveTermsToShow([3, 6, 9] as never, preset)).toBe(preset);
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain("Malformed termsToShow");
  });

  it("borrows the preset default when a valid map is missing the default key", () => {
    const provided = { 500: [12, 18] };
    const result = resolveTermsToShow(provided, preset);
    expect(result.default).toEqual(preset.default);
    expect(result[500]).toEqual([12, 18]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('missing a "default" key');
  });
});

describe("resolveLTConfig", () => {
  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => warn.mockRestore());

  it("disables LT via minPriceLT 0, but still defaults every other field to group 'a' when neither LTgroup nor minPriceLT is set", () => {
    expect(resolveLTConfig({})).toEqual({
      minPriceLT: 0,
      maxPriceLT: LT_GROUPS.a.maxPriceLT,
      minAPR: LT_GROUPS.a.minAPR,
      medianAPR: LT_GROUPS.a.medianAPR,
      maxAPR: LT_GROUPS.a.maxAPR,
      termsToShow: LT_GROUPS.a.termsToShow,
    });
  });

  it("enables LT via LTgroup alone, using all preset values", () => {
    const cfg = resolveLTConfig({ LTgroup: "a" });
    expect(cfg.minPriceLT).toBe(LT_GROUPS.a.minPriceLT);
    expect(cfg.maxPriceLT).toBe(LT_GROUPS.a.maxPriceLT);
    expect(cfg.minAPR).toBe(LT_GROUPS.a.minAPR);
    expect(cfg.medianAPR).toBe(LT_GROUPS.a.medianAPR);
    expect(cfg.maxAPR).toBe(LT_GROUPS.a.maxAPR);
    expect(cfg.termsToShow).toBe(LT_GROUPS.a.termsToShow);
  });

  it("enables LT via minPriceLT alone (no group) using the default preset", () => {
    const cfg = resolveLTConfig({ minPriceLT: 500 });
    expect(cfg.minPriceLT).toBe(500);
    expect(cfg.medianAPR).toBe(LT_GROUPS[DEFAULT_LT_GROUP].medianAPR);
  });

  it("lets explicit non-zero props override preset values; 0 is treated as not set", () => {
    const cfg = resolveLTConfig({
      LTgroup: "a",
      minPriceLT: 300,
      medianAPR: 19.99,
      maxAPR: 0, // 0 = not set → preset value retained
    });
    expect(cfg.minPriceLT).toBe(300);
    expect(cfg.medianAPR).toBe(19.99);
    expect(cfg.maxAPR).toBe(LT_GROUPS.a.maxAPR);
  });

  it("enables LT via LTgroup 'b', using all of preset b", () => {
    const cfg = resolveLTConfig({ LTgroup: "b" });
    expect(cfg.minPriceLT).toBe(LT_GROUPS.b.minPriceLT);
    expect(cfg.maxPriceLT).toBe(LT_GROUPS.b.maxPriceLT);
    expect(cfg.minAPR).toBe(LT_GROUPS.b.minAPR);
    expect(cfg.medianAPR).toBe(LT_GROUPS.b.medianAPR);
    expect(cfg.maxAPR).toBe(LT_GROUPS.b.maxAPR);
    expect(cfg.termsToShow).toBe(LT_GROUPS.b.termsToShow);
  });

  it("honors explicit maxPriceLT and minAPR overrides on top of a preset", () => {
    const cfg = resolveLTConfig({ LTgroup: "a", maxPriceLT: 9000, minAPR: 12.49 });
    expect(cfg.maxPriceLT).toBe(9000);
    expect(cfg.minAPR).toBe(12.49);
    expect(cfg.minPriceLT).toBe(LT_GROUPS.a.minPriceLT);
    expect(cfg.medianAPR).toBe(LT_GROUPS.a.medianAPR);
  });

  it("disables LT (minPriceLT 0) and warns when LTgroup is unknown and minPriceLT is unset", () => {
    const cfg = resolveLTConfig({ LTgroup: "zzz" });
    expect(cfg.minPriceLT).toBe(0);
    expect(cfg.maxPriceLT).toBe(LT_GROUPS.a.maxPriceLT);
    expect(cfg.medianAPR).toBe(LT_GROUPS.a.medianAPR);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("Unknown LTgroup");
  });

  it("enables LT with the default preset when an unknown LTgroup is paired with minPriceLT", () => {
    const cfg = resolveLTConfig({ LTgroup: "zzz", minPriceLT: 200 });
    expect(cfg.minPriceLT).toBe(200);
    expect(cfg.medianAPR).toBe(LT_GROUPS[DEFAULT_LT_GROUP].medianAPR);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe("LT_GROUPS immutability", () => {
  it("deep-freezes every preset, including nested termsToShow arrays", () => {
    expect(Object.isFrozen(LT_GROUPS)).toBe(true);
    expect(Object.isFrozen(LT_GROUPS.a)).toBe(true);
    expect(Object.isFrozen(LT_GROUPS.a.termsToShow)).toBe(true);
    expect(Object.isFrozen(LT_GROUPS.a.termsToShow.default)).toBe(true);
  });

  it("throws instead of corrupting the preset when a resolved config is mutated", () => {
    const cfg = resolveLTConfig({ LTgroup: "a" });
    expect(cfg.termsToShow).toBe(LT_GROUPS.a.termsToShow);
    expect(() => cfg.termsToShow.default.push(12)).toThrow();
    expect(() => {
      cfg.termsToShow.default = [1];
    }).toThrow();
    expect(LT_GROUPS.a.termsToShow.default).toEqual([3, 6, 9]);
  });
});

describe("selectTermsToShow", () => {
  const terms = LT_GROUPS.a.termsToShow;

  it("selects the array for the highest threshold the price exceeds", () => {
    expect(selectTermsToShow(0, terms)).toEqual([3, 6, 9]);
    expect(selectTermsToShow(300, terms)).toEqual([3, 6, 9]);
    expect(selectTermsToShow(300.01, terms)).toEqual([6, 9, 12]);
    expect(selectTermsToShow(500, terms)).toEqual([6, 9, 12]);
    expect(selectTermsToShow(500.01, terms)).toEqual([12, 18, 24]);
    expect(selectTermsToShow(1000, terms)).toEqual([12, 18, 24]);
    expect(selectTermsToShow(1000.01, terms)).toEqual([24, 36, 48]);
    expect(selectTermsToShow(15000, terms)).toEqual([24, 36, 48]);
  });

  it("returns undefined for a missing or non-object config", () => {
    expect(selectTermsToShow(100, null)).toBeUndefined();
    expect(selectTermsToShow(100, undefined)).toBeUndefined();
  });
});

describe("termMonthBounds", () => {
  it("returns the min and max month across the whole map", () => {
    expect(termMonthBounds(LT_GROUPS.a.termsToShow)).toEqual({ min: 3, max: 48 });
    expect(termMonthBounds(LT_GROUPS.b.termsToShow)).toEqual({ min: 3, max: 36 });
  });

  it("returns null when there are no usable terms", () => {
    expect(termMonthBounds(null)).toBeNull();
    expect(termMonthBounds({})).toBeNull();
  });
});
