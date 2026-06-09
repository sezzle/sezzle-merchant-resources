// Bi-weekly (Pay-in-4 / Pay-in-5) payment card, ported from
// generateBiweeklyCard in sezzle-widget-react's MultiPlanModal.js.
import { ITranslation } from "../../interface";
import { getFormattedPrice } from "../../utils/renderFunctions";
import { DotIcon } from "./icons";

interface BiweeklyCardProps {
  numberOfPayments: number;
  currency: string;
  priceString: string;
  translation: ITranslation;
}

// One installment's connector graphic (left dash, dot, right dash). The dashes
// hide at the ends and the middle ones grow taller, mirroring the modal.
const InstallmentGraphic = ({
  index,
  numberOfPayments,
  classModifier,
  dashWidth,
}: {
  index: number;
  numberOfPayments: number;
  classModifier: string;
  dashWidth: number;
}) => {
  const isFirst = index === 0;
  const isLast = index === numberOfPayments - 1;
  const isMiddle = index > 0 && index < numberOfPayments - 1;
  const rectX = dashWidth === 30 ? "0.75" : "0.399994";
  const rightHeight = isMiddle ? 16 : 2;

  return (
    <div className="graphic">
      <div className={`dash left ${classModifier}`}>
        <svg
          width={dashWidth}
          height="2"
          viewBox={`0 0 ${dashWidth} 2`}
          fill="#E8E8E8"
          xmlns="http://www.w3.org/2000/svg"
          style={isFirst ? { visibility: "hidden" } : undefined}
        >
          <rect x={rectX} width={dashWidth} height="2" fill="#E8E8E8" />
        </svg>
      </div>
      <div className="dot">
        <DotIcon />
      </div>
      <div className={`dash right ${classModifier}`}>
        <svg
          width={dashWidth}
          height={rightHeight}
          viewBox={`0 0 ${dashWidth} ${rightHeight}`}
          fill="#E8E8E8"
          xmlns="http://www.w3.org/2000/svg"
          style={isLast ? { visibility: "hidden" } : undefined}
        >
          <rect
            x={rectX}
            y={isMiddle ? "7" : undefined}
            width={dashWidth}
            height="2"
            fill="#E8E8E8"
          />
        </svg>
      </div>
    </div>
  );
};

const BiweeklyCard = ({
  numberOfPayments,
  currency,
  priceString,
  translation,
}: BiweeklyCardProps) => {
  const classModifier = numberOfPayments === 4 ? "fourth" : "fifth";
  const dashWidth = numberOfPayments === 4 ? 30 : 22;
  // Biweekly cards always show the bi-weekly installment (price / numberOfPayments),
  // never the long-term monthly amount. Passing minPriceLT/maxPriceLT = 0 forces
  // getFormattedPrice down the non-LT branch even for LT-eligible prices.
  const installmentPrice = getFormattedPrice(
    currency + priceString,
    numberOfPayments,
    0,
    0,
    0,
    null
  );

  const installments = [];
  for (let i = 0; i < numberOfPayments; i++) {
    const isFirst = i === 0;
    const weekNumber = i * 2;
    const dueText = isFirst
      ? translation.today
      : `${weekNumber} ${translation.MultiPlanweeks}`;
    installments.push(
      <div className="installment" key={i}>
        <InstallmentGraphic
          index={i}
          numberOfPayments={numberOfPayments}
          classModifier={classModifier}
          dashWidth={dashWidth}
        />
        <div className={`detail${isFirst ? " first-installment" : ""}`}>
          <div className={`amount ${numberOfPayments}-pay-installment`}>
            {installmentPrice}
          </div>
          <div className="due">{dueText}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`payment-card ${numberOfPayments}-pay-installment-card`}>
      <div className="plan-summary">
        <div className="purple">
          <div className="left">
            <span className={`price ${numberOfPayments}-pay-installment`}>
              {installmentPrice}
            </span>
            <span className="due">{translation.today}</span>
          </div>
          <div className="right">
            <span className="pill">
              {translation.MultiPlanpayIn} {numberOfPayments}
              {numberOfPayments === 5 && <sup>TM</sup>}
            </span>
          </div>
        </div>
        <div className="grey">
          <span className={`${numberOfPayments}-pay-installment`}>
            {installmentPrice}
          </span>{" "}
          {translation.MultiPlanevery2Weeks}
        </div>
      </div>
      <div className="payment-breakdown">{installments}</div>
    </div>
  );
};

export default BiweeklyCard;
