// Renders a translated string that carries a `{footnote}` token as text with a
// real <sup> marker in its place. Keeping the token inline means the sentence
// stays one translatable unit instead of being split around the marker.
import { ReactNode } from "react";
import { useConfig } from "../containers/ConfigProvider";
import { footnoteId } from "../components/PaymentPlan/footnotes";
import { interpolate } from "./interpolate";
import { scrollParentTo } from "./parentFrame";

const TOKEN = "{footnote}";

// A superscript marker that links to its footer disclosure, so the pairing is
// navigable and announced ("Footnote †") rather than read as a bare symbol.
// `inline` sets the marker at body size, for copy the design doesn't superscript.
export const FootnoteRef = ({
  marker,
  inline = false,
}: {
  marker?: string;
  inline?: boolean;
}) => {
  const { translation } = useConfig();
  if (!marker) return null;
  const Wrapper = inline ? "span" : "sup";
  const id = footnoteId(marker);
  return (
    <Wrapper
      className={`hsw-footnote-ref${inline ? " hsw-footnote-ref-inline" : ""}`}
    >
      {/* The default #hash navigation still runs (it moves the focus start
          point to the disclosure); the parent does the scrolling, since a
          fit-to-content frame has none of its own. */}
      <a
        href={`#${id}`}
        aria-label={interpolate(translation.footnoteRefLabel, { marker })}
        onClick={() => {
          const disclosure = document.getElementById(id);
          if (disclosure) scrollParentTo(disclosure);
        }}
      >
        {marker}
      </a>
    </Wrapper>
  );
};

export const withFootnote = (
  template: string,
  marker: string | undefined,
  { inline = false }: { inline?: boolean } = {}
): ReactNode => {
  const [before, ...rest] = template.split(TOKEN);
  // No token (or no marker to place): render the copy as-is, minus any token.
  if (rest.length === 0) return template;
  const after = rest.join(TOKEN);
  if (!marker) return before + after;
  return (
    <>
      {before}
      <FootnoteRef marker={marker} inline={inline} />
      {after}
    </>
  );
};
