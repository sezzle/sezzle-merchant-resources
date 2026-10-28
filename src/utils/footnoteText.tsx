// Renders a translated string that carries a `{footnote}` token as text with a
// real <sup> marker in its place. Keeping the token inline means the sentence
// stays one translatable unit instead of being split around the marker.
import { ReactNode } from "react";
import { useConfig } from "../containers/ConfigProvider";
import { footnoteId } from "../components/PaymentPlan/footnotes";
import { interpolate } from "./interpolate";

const TOKEN = "{footnote}";

// A superscript marker that links to its footer disclosure, so the pairing is
// navigable and announced ("Footnote †") rather than read as a bare symbol.
export const FootnoteRef = ({ marker }: { marker?: string }) => {
  const { translation } = useConfig();
  if (!marker) return null;
  return (
    <sup className="hsw-footnote-ref">
      <a
        href={`#${footnoteId(marker)}`}
        aria-label={interpolate(translation.footnoteRefLabel, { marker })}
      >
        {marker}
      </a>
    </sup>
  );
};

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
      <FootnoteRef marker={marker} />
      {after}
    </>
  );
};
