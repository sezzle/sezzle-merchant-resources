// Bi-weekly (Pay-in-4 / Pay-in-5) plan block: a header row pairing the plan
// name (left, carrying the footnote marker for its WebBank example) with the
// per-installment amount (right), above a progress track and the installment
// schedule. The per-installment amount is price / numberOfPayments (never the
// long-term monthly amount): passing minPriceLT/maxPriceLT = 0 to
// getFormattedPrice forces the non-LT branch even for LT-eligible prices.
import { ITranslation } from "../../interface";
import { getFormattedPrice } from "../../utils/renderFunctions";
import { interpolate } from "../../utils/interpolate";
import { Footnotes } from "./footnotes";

interface BiweeklyCardProps {
  numberOfPayments: number;
  currency: string;
  priceString: string;
  translation: ITranslation;
  footnotes: Footnotes;
}

const BiweeklyCard = ({
  numberOfPayments,
  currency,
  priceString,
  translation,
  footnotes,
}: BiweeklyCardProps) => {
  const isPI5 = numberOfPayments === 5;
  const installmentPrice = getFormattedPrice(
    currency + priceString,
    numberOfPayments,
    0,
    0,
    0,
    null
  );

  const steps = [];
  for (let i = 0; i < numberOfPayments; i++) {
    const when =
      i === 0 ? translation.today : `${i * 2} ${translation.MultiPlanweeks}`;
    steps.push(
      <div className="hsw-step" key={i}>
        <div className="hsw-step-amt">{installmentPrice}</div>
        <div className="hsw-step-when">{when}</div>
      </div>
    );
  }

  return (
    <div className="hsw-plan">
      <div className="hsw-plan-head">
        <h3 className="hsw-plan-label">
          {interpolate(translation.calcPlanPayments, {
            count: numberOfPayments,
          })}
          <sup className="hsw-footnote-ref">
            {isPI5 ? footnotes.pi5 : footnotes.pi4}
          </sup>
        </h3>
        <div className="hsw-plan-values">
          <span className="hsw-plan-amount">{installmentPrice}</span>{" "}
          <span className="hsw-plan-today">{translation.calcTodayInline}</span>
        </div>
      </div>
      {/* Only the first installment is paid now, so the track fills 1/n.
          Decorative — the schedule below states the same thing in text. */}
      <div className="hsw-progress" aria-hidden="true">
        <div
          className="hsw-progress-fill"
          style={{ width: `${100 / numberOfPayments}%` }}
        />
      </div>
      <div
        className="hsw-plan-steps"
        style={{ "--cols": numberOfPayments } as React.CSSProperties}
      >
        {steps}
      </div>
    </div>
  );
};

export default BiweeklyCard;
