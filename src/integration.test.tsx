import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import App from "./App";
import { ConfigProvider } from "./containers/ConfigProvider";
import enTranslation from "./translations/en.json";
import frTranslation from "./translations/fr.json";
import esTranslation from "./translations/es.json";

const SERVER_URL = import.meta.env.VITE_WIDGET_SERVER_URL;

interface FetchHandlers {
    isDirectIntegration?: boolean;
}

const installFetchMock = ({
    isDirectIntegration = false,
}: FetchHandlers = {}) => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.includes("/v1/event/log")) {
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

describe("how-sezzle-works widget (integration)", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
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

    it("renders the English widget once config + merchant details resolve", async () => {
        installFetchMock();
        renderWidget();
        postConfig({
            merchant_uuid: "fc99cfc7-5772-4b36-826c-f27a2b87a8b7",
            theme: "dark",
            language: "en",
            isLongTerm: true,
        });

        expect(
            await screen.findByRole("heading", { level: 1, name: enTranslation.header })
        ).toBeInTheDocument();
        expect(screen.getByText(enTranslation.subHeader)).toBeInTheDocument();
        expect(screen.getByText(enTranslation.cartInfo)).toBeInTheDocument();
        expect(screen.getByText(/Choose Sezzle at checkout/)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: enTranslation.ctaButton })).toHaveAttribute(
            "href",
            "https://sezzle.com/app"
        );
        expect(screen.getByText(enTranslation.review1Header)).toBeInTheDocument();
        expect(screen.getByText(enTranslation.review2Header)).toBeInTheDocument();
    });

    it("renders the French widget when language=fr", async () => {
        installFetchMock();
        renderWidget();
        postConfig({
            merchant_uuid: "fc99cfc7-5772-4b36-826c-f27a2b87a8b7",
            theme: "light",
            language: "fr",
            isLongTerm: false,
        });

        expect(
            await screen.findByRole("heading", { level: 1, name: frTranslation.header })
        ).toBeInTheDocument();
        expect(screen.getByText(frTranslation.subHeader)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: frTranslation.ctaButton })).toBeInTheDocument();
    });

    it("renders the Spanish widget when language=es", async () => {
        installFetchMock();
        renderWidget();
        postConfig({
            merchant_uuid: "fc99cfc7-5772-4b36-826c-f27a2b87a8b7",
            theme: "light",
            language: "es",
            isLongTerm: false,
        });

        expect(
            await screen.findByRole("heading", { level: 1, name: esTranslation.header })
        ).toBeInTheDocument();
        expect(screen.getByText(esTranslation.subHeader)).toBeInTheDocument();
    });

    it("applies the dark theme class when theme=dark", async () => {
        installFetchMock();
        const { container } = renderWidget();
        postConfig({
            merchant_uuid: "fc99cfc7-5772-4b36-826c-f27a2b87a8b7",
            theme: "dark",
            language: "en",
            isLongTerm: false,
        });

        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector(".sezzle-container-dark")).not.toBeNull();
    });

    it("renders Canadian terms and hides long-term cards when countryCode is CA", async () => {
        installFetchMock();
        const { container } = renderWidget();
        postConfig({
            merchant_uuid: "fc99cfc7-5772-4b36-826c-f27a2b87a8b7",
            theme: "light",
            language: "en",
            isLongTerm: true,
            countryCode: "CA",
        });

        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector(".CAterms")).not.toBeNull();
        expect(container.querySelector(".payment-cards-monthly")).toBeNull();
    });

    it("renders no-service-fee terms for direct integration merchants", async () => {
        installFetchMock({ isDirectIntegration: true });
        const { container } = renderWidget();
        postConfig({
            merchant_uuid: "fc99cfc7-5772-4b36-826c-f27a2b87a8b7",
            theme: "light",
            language: "en",
            isLongTerm: false,
        });

        await screen.findByRole("heading", { level: 1, name: enTranslation.header });
        expect(container.querySelector("#term1")?.textContent).toBe(
            enTranslation.term1noServiceFee
        );
    });
});
