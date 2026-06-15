// Modal disclaimer terms, ported from generateTermsInner in
// sezzle-widget-react's MultiPlanModal.js. Shows the WebBank example (PI4/PI5
// variant) when bi-weekly is eligible and the long-term APR/term disclaimer
// when long-term is eligible.
import { ITranslation } from "../../interface";
import { ResolvedLTConfig, termMonthBounds } from "../../utils/ltConfig";
import { formatNumberForLocale } from "../../utils/price";
import { Eligibility } from "./index";

interface PaymentTermsProps {
  eligibility: Eligibility;
  translation: ITranslation;
  ltConfig: ResolvedLTConfig;
  lang: string;
}

const PaymentTerms = ({
  eligibility,
  translation,
  ltConfig,
  lang,
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

  const productTerms = eligibility.pi5
    ? translation.webBankTermsPI5
    : translation.webBankTermsPI4;

  return (
    <div className="terms-container">
      <p className="terms">
        <span>{translation.terms1}</span>
        <br />
        <span dangerouslySetInnerHTML={{ __html: translation.termsHiw }} />
      </p>
      <p className="terms">{translation.terms2}</p>
      {eligibility.pi4 && (
        <p className="terms">
          <span className="webbank-terms">
            {translation.webBankTerms} {productTerms}
          </span>
          <br />
          <span
            dangerouslySetInnerHTML={{ __html: translation.linkToCompleteTerms }}
          />
        </p>
      )}
      {eligibility.lt && <p className="terms lt-terms">{ltTerms3}</p>}
    </div>
  );
};

export default PaymentTerms;
