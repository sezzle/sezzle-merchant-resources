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

    it.each([
        ["light", "en"],
        ["light", "fr"],
        ["light", "es"],
        ["dark", "en"],
        ["dark", "fr"],
        ["dark", "es"],
    ])("renders the %s/%s logo when configured", (theme, language) => {
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
        expect(img.src).toContain(`${theme}-${language}`);
    });
});
