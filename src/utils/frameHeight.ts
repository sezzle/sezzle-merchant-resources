// Reports the page's content height to the embedding page so it can size the
// iframe to fit. A fixed-height frame with its own scrollbar nests one scroller
// inside another: a scroll gesture latches onto the frame and stops dead at its
// edge, so the page looks finished partway down.
//
// The height depends on the frame's width (copy wraps, grids stack below the
// breakpoints), so this keeps reporting on every resize rather than once.
export const FRAME_HEIGHT_KEY = "about_sezzle_height";

// The <html> box is the content height, body margins included. Unlike
// scrollHeight it isn't floored at the frame's current viewport, so the frame
// can shrink as well as grow.
const contentHeight = (): number =>
  Math.ceil(document.documentElement.getBoundingClientRect().height);

export const startFrameHeightReporting = (
  target: Window = window.parent
): (() => void) => {
  if (target === window || typeof ResizeObserver === "undefined") {
    return () => {};
  }

  let last = -1;
  let frame = 0;
  const report = () => {
    frame = 0;
    const height = contentHeight();
    if (height === last) return;
    last = height;
    target.postMessage({ key: FRAME_HEIGHT_KEY, height }, "*");
  };

  // Coalesce bursts (FAQ panel transitions fire every frame) into one message
  // per animation frame.
  const observer = new ResizeObserver(() => {
    if (!frame) frame = requestAnimationFrame(report);
  });
  observer.observe(document.documentElement);

  return () => {
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
  };
};
