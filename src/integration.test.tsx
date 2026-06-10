import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import App from "./App";
import { ConfigProvider } from "./containers/ConfigProvider";
import enTranslation from "./translations/en.json";
import frTranslation from "./translations/fr.json";
import esTranslation from "./translations/es.json";

// The only network call the widget makes is the about-sezzle onload event log.
const installFetchMock = () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.includes("/v1/event/log")) {
            return { ok: true } as Response;
        }
        throw new Error(`Unexpected fetch: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
};

const postConfig = (config: Record<string, unknown>) => {
    act(() => {
        window.dispatchEvent(
            new MessageEvent("message", {
                data: { key: "about_sezzle_config", ...config },
                origin: "https://shop.example.com",
            })
        );
    });
};

const renderWidget = () =>
    render(
        <ConfigProvider>
            <App />
        </ConfigProvider>
    );

const BASE = { merchant_uuid: "fc99cfc7-5772-4b36-826c-f27a2b87a8b7" };

describe("how-sezzle-works widget (integration)", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("renders nothing before a config message arrives (matches index.tsx behavior)", () => {
        installFetchMock();
        const { container } = renderWidget();
        expect(container.querySelector(".sezzle-container")).toBeNull();
    });

    it("renders the English widget once config arrives", async () => {
        installFetchMock();
        renderWidget();
        postConfig({ ...BASE, theme: "dark", language: "en", isLongTerm: true });

        expect(
            await screen.findByRole("heading", { name: enTranslation.ctaHeader })
        ).toBeInTheDocument();
        expect(screen.getByText(enTranslation.MultiPlanheader)).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: enTranslation.ctaButton })
        ).toHaveAttribute("href", "https://sezzle.com/app");
        expect(screen.getByText(enTranslation.review1Header)).toBeInTheDocument();
        expect(screen.getByText(enTranslation.review2Header)).toBeInTheDocument();
    });

    it("renders the French widget when language=fr", async () => {
        installFetchMock();
        renderWidget();
        postConfig({ ...BASE, theme: "light", language: "fr", isLongTerm: false });

        expect(
            await screen.findByRole("heading", { name: frTranslation.ctaHeader })
        ).toBeInTheDocument();
        expect(screen.getByText(frTranslation.MultiPlanheader)).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: frTranslation.ctaButton })
        ).toBeInTheDocument();
    });

    it("renders the Spanish widget when language=es", async () => {
        installFetchMock();
        renderWidget();
        postConfig({ ...BASE, theme: "light", language: "es", isLongTerm: false });

        expect(
            await screen.findByRole("heading", { name: esTranslation.ctaHeader })
        ).toBeInTheDocument();
        expect(screen.getByText(esTranslation.MultiPlanheader)).toBeInTheDocument();
    });

    it("applies the dark theme class when theme=dark", async () => {
        installFetchMock();
        const { container } = renderWidget();
        postConfig({ ...BASE, theme: "dark", language: "en", isLongTerm: false });

        await screen.findByRole("heading", { name: enTranslation.ctaHeader });
        expect(container.querySelector(".sezzle-container-dark")).not.toBeNull();
    });

    it("hides long-term monthly cards when countryCode is CA", async () => {
        installFetchMock();
        const { container } = renderWidget();
        postConfig({
            ...BASE,
            theme: "light",
            language: "en",
            isLongTerm: true,
            countryCode: "CA",
        });

        await screen.findByRole("heading", { name: enTranslation.ctaHeader });
        expect(container.querySelector(".payment-cards-monthly")).toBeNull();
    });
});
