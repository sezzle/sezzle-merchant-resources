import { DEFAULT_THEME, ABOUT_SEZZLE_ONLOAD_EVENT } from "./constants";
import { useConfig, AppConfig } from "./containers/ConfigProvider";
import "./stylesheets/styles.css";
import trustPilot from "./assets/trustpilot.svg";
import mobile from "./assets/mobile.svg";
import fiveStar from "./assets/five-star.svg";
import Logo from "./components/Logo";
import PaymentWrapper, {
  Eligibility,
} from "./components/PaymentPlan/PaymentWrapper";
import PaymentTerms from "./components/PaymentPlan/PaymentTerms";
import {
  StepOneIcon,
  StepTwoIcon,
  StepThreeIcon,
} from "./components/PaymentPlan/icons";
import { sendEvent } from "./remote/api";
import { useEffect, useState } from "react";
import {
  isProductEligibleLT,
  isProductEligiblePI4,
  isProductEligiblePI5,
  isInputAmountValid,
} from "./utils/renderFunctions";
import { getCurrency, normalizePriceString } from "./utils/price";

const DEFAULT_INPUT_PRICE = 150;

const SANITIZE_REGEX = /[^0-9,.$€£₤₹]/g;

const dispatchEvent = (config: AppConfig | undefined, eventType: string) => {
  const body = [
    {
      event_name: eventType,
      merchant_site: config?.origin,
      merchant_uuid: config?.merchant_uuid,
    },
  ];
  sendEvent(body);
};

function App() {
  const { config, translation, ltConfig, effectiveNumberOfPayments } =
    useConfig();

  const initialPrice =
    ltConfig.minPriceLT > 0 ? ltConfig.minPriceLT : DEFAULT_INPUT_PRICE;

  const [currency, setCurrency] = useState("$");
  const [priceString, setPriceString] = useState(String(initialPrice));
  const [inputValue, setInputValue] = useState(`$${initialPrice}`);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    dispatchEvent(config, ABOUT_SEZZLE_ONLOAD_EVENT);
  }, [config]);

  if (!config) return null;
  const lang = config.language;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(SANITIZE_REGEX, "");
    setInputValue(raw);

    const nextCurrency = getCurrency(raw);
    const nextPriceString = normalizePriceString(raw);

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
    lt: isProductEligibleLT(
      priceString,
      ltConfig.minPriceLT,
      ltConfig.maxPriceLT
    ),
  };

  const steps = [
    { StepImage: StepOneIcon, name: translation.MultiPlanStep1 },
    { StepImage: StepTwoIcon, name: translation.MultiPlanStep2 },
    { StepImage: StepThreeIcon, name: translation.MultiPlanStep3 },
  ];

  return (
    <div
      className={`sezzle-container ${
        config.theme !== DEFAULT_THEME ? "sezzle-container-dark" : ""
      }`}
    >
      <div className="sezzle-logo" aria-label={translation.logoAltText}>
        <Logo />
      </div>

      <p className="trusted">{translation.MultiPlantrusted}</p>

      <section
        className={`sezzle-payment-plan sezzle-multi-plan${
          eligibility.pi5 ? "" : " pi4-only"
        }`}
        aria-label={translation.sezzleInformation}
      >
        <p className="payment-plan-header">{translation.MultiPlanheader}</p>
        <PaymentWrapper
          currency={currency}
          priceString={priceString}
          inputValue={inputValue}
          hasError={hasError}
          onChange={handleChange}
          eligibility={eligibility}
          translation={translation}
          ltConfig={ltConfig}
          lang={lang}
        />
      </section>

      <div className="section-separator"></div>

      <h2 className="sezzle-subheader">{translation.subHeader}</h2>

      <div className="card-area">
        {steps.map(({ StepImage, name }, i) => (
          <div className="info-card" key={i}>
            <div className="step-image">
              <StepImage />
            </div>
            <p className="sezzle-info">{name}</p>
          </div>
        ))}
      </div>

      <div className="cta-area">
        <div className="cta-main">
          <h3 className="cta-header">{translation.ctaHeader}</h3>
          <p className="cta-description">{translation.ctaDescription}</p>
          <a
            className="cta-button"
            href="https://sezzle.com/app"
            rel="noreferrer"
            target="_blank"
          >
            {translation.ctaButton}
          </a>
        </div>
        <div className="mobile-reviews">
          <div className="mobile-app-img">
            <img src={mobile} alt=""></img>
          </div>
          <div className="review-card-area">
            <div className="review-card review-card-1">
              <div className="trustpilot-group">
                <div className="trustpilot">
                  <img src={trustPilot} alt=""></img>
                </div>
                <div className="five-stars" aria-label="Five stars">
                  <img src={fiveStar} alt=""></img>
                </div>
              </div>
              <h4 className="review-header">{translation.review1Header}</h4>
              <p className="review-description">
                {translation.review1Description}
              </p>
              <div className="review-name">
                {translation.reviewer1Name}{" "}
                <span className="review-date">{translation.review1Date}</span>
              </div>
            </div>
            <div
              className={`review-card ${
                config.language === "fr" || config.language === "es"
                  ? "review-card-2-fr-es"
                  : "review-card-2"
              }`}
            >
              <div className="trustpilot-group">
                <div className="trustpilot">
                  <img src={trustPilot} alt=""></img>
                </div>
                <div
                  className="five-stars"
                  aria-label={translation.ratingAltText}
                >
                  <img src={fiveStar} alt=""></img>
                </div>
              </div>
              <h4 className="review-header">{translation.review2Header}</h4>
              <p className="review-description">
                {translation.review2Description}
              </p>
              <div className="review-name">
                {translation.reviewer2Name}
                <span className="review-date">{translation.review2Date}</span>
              </div>
            </div>
            <div className="review-card review-card-3">
              <div className="trustpilot-group">
                <div className="trustpilot">
                  <img src={trustPilot} alt=""></img>
                </div>
                <div
                  className="five-stars"
                  aria-label={translation.ratingAltText}
                >
                  <img src={fiveStar} alt=""></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="sezzle-payment-plan sezzle-payment-plan-terms">
        <div className="sezzle-multi-plan">
          <PaymentTerms
            eligibility={eligibility}
            translation={translation}
            ltConfig={ltConfig}
            lang={lang}
          />
        </div>
      </section>
    </div>
  );
}
export default App;
