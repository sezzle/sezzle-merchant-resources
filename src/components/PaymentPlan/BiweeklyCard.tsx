// Bi-weekly (Pay-in-4 / Pay-in-5) plan block: a header row (per-installment
// amount + plan pill) above a dot timeline showing every installment. The
// per-installment amount is price / numberOfPayments (never the long-term
// monthly amount): passing minPriceLT/maxPriceLT = 0 to getFormattedPrice
// forces the non-LT branch even for LT-eligible prices.
import { ITranslation } from "../../interface";
import { getFormattedPrice } from "../../utils/renderFunctions";

interface BiweeklyCardProps {
  numberOfPayments: number;
  currency: string;
  priceString: string;
  translation: ITranslation;
}

const BiweeklyCard = ({
  numberOfPayments,
  currency,
  priceString,
  translation,
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
      i === 0
        ? translation.today
        : `${i * 2} ${translation.MultiPlanweeks}`;
    steps.push(
      <div className="hsw-step" key={i}>
        <div className={`hsw-dot${i === 0 ? " is-first" : ""}`} />
        <div className="hsw-step-amt">{installmentPrice}</div>
        <div className="hsw-step-when">{when}</div>
      </div>
    );
  }

  return (
    <div className="hsw-plan">
      <div className="hsw-plan-head">
        <div className="hsw-plan-headline">
          <span className={`hsw-plan-amount${isPI5 ? " is-pi5" : ""}`}>
            {installmentPrice}
          </span>
          <span className="hsw-plan-today">{translation.today}</span>
        </div>
        <span className={`pill hsw-plan-pill${isPI5 ? " is-pi5" : ""}`}>
          {translation.MultiPlanpayIn} {numberOfPayments}
          {isPI5 && <sup>TM</sup>}
        </span>
      </div>
      <div
        className="hsw-timeline"
        style={{ "--cols": numberOfPayments } as React.CSSProperties}
      >
        <div className="hsw-timeline-line" />
        {steps}
      </div>
    </div>
  );
};

export default BiweeklyCard;
