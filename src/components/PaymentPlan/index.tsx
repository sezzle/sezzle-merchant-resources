// Payment-plan section — a React reimplementation of the sezzle-widget-react
// MultiPlan modal (see ../sezzle-widget-react/src/Components/MultiPlanModal.js),
// rendered inline on the page rather than as a lightbox overlay. An amount input
// drives the bi-weekly (Pay-in-4 / Pay-in-5) cards, the long-term monthly cards,
// the "how to pay" carousel, and the disclaimer terms.
import { useState } from "react";
import { useConfig } from "../../containers/ConfigProvider";
import {
  isProductEligibleLT,
  isProductEligiblePI4,
  isProductEligiblePI5,
  isInputAmountValid,
} from "../../utils/renderFunctions";
import { getCurrency } from "../../utils/price";
import BiweeklyCard from "./BiweeklyCard";
import MonthlyCards from "./MonthlyCards";
import HowToPayCarousel from "./HowToPayCarousel";
import PaymentTerms from "./PaymentTerms";

export interface Eligibility {
  pi4: boolean;
  pi5: boolean;
  lt: boolean;
}

// Default the input to the resolved long-term minimum, falling back to $150
// (group "a"'s minPriceLT) when long-term is disabled.
const DEFAULT_INPUT_PRICE = 150;

const CURRENCY_REGEX_GLOBAL = /[$€£₤₹]/g;
const SANITIZE_REGEX = /[^0-9,.$€£₤₹]/g;

const PaymentPlan = () => {
  const { config, translation, ltConfig, effectiveNumberOfPayments } = useConfig();

  const initialPrice =
    ltConfig.minPriceLT > 0 ? ltConfig.minPriceLT : DEFAULT_INPUT_PRICE;

  const [currency, setCurrency] = useState("$");
  const [priceString, setPriceString] = useState(String(initialPrice));
  const [inputValue, setInputValue] = useState(`$${initialPrice}`);
  const [hasError, setHasError] = useState(false);

  if (!config) return null;
  const lang = config.language;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(SANITIZE_REGEX, "");
    setInputValue(raw);

    const nextCurrency = getCurrency(raw);
    const nextPriceString = raw.replace(CURRENCY_REGEX_GLOBAL, "");

    const valid = isInputAmountValid(
      nextPriceString,
      config.minPrice,
      config.maxPrice,
      ltConfig.minPriceLT,
      ltConfig.maxPriceLT
    );
    if (!valid) {
      setHasError(true);
      return;
    }
    setHasError(false);
    setCurrency(nextCurrency);
    setPriceString(nextPriceString);
  };

  // Eligibility for the displayed cards relaxes minPrice to 0 so a bi-weekly
  // card always shows (mirrors the modal's on-open render). Strict minPrice
  // still gates user input via isInputAmountValid above.
  const eligibility: Eligibility = {
    pi4: isProductEligiblePI4(priceString, 0, config.maxPrice),
    pi5: isProductEligiblePI5(
      priceString,
      config.maxPrice,
      effectiveNumberOfPayments
    ),
    lt: isProductEligibleLT(priceString, ltConfig.minPriceLT, ltConfig.maxPriceLT),
  };

  return (
    <section
      className="sezzle-payment-plan"
      aria-label={translation.sezzleInformation}
    >
      <div className={`sezzle-multi-plan${eligibility.pi5 ? "" : " pi4-only"}`}>
        <p className="trusted">{translation.MultiPlantrusted}</p>
        <p className="payment-plan-header">{translation.MultiPlanheader}</p>
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
              className={`input-amount-container${
                hasError ? " input-error" : ""
              }`}
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
                onChange={handleChange}
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
        <HowToPayCarousel translation={translation} />
        <PaymentTerms
          eligibility={eligibility}
          translation={translation}
          ltConfig={ltConfig}
          lang={lang}
        />
      </div>
    </section>
  );
};

export default PaymentPlan;
