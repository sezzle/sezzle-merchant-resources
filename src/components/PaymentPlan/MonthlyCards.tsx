// Long-term monthly installment cards, ported from generateMonthlyCard /
// generateMonthlyInner in sezzle-widget-react's MultiPlanModal.js.
import { ITranslation } from "../../interface";
import {
  addDelimiters,
  calculateMonthlyWithInterest,
} from "../../utils/renderFunctions";
import { selectTermsToShow, ResolvedLTConfig } from "../../utils/ltConfig";
import { parsePrice, formatNumberForLocale } from "../../utils/price";
import { Footnotes } from "./footnotes";

interface MonthlyCardsProps {
  currency: string;
  priceString: string;
  ltConfig: ResolvedLTConfig;
  translation: ITranslation;
  lang: string;
  footnotes: Footnotes;
}

const formatLTAmount = (currency: string, value: number) =>
  currency + addDelimiters(value);

const MonthlyCard = ({
  months,
  currency,
  priceString,
  medianAPR,
  translation,
  lang,
  footnotes,
}: {
  months: number;
  currency: string;
  priceString: string;
  medianAPR: number;
  translation: ITranslation;
  lang: string;
  footnotes: Footnotes;
}) => {
  const monthly = calculateMonthlyWithInterest(priceString, months, medianAPR);
  const total = monthly * months;
  const interest = total - Number(priceString);
  const aprDisplay = formatNumberForLocale(medianAPR, lang);

  return (
    <div className="payment-card monthly-installment-card" data-months={months}>
      {/* Same head shape as the bi-weekly blocks: term on the left, amount on
          the right. */}
      <div className="plan-summary">
        <div className="purple hsw-plan-head">
          <h3 className="hsw-plan-label">
            {months} {translation.LTtermLength}
          </h3>
          <div className="hsw-plan-values">
            <span
              className="price monthly-amount hsw-plan-amount"
              data-months={months}
            >
              {formatLTAmount(currency, monthly)}
            </span>{" "}
            <span
              className="due hsw-plan-today"
              aria-label={translation.LTperMonth}
            >
              <span aria-hidden="true">
                {translation.LTmonthlyAmount}
                <sup className="hsw-footnote-ref">{footnotes.lt}</sup>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="plan-details monthly-plan-details">
        <div
          className="monthly-detail-row"
          aria-label={`${translation.LTreadApr} ${aprDisplay} ${translation.LTpercent}`}
        >
          <span className="detail-label" aria-hidden="true">
            {translation.LTsampleApr}
          </span>
          <span className="detail-value monthly-apr" aria-hidden="true">
            {aprDisplay}%
          </span>
        </div>
        <div className="monthly-detail-row">
          <span className="detail-label">{translation.LTinterest}</span>
          <span className="detail-value monthly-interest" data-months={months}>
            {formatLTAmount(currency, interest)}
          </span>
        </div>
        <div className="monthly-detail-row">
          <span className="detail-label">{translation.LTadjustedTotal}</span>
          <span className="detail-value monthly-total" data-months={months}>
            {formatLTAmount(currency, total)}
          </span>
        </div>
      </div>
    </div>
  );
};

const MonthlyCards = ({
  currency,
  priceString,
  ltConfig,
  translation,
  lang,
  footnotes,
}: MonthlyCardsProps) => {
  const terms = selectTermsToShow(parsePrice(priceString), ltConfig.termsToShow) || [];

  return (
    <>
      {terms.map((months) => (
        <MonthlyCard
          key={months}
          months={months}
          currency={currency}
          priceString={priceString}
          medianAPR={ltConfig.medianAPR}
          translation={translation}
          lang={lang}
          footnotes={footnotes}
        />
      ))}
    </>
  );
};

export default MonthlyCards;
