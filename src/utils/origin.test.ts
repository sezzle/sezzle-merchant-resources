import { describe, it, expect } from "vitest";
import { parseParentOrigin } from "./origin";

describe("parseParentOrigin", () => {
  it.each(["https://shop.example.com", "http://localhost:3000"])(
    "accepts the http(s) origin %j",
    (origin) => {
      expect(parseParentOrigin(origin)?.origin).toBe(origin);
    }
  );

  // "null" is what an opaque parent (sandboxed iframe, file://) reports.
  it.each(["", "null", "not a url", "file:///tmp/x.html", "javascript:alert(1)"])(
    "rejects %j",
    (origin) => {
      expect(parseParentOrigin(origin)).toBeUndefined();
    }
  );
});
