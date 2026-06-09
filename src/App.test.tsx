import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import enTranslation from "./translations/en.json";
import {
    ConfigContext,
    deriveConfigContext,
    type AppConfig,
} from "./containers/ConfigProvider";
import type { ReactNode } from "react";

const SERVER_URL = import.meta.env.VITE_WIDGET_SERVER_URL;

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

interface FetchHandlers {
    isDirectIntegration?: boolean;
    onEventLog?: (body: unknown) => void;
}

// Country is now merchant-provided via config, so the only network calls are
// the event log and the merchant-details lookup.
const installFetchMock = ({
    isDirectIntegration = false,
    onEventLog,
}: FetchHandlers = {}) => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.includes("/v1/event/log")) {
            if (onEventLog && init?.body) {
                onEventLog(JSON.parse(init.body as string));
            }
            return { ok: true } as Response;
        }
        if (url.startsWith(`${SERVER_URL}/v1/merchants/`)) {
            return {
                ok: true,
                json: async () => ({
                    is_direct_integration_merchant: isDirectIntegration,
                }),
            } as Response;
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

    it("renders the header and CTA once data is loaded", async () => {
        installFetchMock();
        render(wrap(baseConfig, <App />));
        expect(
            await screen.findByRole("heading", { level: 1, name: enTranslation.header })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: enTranslation.ctaButton })
        ).toHaveAttribute("href", "https://sezzle.com/app");
    });

    it("dispatches an onload event after loading completes", async () => {
        const eventLogged = vi.fn();
        installFetchMock({ onEventLog: eventLogged });
        render(wrap(baseConfig, <App />));
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        await waitFor(() => expect(eventLogged).toHaveBeenCalled());
        expect(eventLogged).toHaveBeenCalledWith([
            expect.objectContaining({
                event_name: "about-sezzle-onload",
                merchant_site: baseConfig.origin,
                merchant_uuid: baseConfig.merchant_uuid,
            }),
        ]);
    });

    it("applies the dark theme class when theme is not light", async () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, theme: "dark" }, <App />)
        );
        await waitFor(() =>
            expect(container.querySelector(".sezzle-container-dark")).not.toBeNull()
        );
    });

    it("defaults the amount input to the long-term minimum ($150) when long-term is enabled", async () => {
        installFetchMock();
        render(wrap({ ...baseConfig, isLongTerm: true }, <App />));
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(screen.getByLabelText(enTranslation.MultiPlanAmount)).toHaveValue("$150");
    });

    it("shows long-term monthly cards when isLongTerm is true outside of Canada", async () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, isLongTerm: true }, <App />)
        );
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector(".payment-cards-monthly")).not.toBeNull();
    });

    it("hides long-term monthly cards in Canada even when isLongTerm is true", async () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, isLongTerm: true, countryCode: "CA" }, <App />)
        );
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector(".payment-cards-monthly")).toBeNull();
    });

    // Class names starting with a digit (e.g. "5-pay-installment-card") can't be
    // passed to querySelector unescaped, so assert on the card pill text instead.
    const pillTexts = (container: HTMLElement) =>
        Array.from(container.querySelectorAll(".pill")).map((p) => p.textContent ?? "");

    it("hides the Pay-in-5 card in Canada", async () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, countryCode: "CA" }, <App />)
        );
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        const pills = pillTexts(container);
        expect(pills.some((t) => t.includes("Pay in 4"))).toBe(true);
        expect(pills.some((t) => t.includes("Pay in 5"))).toBe(false);
    });

    it("shows the Pay-in-5 card by default (US, numberOfPayments 5)", async () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(pillTexts(container).some((t) => t.includes("Pay in 5"))).toBe(true);
    });

    it("renders Canadian terms (term1 + term3) when countryCode is CA", async () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, countryCode: "CA" }, <App />)
        );
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector(".CAterms")).not.toBeNull();
        expect(container.querySelector("#term1")).not.toBeNull();
        expect(container.querySelector("#term3")).not.toBeNull();
    });

    it("renders US terms (term2) by default", async () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector(".USterms")).not.toBeNull();
        expect(container.querySelector("#term2")).not.toBeNull();
    });

    it("renders no-service-fee terms for direct integration merchants", async () => {
        installFetchMock({ isDirectIntegration: true });
        const { container } = render(wrap(baseConfig, <App />));
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector("#term1")?.textContent).toBe(
            enTranslation.term1noServiceFee
        );
    });
});
