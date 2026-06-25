// Calculator card body: title + amount input, then a plan block per available
// plan. Pay-in-4 always shows (the amount input only accepts in-range values,
// so it is always eligible). Pay-in-5 shows only outside Canada
// (showPI5Row === effectiveNumberOfPayments === 5); below the $50 floor it
// shows an "available on orders of …" note instead of the timeline. Long-term
// monthly cards render when LT-eligible (US + long-term enabled). State is
// owned by App.
import { ITranslation } from "../../interface";
import { ResolvedLTConfig } from "../../utils/ltConfig";
import { PI5_MIN_PRICE } from "../../utils/renderFunctions";
import { interpolate } from "../../utils/interpolate";
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
  showPI5Row: boolean;
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
  showPI5Row,
  translation,
  ltConfig,
  lang,
}: PaymentWrapperProps) => {
  const pi5BelowMessage = interpolate(translation.payBelowMin, {
    min: `${currency}${PI5_MIN_PRICE}`,
  });

  return (
    <div className="hsw-calc-card">
      <div className="hsw-calc-head">
        <div>
          <div className="hsw-calc-title">{translation.calcTitle}</div>
          <div className="hsw-calc-subtitle">{translation.calcSubtitle}</div>
        </div>
        <label className="hsw-amount-field">
          <span className="hsw-amount-label">{translation.calcAmountLabel}</span>
          <span
            className={`hsw-amount-input-wrap${hasError ? " input-error" : ""}`}
          >
            <input
              className={`input-amount hsw-amount-input${
                hasError ? " input-error" : ""
              }`}
              id="multi-plan-input-amount"
              aria-label={translation.calcAmountLabel}
              // Expose the rejected-input state to assistive tech, not just the
              // visual `input-error` class. A localized helper-text message is a
              // follow-up: it needs a new translation key, which is blocked on
              // the same EN-copy approval as the rest of this redesign.
              aria-invalid={hasError}
              maxLength={12}
              value={inputValue}
              onChange={onChange}
            />
          </span>
        </label>
      </div>

      {/* Pay in 4 — always available */}
      <BiweeklyCard
        numberOfPayments={4}
        currency={currency}
        priceString={priceString}
        translation={translation}
      />

      {/* Pay in 5 — hidden entirely in Canada */}
      {showPI5Row &&
        (eligibility.pi5 ? (
          <BiweeklyCard
            numberOfPayments={5}
            currency={currency}
            priceString={priceString}
            translation={translation}
          />
        ) : (
          <div className="hsw-plan">
            <div className="hsw-plan-head">
              <div>
                <span className="hsw-plan-below">{pi5BelowMessage}</span>
              </div>
              <span className="pill hsw-plan-pill is-pi5">
                {translation.MultiPlanpayIn} 5<sup>TM</sup>
              </span>
            </div>
          </div>
        ))}

      {/* Long-term monthly plans (US + long-term enabled) */}
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

      <p className="hsw-calc-footnote">{translation.calcFootnote}</p>
    </div>
  );
};

export default PaymentWrapper;
