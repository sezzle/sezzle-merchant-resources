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
    includeInStore: false,
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

// The headline breaks across lines, which the accessible name joins with a
// space — so expectations flatten the newlines in the copy.
const headlineName = (merchantName: string) =>
    interpolate(enTranslation.heroHeadline, { merchantName }).replace(/\n/g, " ");

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

    const withUserAgent = (value: string, run: () => void) => {
        const originalUA = navigator.userAgent;
        Object.defineProperty(navigator, "userAgent", {
            value,
            configurable: true,
        });
        try {
            run();
        } finally {
            Object.defineProperty(navigator, "userAgent", {
                value: originalUA,
                configurable: true,
            });
        }
    };

    const IOS_UA =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15";
    const ANDROID_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36";
    const APP_STORE_HREF =
        "https://apps.apple.com/us/app/sezzle-buy-now-pay-later/id1434922495";
    const GOOGLE_PLAY_HREF =
        "https://play.google.com/store/apps/details?id=com.sezzle.sezzlemobile";

    // The single CTA deep-links to the viewer's own store listing on mobile.
    it.each([
        ["iOS", IOS_UA, APP_STORE_HREF],
        ["Android", ANDROID_UA, GOOGLE_PLAY_HREF],
    ])("points the app CTA at the %s listing on mobile", (_label, ua, href) => {
        withUserAgent(ua, () => {
            installFetchMock();
            render(wrap(baseConfig, <App />));
            expect(
                screen.getByRole("link", { name: enTranslation.appGetTheApp })
            ).toHaveAttribute("href", href);
        });
    });

    // Both rating pills link to their store regardless of device, so neither
    // listing depends on the user-agent sniff being right.
    it("renders both store-rating pills with score, stars and review count", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        const pills = Array.from(
            container.querySelectorAll<HTMLAnchorElement>(".hsw-rating-pill")
        );
        expect(pills.map((p) => p.getAttribute("href"))).toEqual([
            APP_STORE_HREF,
            GOOGLE_PLAY_HREF,
        ]);
        expect(
            pills.map((p) => p.querySelector(".hsw-rating-score")?.textContent)
        ).toEqual([
            enTranslation.appStoreRating,
            enTranslation.googlePlayRating,
        ]);
        expect(
            pills.map((p) => p.querySelector(".hsw-rating-count")?.textContent)
        ).toEqual([
            enTranslation.appStoreRatingsCount,
            enTranslation.googlePlayRatingsCount,
        ]);
        // Five stars each, labelled for assistive tech.
        pills.forEach((pill) => {
            expect(pill.querySelectorAll(".hsw-rating-stars svg").length).toBe(5);
        });
        expect(
            screen.getByRole("img", {
                name: interpolate(enTranslation.appRatingStarsLabel, {
                    rating: enTranslation.googlePlayRating,
                }),
            })
        ).toBeInTheDocument();
        // 4.5 renders four solid stars plus one half star (gradient-filled).
        const playStars = pills[1].querySelectorAll(".hsw-rating-stars svg");
        expect(playStars[4].querySelector("linearGradient")).not.toBeNull();
        expect(playStars[3].querySelector("linearGradient")).toBeNull();
    });

    it("stamps the ratings with their as-of date", () => {
        installFetchMock();
        render(wrap(baseConfig, <App />));
        expect(
            screen.getByText(
                interpolate(enTranslation.appRatingsAsOf, { date: "07/2026" })
            )
        ).toBeInTheDocument();
    });

    it("renders the hero headline and falls back to the merchant origin's hostname for merchant name", () => {
        installFetchMock();
        render(wrap(baseConfig, <App />));
        // With no merchantName configured, merchant-name templates fall back to
        // the hostname of the parent (merchant) origin — NOT the iframe host.
        const hostname = new URL(baseConfig.origin).hostname;
        expect(
            screen.getByRole("heading", {
                level: 1,
                name: headlineName(hostname),
            })
        ).toBeInTheDocument();
        const expectedCopyright = interpolate(enTranslation.footerCopyright, {
            merchantName: hostname,
        });
        expect(screen.getByText(expectedCopyright)).toBeInTheDocument();
    });

    // Neither a merchantName nor a usable origin: personalized copy falls back
    // to the localized "your store" rather than leaving a gap in the sentence.
    it("falls back to the localized store placeholder with no name or origin", () => {
        installFetchMock();
        render(wrap({ ...baseConfig, origin: "" }, <App />));
        expect(
            screen.getByRole("heading", {
                level: 1,
                name: headlineName(enTranslation.merchantFallback),
            })
        ).toBeInTheDocument();
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
        const last = screen.getByRole("button", { name: enTranslation.faq4Q });
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

    // includeInStore defaults to false, so the online-only section stays
    // unlabelled — no channel group headings to disambiguate.
    it("omits the in-store steps and channel labels by default", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        expect(container.querySelectorAll(".hsw-hiw-group-title").length).toBe(0);
        expect(
            screen.queryByText(enTranslation.hiwInStore1Title)
        ).not.toBeInTheDocument();
        expect(container.querySelector(".hsw-step-link")).toBeNull();
        // Online-only subcopy, personalized with the merchant.
        expect(
            screen.getByText(
                interpolate(enTranslation.hiwSubcopy, {
                    merchantName: "shop.example.com",
                })
            )
        ).toBeInTheDocument();
    });

    it("adds a labelled in-store step group when includeInStore is true", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, includeInStore: true }, <App />)
        );
        // Two groups of three: online steps, then the app/virtual-card steps.
        expect(container.querySelectorAll(".hsw-step-card").length).toBe(6);
        const groups = Array.from(
            container.querySelectorAll(".hsw-hiw-group-title")
        ).map((el) => el.textContent);
        expect(groups).toEqual([
            enTranslation.hiwOnlineGroupTitle,
            enTranslation.hiwInStoreGroupTitle,
        ]);
        expect(
            screen.getByText(enTranslation.hiwInStore1Title)
        ).toBeInTheDocument();
        expect(
            screen.getByText(enTranslation.hiwInStore2Title)
        ).toBeInTheDocument();
        expect(
            screen.getByText(enTranslation.hiwInStore3Title)
        ).toBeInTheDocument();
        // Both flows restart their step numbering at 1.
        const stepNums = Array.from(
            container.querySelectorAll(".hsw-step-num")
        ).map((el) => el.textContent);
        expect(stepNums).toEqual([
            "Step 1",
            "Step 2",
            "Step 3",
            "Step 1",
            "Step 2",
            "Step 3",
        ]);
    });

    it("swaps in the both-channels subcopy and personalizes the in-store copy", () => {
        installFetchMock();
        render(
            wrap(
                {
                    ...baseConfig,
                    includeInStore: true,
                    merchantName: "Crow's Capes",
                },
                <App />
            )
        );
        expect(
            screen.getByText(
                interpolate(enTranslation.hiwSubcopyInStore, {
                    merchantName: "Crow's Capes",
                })
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                interpolate(enTranslation.hiwInStore1Body, {
                    merchantName: "Crow's Capes",
                })
            )
        ).toBeInTheDocument();
    });

    // The group heading takes <h3>, so step titles drop to <h4> to keep the
    // outline under the section <h2> contiguous.
    it("keeps the heading outline contiguous in both in-store modes", () => {
        installFetchMock();
        const online = render(wrap(baseConfig, <App />));
        expect(
            online.container.querySelectorAll(".hsw-hiw h3.hsw-step-title").length
        ).toBe(3);
        online.unmount();

        const both = render(wrap({ ...baseConfig, includeInStore: true }, <App />));
        expect(
            both.container.querySelectorAll(".hsw-hiw h3.hsw-hiw-group-title").length
        ).toBe(2);
        expect(
            both.container.querySelectorAll(".hsw-hiw h4.hsw-step-title").length
        ).toBe(6);
    });

    it("points the in-store 'Get the app' link at the Sezzle app page", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, includeInStore: true }, <App />)
        );
        const link = container.querySelector(".hsw-step-link") as HTMLAnchorElement;
        expect(link).not.toBeNull();
        expect(link.textContent).toBe(enTranslation.appGetTheApp);
        expect(link.getAttribute("href")).toBe("https://sezzle.com/app");
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

    // Each plan block is titled "{n} Payments", which also carries the
    // pay-later disclosure marker.
    const planLabels = (container: HTMLElement) =>
        Array.from(container.querySelectorAll(".hsw-plan-label")).map(
            (p) => p.textContent ?? ""
        );
    const planLabel = (count: number) =>
        interpolate(enTranslation.calcPlanPayments, { count });

    it("hides the Pay-in-5 row in Canada", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, countryCode: "CA" }, <App />)
        );
        const labels = planLabels(container);
        expect(labels.some((t) => t.startsWith(planLabel(4)))).toBe(true);
        expect(labels.some((t) => t.startsWith(planLabel(5)))).toBe(false);
    });

    it("shows the Pay-in-5 row by default (US, numberOfPayments 5)", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        expect(
            planLabels(container).some((t) => t.startsWith(planLabel(5)))
        ).toBe(true);
    });

    const markerRefs = (c: HTMLElement) =>
        Array.from(c.querySelectorAll(".hsw-footnote-ref")).map(
            (el) => el.textContent
        );
    const markerDefs = (c: HTMLElement) =>
        Array.from(
            c.querySelectorAll(".hsw-footer-disclosures .terms-marker")
        ).map((el) => el.textContent);

    // Markers are allocated in footer order, so the set that appears in the body
    // copy must always equal the set defined beneath it — and stay gapless.
    it("pairs each footnote marker with its footer disclosure", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, includeInStore: true }, <App />)
        );
        // credit check, pay later, virtual card, reschedule, Sezzle Up.
        const expected = ["*", "†", "‡", "§", "**"];
        expect(markerDefs(container)).toEqual(expected);
        // Sezzle Up is referenced inline in the FAQ answer, not as a <sup>.
        expect(new Set(markerRefs(container))).toEqual(
            new Set(expected.filter((m) => m !== "**"))
        );
        expect(container.textContent).toContain("Sezzle Up,**");
    });

    // With in-store off, the virtual-card disclosure drops out and the later
    // markers shift up to close the gap.
    it("shifts markers up when earlier disclosures drop out", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, countryCode: "CA" }, <App />)
        );
        // credit check, pay later, reschedule, Sezzle Up.
        expect(markerDefs(container)).toEqual(["*", "†", "‡", "§"]);
        expect(new Set(markerRefs(container))).toEqual(new Set(["*", "†", "‡"]));
        expect(container.textContent).toContain("Sezzle Up,§");
    });

    // Long-term slots in after the pay-later disclosure and pushes the rest along.
    it("allocates a marker to the long-term disclosure when it renders", () => {
        installFetchMock();
        const { container } = render(
            wrap({ ...baseConfig, isLongTerm: true, includeInStore: true }, <App />)
        );
        expect(markerDefs(container)).toEqual([
            "*",
            "†",
            "‡",
            "§",
            "**",
            "††",
        ]);
        // The long-term paragraph took ‡, so the monthly amount carries it too.
        expect(
            container.querySelector(".monthly-installment-card .hsw-footnote-ref")
                ?.textContent
        ).toBe("‡");
    });

    it("includes the virtual-card disclosure only with the in-store flow", () => {
        installFetchMock();
        const online = render(wrap(baseConfig, <App />));
        expect(online.container.textContent).not.toContain(
            "The Sezzle Virtual Card is issued by WebBank"
        );
        online.unmount();

        const both = render(wrap({ ...baseConfig, includeInStore: true }, <App />));
        expect(both.container.textContent).toContain(
            "The Sezzle Virtual Card is issued by WebBank"
        );
    });

    // Both plan examples sit under the one pay-later marker; the Pay-in-5 line
    // goes wherever Pay-in-5 itself is hidden.
    it("lists the Pay-in-5 example under the pay-later disclosure only where offered", () => {
        installFetchMock();
        const us = render(wrap(baseConfig, <App />));
        expect(us.container.textContent).toContain(enTranslation.footnotePayLater);
        expect(us.container.textContent).toContain(enTranslation.footnotePayIn4);
        expect(us.container.textContent).toContain(enTranslation.footnotePayIn5);
        us.unmount();

        const ca = render(wrap({ ...baseConfig, countryCode: "CA" }, <App />));
        expect(ca.container.textContent).toContain(enTranslation.footnotePayIn4);
        expect(ca.container.textContent).not.toContain(
            enTranslation.footnotePayIn5
        );
    });

    // The repayment period and service fees are trigger terms, so the copy
    // stating them points at the pay-later disclosure.
    it("marks the service-fee note and repayment period with the pay-later marker", () => {
        installFetchMock();
        const { container } = render(wrap(baseConfig, <App />));
        expect(
            container.querySelector(".hsw-calc-fee-note .hsw-footnote-ref")
                ?.textContent
        ).toBe("†");
        expect(container.textContent).toContain("8 weeks for Pay in 5.†");
    });

    // Long-term raises the valid input ceiling well past the bi-weekly maxPrice,
    // so an in-range amount can be ineligible for Pay in 4 / Pay in 5.
    it("notes the bi-weekly ceiling instead of a schedule above maxPrice", async () => {
        installFetchMock();
        const user = userEvent.setup();
        const { container } = render(
            wrap({ ...baseConfig, isLongTerm: true }, <App />)
        );
        const input = screen.getByLabelText(enTranslation.calcAmountLabel);
        await user.clear(input);
        await user.type(input, "$5000");

        // Neither bi-weekly plan may claim a schedule at this amount.
        expect(container.querySelectorAll(".hsw-plan-steps").length).toBe(0);
        const notes = Array.from(
            container.querySelectorAll(".hsw-plan-below")
        ).map((el) => el.textContent);
        expect(notes).toEqual([
            interpolate(enTranslation.payBelowMax, { max: "$2500" }),
            interpolate(enTranslation.payRange, { min: "$50", max: "$2500" }),
        ]);
        // The long-term monthly cards are what IS available here.
        expect(container.querySelector(".payment-cards-monthly")).not.toBeNull();
    });

    // Without long-term, amounts over maxPrice are rejected at the input, so the
    // only reachable Pay-in-5 note is the below-minimum one.
    it("keeps the minimum-only Pay-in-5 note when long-term is off", async () => {
        installFetchMock();
        const user = userEvent.setup();
        const { container } = render(wrap(baseConfig, <App />));
        const input = screen.getByLabelText(enTranslation.calcAmountLabel);
        await user.clear(input);
        await user.type(input, "$30");
        expect(
            container.querySelector(".hsw-plan-below")?.textContent
        ).toBe(interpolate(enTranslation.payBelowMin, { min: "$50" }));
    });

    // With long-term on, the same below-minimum state states the whole window.
    it("states the full bi-weekly window below minimum when long-term is on", async () => {
        installFetchMock();
        const user = userEvent.setup();
        const { container } = render(
            wrap({ ...baseConfig, isLongTerm: true }, <App />)
        );
        const input = screen.getByLabelText(enTranslation.calcAmountLabel);
        await user.clear(input);
        await user.type(input, "$30");
        expect(
            container.querySelector(".hsw-plan-below")?.textContent
        ).toBe(interpolate(enTranslation.payRange, { min: "$50", max: "$2500" }));
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
