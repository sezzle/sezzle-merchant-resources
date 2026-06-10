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

    // The logo is theme-driven only: light -> Color-Logo, dark ->
    // Color-White-Logo. Language no longer affects which asset is used, so each
    // language maps to the same theme-based asset.
    it.each([
        ["light", "en", "Color-Logo.svg"],
        ["light", "fr", "Color-Logo.svg"],
        ["light", "es", "Color-Logo.svg"],
        ["dark", "en", "Color-White-Logo.svg"],
        ["dark", "fr", "Color-White-Logo.svg"],
        ["dark", "es", "Color-White-Logo.svg"],
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
});
