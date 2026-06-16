// Presentational ".payment-plan-wrapper": the amount input plus the bi-weekly
// (Pay-in-4 / Pay-in-5) and long-term monthly cards. State (price, eligibility,
// validation) is owned by App and passed in — this component is pure render.
import { ITranslation } from "../../interface";
import { ResolvedLTConfig } from "../../utils/ltConfig";
import BiweeklyCard from "./BiweeklyCard";
import MonthlyCards from "./MonthlyCards";

export interface Eligibility {
  pi4: boolean;
  pi5: boolean;
  lt: boolean;
}

interface PaymentWrapperProps {
  currency: string;
  priceString: string;
  inputValue: string;
  hasError: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  eligibility: Eligibility;
  translation: ITranslation;
  ltConfig: ResolvedLTConfig;
  lang: string;
}

const PaymentWrapper = ({
  currency,
  priceString,
  inputValue,
  hasError,
  onChange,
  eligibility,
  translation,
  ltConfig,
  lang,
}: PaymentWrapperProps) => {
  return (
    <div className="payment-plan-wrapper">
      <p
        className={`sample-payments${
          lang === "fr" ? " sezzle-multi-plan-fr" : ""
        }`}
      >
        <span className="sample-payments-title">
          {translation.MultiPlanSeePlans}
        </span>
        <span
          className={`input-amount-container${hasError ? " input-error" : ""}`}
        >
          <label
            className="input-amount-label"
            htmlFor="multi-plan-input-amount"
          >
            {translation.MultiPlanAmount}
          </label>
          <input
            className={`price input-amount${hasError ? " input-error" : ""}`}
            id="multi-plan-input-amount"
            maxLength={12}
            value={inputValue}
            onChange={onChange}
          />
        </span>
      </p>
      {eligibility.pi4 && (
        <div className="payment-cards payment-cards-biweekly">
          <BiweeklyCard
            numberOfPayments={4}
            currency={currency}
            priceString={priceString}
            translation={translation}
          />
          {eligibility.pi5 && (
            <BiweeklyCard
              numberOfPayments={5}
              currency={currency}
              priceString={priceString}
              translation={translation}
            />
          )}
        </div>
      )}
      {eligibility.lt && (
        <div className="payment-cards payment-cards-monthly">
          <MonthlyCards
            currency={currency}
            priceString={priceString}
            ltConfig={ltConfig}
            translation={translation}
            lang={lang}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentWrapper;
