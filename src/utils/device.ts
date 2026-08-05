// Lightweight client-side device checks used to route the app-download CTA:
// on mobile it deep-links to the viewer's own store listing, on desktop it
// points at sezzle.com/app. Both rating pills link to their store regardless,
// so neither listing depends on this sniff being right.
export const isMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
};

export const isIOSDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};
