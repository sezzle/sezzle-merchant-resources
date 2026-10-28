// Footnote markers, allocated in the order the disclosures appear in the
// footer. Markers shift when a disclosure is absent — with the in-store flow
// off, for example, the rescheduling note takes `‡` rather than `§` — which is
// how the design keeps the sequence gapless across configurations.
//
// Callers must read markers from one `buildFootnotes` result so the copy
// carrying a marker and the disclosure defining it can never disagree.
const MARKER_SEQUENCE = ["*", "†", "‡", "§", "**", "††", "‡‡"];

// DOM id of the footer disclosure a marker points at. Keyed on the marker's
// position in the sequence, since the symbols themselves aren't valid in a
// URL fragment.
export const footnoteId = (marker: string): string =>
  `hsw-fn-${MARKER_SEQUENCE.indexOf(marker) + 1}`;

export interface FootnoteFlags {
  lt: boolean;
  virtualCard: boolean;
}

export interface Footnotes {
  creditCheck: string;
  // One marker for the whole pay-later disclosure: the WebBank-approved
  // umbrella paragraph plus its Pay-in-4 / Pay-in-5 examples. Both plan rows,
  // the hero's repayment period and the service-fee note all point at it.
  payLater: string;
  lt?: string;
  virtualCard?: string;
  reschedule: string;
  sezzleUp: string;
}

export const buildFootnotes = ({
  lt,
  virtualCard,
}: FootnoteFlags): Footnotes => {
  let next = 0;
  const take = () => MARKER_SEQUENCE[next++] ?? "";

  // Order here IS the footer order — keep the two in step.
  const creditCheck = take();
  const payLater = take();
  const ltMarker = lt ? take() : undefined;
  const virtualCardMarker = virtualCard ? take() : undefined;
  const reschedule = take();
  const sezzleUp = take();

  return {
    creditCheck,
    payLater,
    lt: ltMarker,
    virtualCard: virtualCardMarker,
    reschedule,
    sezzleUp,
  };
};
