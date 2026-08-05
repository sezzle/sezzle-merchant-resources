// Footnote markers, allocated in the order the disclosures appear in the
// footer. Markers shift when a disclosure is absent — with the in-store flow
// off, for example, the rescheduling note takes `§` rather than `**` — which is
// how the design keeps the sequence gapless across configurations.
//
// Callers must read markers from one `buildFootnotes` result so the copy
// carrying a marker and the disclosure defining it can never disagree.
const MARKER_SEQUENCE = ["*", "†", "‡", "§", "**", "††", "‡‡"];

export interface FootnoteFlags {
  // Pay-in-4 is always offered, but keep it explicit for symmetry.
  pi4: boolean;
  pi5: boolean;
  lt: boolean;
  virtualCard: boolean;
}

export interface Footnotes {
  creditCheck: string;
  pi4?: string;
  pi5?: string;
  lt?: string;
  virtualCard?: string;
  reschedule: string;
  sezzleUp: string;
}

export const buildFootnotes = ({
  pi4,
  pi5,
  lt,
  virtualCard,
}: FootnoteFlags): Footnotes => {
  let next = 0;
  const take = () => MARKER_SEQUENCE[next++] ?? "";

  // Order here IS the footer order — keep the two in step.
  const creditCheck = take();
  const pi4Marker = pi4 ? take() : undefined;
  const pi5Marker = pi5 ? take() : undefined;
  const ltMarker = lt ? take() : undefined;
  const virtualCardMarker = virtualCard ? take() : undefined;
  const reschedule = take();
  const sezzleUp = take();

  return {
    creditCheck,
    pi4: pi4Marker,
    pi5: pi5Marker,
    lt: ltMarker,
    virtualCard: virtualCardMarker,
    reschedule,
    sezzleUp,
  };
};
