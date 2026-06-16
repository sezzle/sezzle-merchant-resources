import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import enTranslation from "./translations/en.json";
import {
    ConfigContext,
    deriveConfigContext,
    type AppConfig,
} from "./containers/ConfigProvider";
import type { ReactNode } from "react";

const baseConfig: AppConfig = {
    merchant_uuid: "merchant-1",
    theme: "light",
    language: "en",
    origin: "https://shop.example.com",
    isLongTerm: false,
    countryCode: "US",
    numberOfPayments: 5,
    minPrice: 0,
    maxPrice: 2500,
};

// The only network call the app makes is the about-sezzle onload event log.
const installFetchMock = (onEventLog?: (body: unknown) => void) => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.includes("/v1/event/log")) {
            if (onEventLog && init?.body) {
                onEventLog(JSON.parse(init.body as string));
            }
            return { ok: true } as Response;
        }
        throw new Error(`Unexpected fetch: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
};

const wrap = (config: AppConfig, children: ReactNode) => (
    <ConfigContext.Provider
        value={{
            config,
            translation: enTranslation,
            ...deriveConfigContext(config),
        }}
    >
        {children}
    </ConfigContext.Provider>
);

describe("App", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("renders the CTA heading and download link", () => {
        installFetchMock();
        render(wrap(baseConfig, <App />));
        expect(
            screen.getByRole("heading", { name: enTranslation.ctaHeader })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: enTranslation.ctaButton })
        ).toHaveAttribute("href", "https://sezzle.com/app");
    });

    it("renders the payment-plan header and customer reviews", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        // The header copy contains non-breaking spaces; compare on collapsed whitespace.
        expect(
            container.querySelector(".payment-plan-header")?.textContent?.replace(/\s+/g, " ")
        ).toBe(enTranslation.MultiPlanheader.replace(/\s+/g, " "));
        expect(screen.getByText(enTranslation.review1Header)).toBeInTheDocument();
        expect(screen.getByText(enTranslation.review2Header)).toBeInTheDocument();
    });

    it("renders the How it Works section built from the carousel steps", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        expect(
            screen.getByRole("heading", { name: enTranslation.subHeader })
        ).toBeInTheDocument();
        const cards = container.querySelectorAll(".card-area .info-card");
        expect(cards.length).toBe(3);
        expect(screen.getByText(enTranslation.MultiPlanStep1)).toBeInTheDocument();
        expect(screen.getByText(enTranslation.MultiPlanStep2)).toBeInTheDocument();
        expect(screen.getByText(enTranslation.MultiPlanStep3)).toBeInTheDocument();
        // Each card shows its step illustration in place of the old icon.
        expect(
            container.querySelectorAll(".card-area .step-image svg").length
        ).toBe(3);
    });

    it("renders the trusted tagline outside the payment-plan section", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        const trusted = container.querySelector(".trusted");
        expect(trusted?.textContent).toBe(enTranslation.MultiPlantrusted);
        // The tagline was lifted out of .sezzle-payment-plan to sit under the logo.
        expect(container.querySelector(".sezzle-payment-plan .trusted")).toBeNull();
    });

    it("labels the logo region with the localized alt text", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        expect(
            container.querySelector(
                `.sezzle-logo[aria-label="${enTranslation.logoAltText}"]`
            )
        ).not.toBeNull();
    });

    it("dispatches an about-sezzle onload event", async () => {
        const eventLogged = vi.fn();
        installFetchMock(eventLogged);
        render(wrap(baseConfig, <App />));
        await waitFor(() => expect(eventLogged).toHaveBeenCalled());
        expect(eventLogged).toHaveBeenCalledWith([
            expect.objectContaining({
                event_name: "about-sezzle-onload",
                merchant_site: baseConfig.origin,
                merchant_uuid: baseConfig.merchant_uuid,
            }),
        ]);
    });

    it("applies the dark theme class when theme is not light", () => {
        installFetchMock();
        const { container } = render(wrap({ ...baseConfig, theme: "dark" }, <App />));
        expect(container.querySelector(".sezzle-container-dark")).not.toBeNull();
    });

    it("defaults the amount input to $150", () => {
        installFetchMock();
        render(wrap({ ...baseConfig, isLongTerm: true }, <App />));
        expect(screen.getByLabelText(enTranslation.MultiPlanAmount)).toHaveValue("$150");
    });

    it("shows long-term monthly cards when isLongTerm is true outside of Canada", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, isLongTerm: true }, <App />)
        );
        expect(container.querySelector(".payment-cards-monthly")).not.toBeNull();
    });

    it("hides long-term monthly cards in Canada even when isLongTerm is true", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, isLongTerm: true, countryCode: "CA" }, <App />)
        );
        expect(container.querySelector(".payment-cards-monthly")).toBeNull();
    });

    // Class names starting with a digit (e.g. "5-pay-installment-card") can't be
    // passed to querySelector unescaped, so assert on the card pill text instead.
    const pillTexts = (container: HTMLElement) =>
        Array.from(container.querySelectorAll(".pill")).map((p) => p.textContent ?? "");

    it("hides the Pay-in-5 card in Canada", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, countryCode: "CA" }, <App />)
        );
        const pills = pillTexts(container);
        expect(pills.some((t) => t.includes("Pay in 4"))).toBe(true);
        expect(pills.some((t) => t.includes("Pay in 5"))).toBe(false);
    });

    it("shows the Pay-in-5 card by default (US, numberOfPayments 5)", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        expect(pillTexts(container).some((t) => t.includes("Pay in 5"))).toBe(true);
    });

    it("parses grouped input and drives the bi-weekly amount ($1,000.00 -> $250.00 per Pay-in-4)", async () => {
        installFetchMock();
        const user = userEvent.setup();
        render(wrap({ ...baseConfig, isLongTerm: true }, <App />));
        const input = screen.getByLabelText(enTranslation.MultiPlanAmount);
        await user.clear(input);
        await user.type(input, "$1,000.00");

        expect((input as HTMLInputElement).className).not.toContain("input-error");
        // 1000 / 4 = 250.00 on the Pay-in-4 card.
        expect(screen.getAllByText("$250.00").length).toBeGreaterThan(0);
    });

    it("flags an out-of-range amount with the error class", async () => {
        installFetchMock();
        const user = userEvent.setup();
        render(wrap({ ...baseConfig, isLongTerm: true }, <App />));
        const input = screen.getByLabelText(enTranslation.MultiPlanAmount);
        await user.clear(input);
        await user.type(input, "20000"); // above the LT max (15000)

        expect((input as HTMLInputElement).className).toContain("input-error");
    });

    it("toggles the long-term features accordion", async () => {
        installFetchMock();
        const user = userEvent.setup();
        render(wrap({ ...baseConfig, isLongTerm: true }, <App />));
        const toggle = screen.getByRole("button", { name: enTranslation.LTseeDetails });
        expect(toggle.getAttribute("aria-expanded")).toBe("false");

        await user.click(toggle);
        expect(toggle.getAttribute("aria-expanded")).toBe("true");
    });
});
