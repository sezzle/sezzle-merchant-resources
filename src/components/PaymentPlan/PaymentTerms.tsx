// Footer disclosures. One paragraph per footnote, rendered in the same order
// the markers are allocated in `buildFootnotes`, so a marker in the body copy
// always resolves to the paragraph beneath it.
//
// The long-term paragraph is the one disclosure the design mock has no slot for
// (it has no long-term configuration); it takes the next marker in sequence.
import { ITranslation } from "../../interface";
import { ResolvedLTConfig, termMonthBounds } from "../../utils/ltConfig";
import { formatNumberForLocale } from "../../utils/price";
import { Footnotes, footnoteId } from "./footnotes";

interface PaymentTermsProps {
  translation: ITranslation;
  ltConfig: ResolvedLTConfig;
  lang: string;
  footnotes: Footnotes;
  // Pay-in-5 is hidden in Canada; its example line goes with it.
  showPI5: boolean;
}

const Term = ({
  marker,
  children,
  className = "",
}: {
  marker?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={`terms ${className}`.trim()}
    id={marker ? footnoteId(marker) : undefined}
  >
    {marker && <sup className="terms-marker">{marker}</sup>}
    {children}
  </p>
);

const PaymentTerms = ({
  translation,
  ltConfig,
  lang,
  footnotes,
  showPI5,
}: PaymentTermsProps) => {
  // APR range comes from the resolved LT config; term-month bounds derive from
  // the union of every termsToShow array. APR values render with the
  // locale-appropriate decimal separator.
  const bounds = termMonthBounds(ltConfig.termsToShow) || { min: "", max: "" };
  const ltTerms3 = translation.LTterms3.replace(
    "{minAPR}",
    formatNumberForLocale(ltConfig.minAPR, lang)
  )
    .replace("{maxAPR}", formatNumberForLocale(ltConfig.maxAPR, lang))
    .replace("{minTermMonths}", String(bounds.min))
    .replace("{maxTermMonths}", String(bounds.max));

  return (
    <div className="terms-container">
      <Term marker={footnotes.creditCheck}>
        {translation.footnoteCreditCheck}
      </Term>
      {/* The umbrella and its per-plan examples read as one disclosure, so
          they sit in a tighter group under a single marker. */}
      <div className="terms-group">
        <Term marker={footnotes.payLater}>{translation.footnotePayLater}</Term>
        <Term>{translation.footnotePayIn4}</Term>
        {showPI5 && <Term>{translation.footnotePayIn5}</Term>}
      </div>
      {footnotes.lt && (
        <Term marker={footnotes.lt} className="lt-terms">
          {ltTerms3}
        </Term>
      )}
      {footnotes.virtualCard && (
        <Term marker={footnotes.virtualCard}>
          {translation.footnoteVirtualCard}
        </Term>
      )}
      <Term marker={footnotes.reschedule}>{translation.footnoteReschedule}</Term>
      <Term marker={footnotes.sezzleUp}>{translation.footnoteSezzleUp}</Term>
    </div>
  );
};

export default PaymentTerms;
