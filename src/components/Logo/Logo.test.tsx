import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Logo from "./index";
import { ConfigContext, deriveConfigContext } from "../../containers/ConfigProvider";
import type { AppConfig } from "../../containers/ConfigProvider";
import type { ITranslation } from "../../interface";
import { resolveLTConfig } from "../../utils/ltConfig";

const baseTranslation = {
    logoAltText: "Sezzle: The responsible way to pay",
} as ITranslation;

const renderLogo = (config: AppConfig | undefined) => {
    const derived = config
        ? deriveConfigContext(config)
        : { ltConfig: resolveLTConfig({}), effectiveNumberOfPayments: 5, isCA: false };
    return render(
        <ConfigContext.Provider
            value={{ config, translation: baseTranslation, ...derived }}
        >
            <Logo />
        </ConfigContext.Provider>
    );
};

describe("Logo", () => {
    it("renders nothing when config is undefined", () => {
        const { container } = renderLogo(undefined);
        expect(container.querySelector("img")).toBeNull();
    });

    // Light -> the "sezzle / pay in 5" lockup from the design handoff (where
    // Pay in 5 is offered), dark -> the white "Buy Now, Pay Later" lockup (no
    // white pay-in-5 artwork ships with the handoff). Language doesn't affect
    // which asset is used, so each language maps to the same asset.
    it.each([
        ["light", "en", "sezzle-pay-in-5.webp"],
        ["light", "fr", "sezzle-pay-in-5.webp"],
        ["light", "es", "sezzle-pay-in-5.webp"],
        ["dark", "en", "sezzle-horizontal-bnpl-white.webp"],
        ["dark", "fr", "sezzle-horizontal-bnpl-white.webp"],
        ["dark", "es", "sezzle-horizontal-bnpl-white.webp"],
    ])("renders the %s/%s logo when configured", (theme, language, asset) => {
        const { container } = renderLogo({
            merchant_uuid: "x",
            theme,
            language,
            origin: "",
            isLongTerm: false,
            countryCode: "US",
            numberOfPayments: 5,
            minPrice: 0,
            maxPrice: 2500,
            includeInStore: false,
        });
        // The image carries the localized alt text (sourced from translations).
        const img = container.querySelector("img") as HTMLImageElement;
        expect(img.getAttribute("alt")).toBe(baseTranslation.logoAltText);
        expect(img.src).toContain(asset);
    });

    // Light is the default: anything that isn't exactly "dark" uses the light
    // logo rather than rendering a broken/undefined src.
    it.each(["light", "DARK", "midnight", ""])(
        "falls back to the light logo for theme %j",
        (theme) => {
            const { container } = renderLogo({
                merchant_uuid: "x",
                theme,
                language: "en",
                origin: "",
                isLongTerm: false,
                countryCode: "US",
                numberOfPayments: 5,
                minPrice: 0,
                maxPrice: 2500,
                includeInStore: false,
            });
            const img = container.querySelector("img") as HTMLImageElement;
            expect(img.src).toContain("sezzle-pay-in-5.webp");
        }
    );

    // Where Pay in 5 is hidden (Canada, or a 4-payment merchant), the header
    // must not advertise it: light falls back to the generic BNPL lockup.
    it.each([
        ["US", 4],
        ["CA", 5],
        ["CA", 4],
    ])(
        "uses the generic light lockup when Pay in 5 is off (%s, %i payments)",
        (countryCode, numberOfPayments) => {
            const { container } = renderLogo({
                merchant_uuid: "x",
                theme: "light",
                language: "en",
                origin: "",
                isLongTerm: false,
                countryCode,
                numberOfPayments,
                minPrice: 0,
                maxPrice: 2500,
                includeInStore: false,
            });
            const img = container.querySelector("img") as HTMLImageElement;
            expect(img.src).toContain("sezzle-horizontal-full-color.webp");
        }
    );
});
