// Renders a translated string that carries a `{footnote}` token as text with a
// real <sup> marker in its place. Keeping the token inline means the sentence
// stays one translatable unit instead of being split around the marker.
import { ReactNode } from "react";

const TOKEN = "{footnote}";

export const withFootnote = (
  template: string,
  marker: string | undefined
): ReactNode => {
  const [before, ...rest] = template.split(TOKEN);
  // No token (or no marker to place): render the copy as-is, minus any token.
  if (rest.length === 0) return template;
  const after = rest.join(TOKEN);
  if (!marker) return before + after;
  return (
    <>
      {before}
      <sup className="hsw-footnote-ref">{marker}</sup>
      {after}
    </>
  );
};
