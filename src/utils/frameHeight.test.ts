import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FRAME_HEIGHT_KEY, startFrameHeightReporting } from "./frameHeight";

// jsdom has no layout or ResizeObserver: stub both, and drive resizes by hand.
let resize: () => void;
let disconnect: ReturnType<typeof vi.fn>;
let height: number;

class FakeResizeObserver {
  constructor(cb: () => void) {
    resize = cb;
  }
  observe() {
    resize();
  }
  disconnect() {
    disconnect();
  }
}

const parent = () =>
  ({ postMessage: vi.fn() }) as unknown as Window & {
    postMessage: ReturnType<typeof vi.fn>;
  };

beforeEach(() => {
  height = 0;
  disconnect = vi.fn();
  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  // Run the frame callback immediately. Returning 0 (no pending frame) mirrors
  // the state after a real, asynchronous frame has fired.
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.spyOn(document.documentElement, "getBoundingClientRect").mockImplementation(
    () => ({ height }) as DOMRect
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("startFrameHeightReporting", () => {
  it("reports the rounded-up content height as soon as it starts", () => {
    height = 1234.2;
    const target = parent();
    startFrameHeightReporting(target);
    expect(target.postMessage).toHaveBeenCalledWith(
      { key: FRAME_HEIGHT_KEY, height: 1235 },
      "*"
    );
  });

  // A narrower frame wraps copy and stacks grids, so the page gets taller (and
  // shorter again when widened); every change has to reach the parent.
  it("reports again whenever the height changes, in both directions", () => {
    height = 2400;
    const target = parent();
    startFrameHeightReporting(target);
    height = 3100;
    resize();
    height = 2400;
    resize();
    expect(target.postMessage.mock.calls.map(([m]) => m.height)).toEqual([
      2400, 3100, 2400,
    ]);
  });

  it("skips resizes that leave the height unchanged", () => {
    height = 2400;
    const target = parent();
    startFrameHeightReporting(target);
    resize();
    expect(target.postMessage).toHaveBeenCalledTimes(1);
  });

  it("stops observing when torn down", () => {
    const stop = startFrameHeightReporting(parent());
    stop();
    expect(disconnect).toHaveBeenCalled();
  });

  // Opened directly rather than embedded, there's no parent to size.
  it("does nothing outside a frame", () => {
    const observe = vi.spyOn(FakeResizeObserver.prototype, "observe");
    startFrameHeightReporting(window);
    expect(observe).not.toHaveBeenCalled();
  });
});
