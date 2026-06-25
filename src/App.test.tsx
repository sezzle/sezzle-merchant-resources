import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import enTranslation from "./translations/en.json";
import { interpolate } from "./utils/interpolate";
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

    it("renders the app-promo heading and the desktop Get-the-app link", () => {
        installFetchMock();
        render(wrap(baseConfig, <App />));
        expect(
            screen.getByRole("heading", { name: enTranslation.appTitle })
        ).toBeInTheDocument();
        // jsdom reports a desktop user agent, so the single "Get The App" CTA
        // (pointing at sezzle.com/app) renders instead of the store badges.
        expect(
            screen.getByRole("link", { name: enTranslation.appGetTheApp })
        ).toHaveAttribute("href", "https://sezzle.com/app");
    });

    it("links to the native store listings on mobile", () => {
        const originalUA = navigator.userAgent;
        Object.defineProperty(navigator, "userAgent", {
            value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
            configurable: true,
        });
        try {
            installFetchMock();
            render(wrap(baseConfig, <App />));
            expect(
                screen.getByRole("link", { name: enTranslation.appStore })
            ).toHaveAttribute(
                "href",
                "https://apps.apple.com/us/app/sezzle-buy-now-pay-later/id1434922495"
            );
            expect(
                screen.getByRole("link", { name: enTranslation.googlePlay })
            ).toHaveAttribute(
                "href",
                "https://play.google.com/store/apps/details?id=com.sezzle.sezzlemobile"
            );
        } finally {
            Object.defineProperty(navigator, "userAgent", {
                value: originalUA,
                configurable: true,
            });
        }
    });

    it("renders the hero headline and falls back to the merchant origin's hostname for merchant name", () => {
        installFetchMock();
        render(wrap(baseConfig, <App />));
        expect(
            screen.getByRole("heading", { name: enTranslation.heroHeadline })
        ).toBeInTheDocument();
        // With no merchantName configured, merchant-name templates fall back to
        // the hostname of the parent (merchant) origin — NOT the iframe host.
        const expectedCopyright = interpolate(enTranslation.footerCopyright, {
            merchantName: new URL(baseConfig.origin).hostname,
        });
        expect(screen.getByText(expectedCopyright)).toBeInTheDocument();
    });

    it("personalizes merchant-name copy and points Shop Now at the merchant origin, breaking out of the iframe", () => {
        installFetchMock();
        render(wrap({ ...baseConfig, merchantName: "Maple & Pine" }, <App />));
        // Footer copy is personalized with the configured merchant name.
        const expectedCopyright = interpolate(enTranslation.footerCopyright, {
            merchantName: "Maple & Pine",
        });
        expect(screen.getByText(expectedCopyright)).toBeInTheDocument();
        // Every plain "Shop Now" CTA (header + hero) targets the parent
        // (merchant) origin, and uses target="_top" so it escapes the iframe.
        const shopLinks = screen.getAllByRole("link", {
            name: enTranslation.heroShopNow,
        });
        expect(shopLinks.length).toBeGreaterThan(0);
        shopLinks.forEach((link) => {
            expect(link).toHaveAttribute("href", baseConfig.origin);
            expect(link).toHaveAttribute("target", "_top");
        });
    });

    it("renders the FAQ accordion with the first item open", () => {
        installFetchMock();
        render(wrap(baseConfig, <App />));
        expect(
            screen.getByRole("heading", { name: enTranslation.faqTitle })
        ).toBeInTheDocument();
        const first = screen.getByRole("button", { name: enTranslation.faq1Q });
        expect(first.getAttribute("aria-expanded")).toBe("true");
        const last = screen.getByRole("button", { name: enTranslation.faq5Q });
        expect(last.getAttribute("aria-expanded")).toBe("false");
    });

    it("collapses the open FAQ item and switches between items on click", async () => {
        installFetchMock();
        const user = userEvent.setup();
        render(wrap(baseConfig, <App />));
        const first = screen.getByRole("button", { name: enTranslation.faq1Q });
        const second = screen.getByRole("button", { name: enTranslation.faq2Q });

        // First item is open by default; clicking it collapses (no item open).
        expect(first.getAttribute("aria-expanded")).toBe("true");
        await user.click(first);
        expect(first.getAttribute("aria-expanded")).toBe("false");

        // Opening another item closes the previously focused one.
        await user.click(second);
        expect(second.getAttribute("aria-expanded")).toBe("true");
        expect(first.getAttribute("aria-expanded")).toBe("false");
    });

    it("renders the How it Works section as three step cards", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        expect(
            screen.getByRole("heading", { name: enTranslation.hiwTitle })
        ).toBeInTheDocument();
        expect(container.querySelectorAll(".hsw-step-card").length).toBe(3);
        expect(screen.getByText(enTranslation.hiwStep1Title)).toBeInTheDocument();
        expect(screen.getByText(enTranslation.hiwStep2Title)).toBeInTheDocument();
        expect(screen.getByText(enTranslation.hiwStep3Title)).toBeInTheDocument();
        expect(
            container.querySelectorAll(".hsw-step-badge .step-image svg").length
        ).toBe(3);
    });

    it("renders the trusted tagline in the hero, not the calculator card", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        expect(container.querySelector(".hsw-trusted")?.textContent).toContain(
            enTranslation.MultiPlantrusted
        );
        expect(container.querySelector(".hsw-calc-card .hsw-trusted")).toBeNull();
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
        expect(screen.getByLabelText(enTranslation.calcAmountLabel)).toHaveValue("$150");
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

    // Class names starting with a digit can't be passed to querySelector
    // unescaped, so assert on the card pill text instead.
    const pillTexts = (container: HTMLElement) =>
        Array.from(container.querySelectorAll(".pill")).map((p) => p.textContent ?? "");

    it("hides the Pay-in-5 row in Canada", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, countryCode: "CA" }, <App />)
        );
        const pills = pillTexts(container);
        expect(pills.some((t) => t.includes("Pay in 4"))).toBe(true);
        expect(pills.some((t) => t.includes("Pay in 5"))).toBe(false);
    });

    it("shows the Pay-in-5 row by default (US, numberOfPayments 5)", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        expect(pillTexts(container).some((t) => t.includes("Pay in 5"))).toBe(true);
    });

    it("shows the Pay-in-5 below-minimum note for amounts under $50", async () => {
        installFetchMock();
        const user = userEvent.setup();
        const { container } = render(wrap(baseConfig, <App />));
        const input = screen.getByLabelText(enTranslation.calcAmountLabel);
        await user.clear(input);
        await user.type(input, "$30");
        const expected = interpolate(enTranslation.payBelowMin, { min: "$50" });
        expect(
            Array.from(container.querySelectorAll(".hsw-plan-below")).some(
                (el) => el.textContent === expected
            )
        ).toBe(true);
    });

    it("parses grouped input and drives the bi-weekly amount ($1,000.00 -> $250.00 per Pay-in-4)", async () => {
        installFetchMock();
        const user = userEvent.setup();
        render(wrap({ ...baseConfig, isLongTerm: true }, <App />));
        const input = screen.getByLabelText(enTranslation.calcAmountLabel);
        await user.clear(input);
        await user.type(input, "$1,000.00");

        expect((input as HTMLInputElement).className).not.toContain("input-error");
        // 1000 / 4 = 250.00 on the Pay-in-4 timeline (header + steps).
        expect(screen.getAllByText("$250.00").length).toBeGreaterThan(0);
    });

    it("flags an out-of-range amount with the error class", async () => {
        installFetchMock();
        const user = userEvent.setup();
        render(wrap({ ...baseConfig, isLongTerm: true }, <App />));
        const input = screen.getByLabelText(enTranslation.calcAmountLabel);
        await user.clear(input);
        await user.type(input, "20000"); // above the LT max (15000)

        expect((input as HTMLInputElement).className).toContain("input-error");
    });
});
