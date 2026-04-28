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
        expect(typeof result.current.translation.header).toBe("string");
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
        });
    });
});

describe("useConfig", () => {
    it("throws when used outside of ConfigProvider", () => {
        expect(() => renderHook(() => useConfig())).toThrow(
            "useConfig must be used within a ConfigProvider"
        );
    });
});
