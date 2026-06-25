import { DEFAULT_THEME, ABOUT_SEZZLE_ONLOAD_EVENT } from "./constants";
import { useConfig, AppConfig } from "./containers/ConfigProvider";
import "./stylesheets/styles.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import AppPromo from "./components/AppPromo";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import PaymentWrapper, {
  Eligibility,
} from "./components/PaymentPlan/PaymentWrapper";
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

  // Give the embedded document a localized name (used as the page/frame
  // accessible name), sourced from the translation like the section headings.
  useEffect(() => {
    if (translation?.hiwTitle) {
      document.title = translation.hiwTitle;
    }
  }, [translation]);

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

  // Pay-in-5 is shown only outside Canada (where numberOfPayments is forced to
  // 4). Below the $50 floor the row shows an "available on …" note instead.
  const showPI5Row = effectiveNumberOfPayments === 5;

  // Both default off the current location: the page is hosted on the partner's
  // own domain, so its origin is the store to link back to and its hostname is a
  // sensible merchant-name fallback when none is configured.
  const merchantName = config.merchantName || window.location.hostname;
  const shopUrl = window.location.origin;

  return (
    <div
      className={`sezzle-container ${
        config.theme !== DEFAULT_THEME ? "sezzle-container-dark" : ""
      }`}
    >
      {/* The page's single <main> landmark is the mount node in index.html,
          so this content renders inside it — do not add another <main> here. */}
      <Header translation={translation} shopUrl={shopUrl} />

      <Hero
        translation={translation}
        merchantName={merchantName}
        shopUrl={shopUrl}
        showPI5={showPI5Row}
        calculator={
          <PaymentWrapper
            currency={currency}
            priceString={priceString}
            inputValue={inputValue}
            hasError={hasError}
            onChange={handleChange}
            eligibility={eligibility}
            showPI5Row={showPI5Row}
            translation={translation}
            ltConfig={ltConfig}
            lang={lang}
          />
        }
      />

      <HowItWorks translation={translation} />

      <AppPromo translation={translation} />

      <Faq translation={translation} showPI5={showPI5Row} />

      <Footer
        translation={translation}
        merchantName={merchantName}
        shopUrl={shopUrl}
        eligibility={eligibility}
        ltConfig={ltConfig}
        lang={lang}
      />
    </div>
  );
}
export default App;
