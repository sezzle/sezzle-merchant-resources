import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCountryCode } from "./countryCode";
import { GEO_IP_BASE_URL } from "../constants";

describe("getCountryCode", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns the ISO country code from the GeoIP response", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify({ country_iso_code: "US" }),
        });
        vi.stubGlobal("fetch", fetchMock);

        const code = await getCountryCode();

        expect(code).toBe("US");
        expect(fetchMock).toHaveBeenCalledWith(
            `${GEO_IP_BASE_URL}/v1/geoip/ipdetails`,
            expect.objectContaining({ method: "GET" })
        );
    });

    it("logs an error and returns undefined when country_iso_code is absent", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify({}),
        });
        vi.stubGlobal("fetch", fetchMock);

        const code = await getCountryCode();

        expect(code).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith("Cannot fetch the country code");
    });

    it("throws when the response is not ok", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            text: async () => "",
        });
        vi.stubGlobal("fetch", fetchMock);

        await expect(getCountryCode()).rejects.toThrow(
            "Something went wrong, contact the Sezzle team!"
        );
    });
});
