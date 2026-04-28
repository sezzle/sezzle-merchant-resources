import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import enTranslation from "./translations/en.json";
import {
    ConfigContext,
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
};

interface FetchHandlers {
    countryCode?: string;
    countryCodeFails?: boolean;
    isDirectIntegration?: boolean;
    onEventLog?: (body: unknown) => void;
}

const installFetchMock = ({
    countryCode = "US",
    countryCodeFails = false,
    isDirectIntegration = false,
    onEventLog,
}: FetchHandlers = {}) => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.includes("/v1/geoip/ipdetails")) {
            if (countryCodeFails) {
                return { ok: false, text: async () => "" } as Response;
            }
            return {
                ok: true,
                text: async () => JSON.stringify({ country_iso_code: countryCode }),
            } as Response;
        }
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
    <ConfigContext.Provider value={{ config, translation: enTranslation }}>
        {children}
    </ConfigContext.Provider>
);

describe("App", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
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

    it("shows the long-term notice when isLongTerm is true outside of Canada", async () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, isLongTerm: true }, <App />)
        );
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector(".long-term-text")).not.toBeNull();
    });

    it("hides the long-term notice in Canada", async () => {
        installFetchMock({ countryCode: "CA" });
        const { container } = render(
            wrap({ ...baseConfig, isLongTerm: true }, <App />)
        );
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector(".long-term-text")).toBeNull();
    });

    it("renders Canadian terms (term1 + term3) when GeoIP returns CA", async () => {
        installFetchMock({ countryCode: "CA" });
        const { container } = render(wrap(baseConfig, <App />));
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

    it("falls back to US country code when GeoIP fails", async () => {
        installFetchMock({ countryCodeFails: true });
        const { container } = render(wrap(baseConfig, <App />));
        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector(".USterms")).not.toBeNull();
    });
});
