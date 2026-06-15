// Long-term monthly installment cards + the "See details" feature accordion,
// ported from generateMonthlyCard / generateMonthlyInner in
// sezzle-widget-react's MultiPlanModal.js.
import { useState } from "react";
import { ITranslation } from "../../interface";
import {
  addDelimiters,
  calculateMonthlyWithInterest,
} from "../../utils/renderFunctions";
import { selectTermsToShow, ResolvedLTConfig } from "../../utils/ltConfig";
import { parsePrice, formatNumberForLocale } from "../../utils/price";
import { FeatureCheckIcon, ChevronDownIcon, ChevronUpIcon } from "./icons";

interface MonthlyCardsProps {
  currency: string;
  priceString: string;
  ltConfig: ResolvedLTConfig;
  translation: ITranslation;
  lang: string;
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
}: {
  months: number;
  currency: string;
  priceString: string;
  medianAPR: number;
  translation: ITranslation;
  lang: string;
}) => {
  const monthly = calculateMonthlyWithInterest(priceString, months, medianAPR);
  const total = monthly * months;
  const interest = total - Number(priceString);
  const aprDisplay = formatNumberForLocale(medianAPR, lang);

  return (
    <div className="payment-card monthly-installment-card" data-months={months}>
      <div className="plan-summary">
        <div className="purple">
          <div className="left">
            <span className="price monthly-amount" data-months={months}>
              {formatLTAmount(currency, monthly)}
            </span>
            <span className="due" aria-label={translation.LTperMonth}>
              <span aria-hidden="true">{translation.LTmonthlyAmount}</span>
            </span>
          </div>
          <div className="right">
            <span className="pill">
              {months} {translation.LTtermLength}
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

const FeaturesAccordion = ({ translation }: { translation: ITranslation }) => {
  const [expanded, setExpanded] = useState(false);
  const label = expanded ? translation.LThideDetails : translation.LTseeDetails;

  return (
    <div className="features-accordion">
      <div className="accordion-title-bar">
        <span className="accordion-title" aria-hidden="true">
          {label}
        </span>
        <button
          className="accordion-icon accordion-toggle"
          aria-expanded={expanded}
          aria-controls="features-drawer"
          aria-label={label}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>
      <div
        id="features-drawer"
        className="features-drawer"
        style={expanded ? undefined : { display: "none" }}
      >
        <div className="single-feature">
          <div>
            <FeatureCheckIcon />
          </div>
          <span
            dangerouslySetInnerHTML={{
              __html: translation.LTsingleFeatureAffordable,
            }}
          />
        </div>
        <div className="single-feature">
          <div>
            <FeatureCheckIcon />
          </div>
          <span
            dangerouslySetInnerHTML={{
              __html: translation.LTsingleFeaturePrequalify,
            }}
          />
        </div>
        <div className="single-feature">
          <div>
            <FeatureCheckIcon />
          </div>
          <span
            dangerouslySetInnerHTML={{
              __html: translation.LTsingleFeatureTrusted,
            }}
          />
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
        />
      ))}
      <FeaturesAccordion translation={translation} />
    </>
  );
};

export default MonthlyCards;
