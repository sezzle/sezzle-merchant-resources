// Calculator card body: title + subtitle + amount input stacked, then a plan
// block per plan. Each bi-weekly plan shows its schedule when the amount is
// eligible and an "available on orders …" note when it is not, so a plan is
// never presented as available at an amount it doesn't cover.
//
// That note is reachable for Pay in 4 only when long-term is enabled: long-term
// raises the valid input ceiling to maxPriceLT, so an accepted amount can sit
// above the bi-weekly maxPrice. Without long-term, maxPrice is the input's own
// ceiling and Pay in 4 is always eligible.
//
// Pay-in-5 is hidden outright in Canada (showPI5Row === false). Long-term
// monthly cards render when LT-eligible. State is owned by App.
import { ITranslation } from "../../interface";
import { ResolvedLTConfig } from "../../utils/ltConfig";
import { PI5_MIN_PRICE } from "../../utils/renderFunctions";
import { interpolate } from "../../utils/interpolate";
import { withFootnote, FootnoteRef } from "../../utils/footnoteText";
import BiweeklyCard from "./BiweeklyCard";
import MonthlyCards from "./MonthlyCards";
import { Footnotes } from "./footnotes";

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
  footnotes: Footnotes;
  // Upper bound for bi-weekly plans, and whether long-term is on offer at all
  // (which is what makes an amount above that bound reachable).
  maxPrice: number;
  ltOffered: boolean;
}

// A plan row with its name and marker but a note in place of the schedule.
const PlanNote = ({
  count,
  marker,
  message,
  translation,
}: {
  count: number;
  marker: string;
  message: string;
  translation: ITranslation;
}) => (
  <div className="hsw-plan">
    <div className="hsw-plan-head">
      <h3 className="hsw-plan-label">
        {interpolate(translation.calcPlanPayments, { count })}
        <FootnoteRef marker={marker} />
      </h3>
      <div className="hsw-plan-values">
        <span className="hsw-plan-below">{message}</span>
      </div>
    </div>
  </div>
);

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
  footnotes,
  maxPrice,
  ltOffered,
}: PaymentWrapperProps) => {
  const min = `${currency}${PI5_MIN_PRICE}`;
  const max = `${currency}${maxPrice}`;

  // Above the ceiling there is no minimum left to state, so name the ceiling.
  const pi4Note = interpolate(translation.payBelowMax, { max });
  // With long-term on, the amount can miss Pay-in-5 from either direction, so
  // the note states the whole eligible window rather than one bound.
  const pi5Note = ltOffered
    ? interpolate(translation.payRange, { min, max })
    : interpolate(translation.payBelowMin, { min });

  return (
    <div className="hsw-calc-card">
      <div className="hsw-calc-head">
        <h2 className="hsw-calc-title">{translation.calcTitle}</h2>
        <p className="hsw-calc-subtitle">{translation.calcSubtitle}</p>
        <p className="hsw-calc-fee-note">
          {withFootnote(translation.calcFeeNote, footnotes.payLater)}
        </p>
        {/* The design has no visible field label, so the accessible name comes
            from aria-label rather than a rendered <span>. */}
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
      </div>

      {/* Pay in 4 */}
      {eligibility.pi4 ? (
        <BiweeklyCard
          numberOfPayments={4}
          currency={currency}
          priceString={priceString}
          translation={translation}
          footnotes={footnotes}
        />
      ) : (
        <PlanNote
          count={4}
          marker={footnotes.payLater}
          message={pi4Note}
          translation={translation}
        />
      )}

      {/* Pay in 5 — hidden entirely in Canada */}
      {showPI5Row &&
        (eligibility.pi5 ? (
          <BiweeklyCard
            numberOfPayments={5}
            currency={currency}
            priceString={priceString}
            translation={translation}
            footnotes={footnotes}
          />
        ) : (
          <PlanNote
            count={5}
            marker={footnotes.payLater}
            message={pi5Note}
            translation={translation}
          />
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
            footnotes={footnotes}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentWrapper;
