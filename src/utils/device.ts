// Lightweight client-side device check used to route the app-download CTA:
// on mobile we link straight to the native App Store / Google Play listings;
// on desktop a single "Get the app" button points at sezzle.com/app.
export const isMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
};
