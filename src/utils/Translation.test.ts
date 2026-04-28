import { describe, it, expect } from "vitest";
import Translation from "./Translation";
import enTranslation from "../translations/en.json";
import frTranslation from "../translations/fr.json";
import esTranslation from "../translations/es.json";

describe("Translation", () => {
    it("returns english strings when language is 'en'", () => {
        const t = new Translation("en");
        expect(t.getLanguage()).toBe("en");
        expect(t.get()).toEqual(enTranslation);
    });

    it("returns french strings when language is 'fr'", () => {
        const t = new Translation("fr");
        expect(t.getLanguage()).toBe("fr");
        expect(t.get()).toEqual(frTranslation);
    });

    it("returns spanish strings when language is 'es'", () => {
        const t = new Translation("es");
        expect(t.getLanguage()).toBe("es");
        expect(t.get()).toEqual(esTranslation);
    });

    it("falls back to english for unsupported languages", () => {
        const t = new Translation("de");
        expect(t.getLanguage()).toBe("en");
        expect(t.get()).toEqual(enTranslation);
    });

    it("falls back to english for empty language", () => {
        const t = new Translation("");
        expect(t.getLanguage()).toBe("en");
        expect(t.get()).toEqual(enTranslation);
    });
});
