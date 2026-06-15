import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendEvent } from "./api";

const SERVER_URL = import.meta.env.VITE_WIDGET_SERVER_URL;

describe("sendEvent", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("POSTs the event payload to the widget server", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal("fetch", fetchMock);

        const body = [{ event_name: "test", description: "x" }];
        sendEvent(body);
        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());

        expect(fetchMock).toHaveBeenCalledWith(
            `${SERVER_URL}/v1/event/log`,
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            })
        );
    });

    it("logs an error when the response is not ok", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: false });
        vi.stubGlobal("fetch", fetchMock);

        sendEvent([]);
        await vi.waitFor(() =>
            expect(console.error).toHaveBeenCalledWith(
                "Error sending event:",
                expect.any(Error)
            )
        );
    });
});
