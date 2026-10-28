// Parses the parent page's origin (config.origin, the postMessage event.origin)
// into a URL we can safely link to. An opaque parent (sandboxed iframe,
// file://) reports the literal string "null", which `new URL` rejects; anything
// that isn't http(s) is equally unusable as a "Shop Now" target. Both cases
// return undefined so callers fall back instead of throwing during render.
export const parseParentOrigin = (origin: string): URL | undefined => {
  try {
    const url = new URL(origin);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url
      : undefined;
  } catch {
    return undefined;
  }
};
