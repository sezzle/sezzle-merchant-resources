import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentPlan from "./index";
import enTranslation from "../../translations/en.json";
import {
    ConfigContext,
    deriveConfigContext,
    type AppConfig,
} from "../../containers/ConfigProvider";
import type { ReactNode } from "react";

// Long-term enabled (US) so the monthly cards + features accordion render and
// the input's upper bound is the LT max (15000), letting us exercise grouped
// input above the bi-weekly max.
const ltConfig: AppConfig = {
    merchant_uuid: "m",
    theme: "light",
    language: "en",
    origin: "",
    isLongTerm: true,
    countryCode: "US",
    numberOfPayments: 5,
    minPrice: 0,
    maxPrice: 2500,
};

const wrap = (config: AppConfig, children: ReactNode) => (
    <ConfigContext.Provider
        value={{ config, translation: enTranslation, ...deriveConfigContext(config) }}
    >
        {children}
    </ConfigContext.Provider>
);

describe("PaymentPlan", () => {
    beforeEach(() => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("parses grouped input and drives the bi-weekly amount ($1,000.00 -> $250.00 per Pay-in-4)", async () => {
        const user = userEvent.setup();
        render(wrap(ltConfig, <PaymentPlan />));
        const input = screen.getByLabelText(enTranslation.MultiPlanAmount);
        await user.clear(input);
        await user.type(input, "$1,000.00");

        expect((input as HTMLInputElement).className).not.toContain("input-error");
        // 1000 / 4 = 250.00 on the Pay-in-4 card.
        expect(screen.getAllByText("$250.00").length).toBeGreaterThan(0);
    });

    it("flags an out-of-range amount with the error class", async () => {
        const user = userEvent.setup();
        render(wrap(ltConfig, <PaymentPlan />));
        const input = screen.getByLabelText(enTranslation.MultiPlanAmount);
        await user.clear(input);
        await user.type(input, "20000"); // above the LT max (15000)

        expect((input as HTMLInputElement).className).toContain("input-error");
    });

    it("advances the how-to-pay carousel when the next arrow is clicked", async () => {
        const user = userEvent.setup();
        const { container } = render(wrap(ltConfig, <PaymentPlan />));
        expect(container.querySelector(".carousel.position-1")).not.toBeNull();

        await user.click(screen.getByLabelText(enTranslation.nextSlide));
        expect(container.querySelector(".carousel.position-2")).not.toBeNull();
    });

    it("toggles the long-term features accordion", async () => {
        const user = userEvent.setup();
        render(wrap(ltConfig, <PaymentPlan />));
        const toggle = screen.getByRole("button", { name: enTranslation.LTseeDetails });
        expect(toggle.getAttribute("aria-expanded")).toBe("false");

        await user.click(toggle);
        expect(toggle.getAttribute("aria-expanded")).toBe("true");
    });
});
