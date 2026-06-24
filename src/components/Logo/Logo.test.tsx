import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Logo from "./index";
import { ConfigContext, deriveConfigContext } from "../../containers/ConfigProvider";
import type { AppConfig } from "../../containers/ConfigProvider";
import type { ITranslation } from "../../interface";
import { resolveLTConfig } from "../../utils/ltConfig";

const baseTranslation = {} as ITranslation;

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

    // The logo is theme-driven only: light -> full-color "Buy Now, Pay Later"
    // lockup, dark -> white "Buy Now, Pay Later" lockup. Language no longer
    // affects which asset is used, so each language maps to the same asset.
    it.each([
        ["light", "en", "sezzle-horizontal-full-color.png"],
        ["light", "fr", "sezzle-horizontal-full-color.png"],
        ["light", "es", "sezzle-horizontal-full-color.png"],
        ["dark", "en", "sezzle-horizontal-bnpl-white.png"],
        ["dark", "fr", "sezzle-horizontal-bnpl-white.png"],
        ["dark", "es", "sezzle-horizontal-bnpl-white.png"],
    ])("renders the %s/%s logo when configured", (theme, language, asset) => {
        renderLogo({
            merchant_uuid: "x",
            theme,
            language,
            origin: "",
            isLongTerm: false,
            countryCode: "US",
            numberOfPayments: 5,
            minPrice: 0,
            maxPrice: 2500,
        });
        const img = screen.getByAltText("Logo") as HTMLImageElement;
        expect(img.src).toContain(asset);
    });

    // Light is the default: anything that isn't exactly "dark" uses the light
    // logo rather than rendering a broken/undefined src.
    it.each(["light", "DARK", "midnight", ""])(
        "falls back to the light logo for theme %j",
        (theme) => {
            renderLogo({
                merchant_uuid: "x",
                theme,
                language: "en",
                origin: "",
                isLongTerm: false,
                countryCode: "US",
                numberOfPayments: 5,
                minPrice: 0,
                maxPrice: 2500,
            });
            const img = screen.getByAltText("Logo") as HTMLImageElement;
            expect(img.src).toContain("sezzle-horizontal-full-color.png");
        }
    );
});
