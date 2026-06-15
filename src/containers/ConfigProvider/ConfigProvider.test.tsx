import { describe, it, expect } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import { ConfigProvider, useConfig } from "./index";

const postConfig = (data: Record<string, unknown>) => {
    act(() => {
        window.dispatchEvent(
            new MessageEvent("message", {
                data: { key: "about_sezzle_config", ...data },
                origin: "https://example.com",
            })
        );
    });
};

describe("ConfigProvider", () => {
    it("renders nothing until a config message is received", () => {
        render(
            <ConfigProvider>
                <div data-testid="child">child</div>
            </ConfigProvider>
        );
        expect(screen.queryByTestId("child")).toBeNull();
    });

    it("renders children once a config message is received", () => {
        render(
            <ConfigProvider>
                <div data-testid="child">child</div>
            </ConfigProvider>
        );
        postConfig({
            merchant_uuid: "abc",
            theme: "dark",
            language: "fr",
            isLongTerm: true,
        });
        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("ignores messages with an unrelated key", () => {
        render(
            <ConfigProvider>
                <div data-testid="child">child</div>
            </ConfigProvider>
        );
        act(() => {
            window.dispatchEvent(
                new MessageEvent("message", { data: { key: "other" } })
            );
        });
        expect(screen.queryByTestId("child")).toBeNull();
    });

    it("exposes config and translation through useConfig", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ConfigProvider>{children}</ConfigProvider>
        );
        const { result } = renderHook(() => useConfig(), { wrapper });

        postConfig({
            merchant_uuid: "abc",
            theme: "dark",
            language: "fr",
            isLongTerm: true,
        });

        expect(result.current.config).toMatchObject({
            merchant_uuid: "abc",
            theme: "dark",
            language: "fr",
            isLongTerm: true,
        });
        expect(typeof result.current.translation.ctaHeader).toBe("string");
    });

    it("falls back to defaults when fields are missing", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ConfigProvider>{children}</ConfigProvider>
        );
        const { result } = renderHook(() => useConfig(), { wrapper });

        postConfig({});

        expect(result.current.config).toMatchObject({
            merchant_uuid: "",
            theme: "light",
            language: "en",
            isLongTerm: false,
            countryCode: "US",
            numberOfPayments: 5,
        });
        expect(result.current.effectiveNumberOfPayments).toBe(5);
        expect(result.current.isCA).toBe(false);
        // Long-term disabled (no LTgroup / minPriceLT / isLongTerm).
        expect(result.current.ltConfig.minPriceLT).toBe(0);
    });

    it("gates Pay-in-5 and long-term off for Canada", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ConfigProvider>{children}</ConfigProvider>
        );
        const { result } = renderHook(() => useConfig(), { wrapper });

        postConfig({
            merchant_uuid: "abc",
            countryCode: "CA",
            isLongTerm: true,
        });

        expect(result.current.isCA).toBe(true);
        expect(result.current.effectiveNumberOfPayments).toBe(4);
        expect(result.current.ltConfig.minPriceLT).toBe(0);
    });

    it("enables long-term via isLongTerm alone (group a backcompat)", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ConfigProvider>{children}</ConfigProvider>
        );
        const { result } = renderHook(() => useConfig(), { wrapper });

        postConfig({ merchant_uuid: "abc", isLongTerm: true });

        expect(result.current.ltConfig.minPriceLT).toBe(150);
        expect(result.current.ltConfig.medianAPR).toBe(21.99);
    });
});

describe("useConfig", () => {
    it("throws when used outside of ConfigProvider", () => {
        expect(() => renderHook(() => useConfig())).toThrow(
            "useConfig must be used within a ConfigProvider"
        );
    });
});
