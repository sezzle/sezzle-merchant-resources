import { DEFAULT_THEME } from "./constants";
import { useConfig, AppConfig } from "./containers/ConfigProvider";
import { ITranslation } from "./interface";
import "./stylesheets/styles.css";
import trustPilot from "./assets/trustpilot.svg";
import mobile from "./assets/mobile.svg";
import fiveStar from "./assets/five-star.svg";
import Logo from "./components/Logo";
import PaymentPlan from "./components/PaymentPlan";
import { sendEvent } from "./remote/api";
import { ABOUT_SEZZLE_ONLOAD_EVENT } from "./constants";
import { useEffect } from "react";

const dispatchEvent = (config: AppConfig | undefined, eventType: string) => {
  const body = [
    {
      event_name: eventType,
      merchant_site: config?.origin,
      merchant_uuid: config?.merchant_uuid,
    },
  ];
  // hooks are only accessible from inside a JSX element.
  // So passing data from here, instead of directly getting them during api call.
  // Some room for improvement.
  sendEvent(body);
};

function App() {
  const ctx = useConfig();
  const config = ctx.config;
  const translation: ITranslation = ctx.translation;

  // Fire the onload analytics event as a side effect after render — not during
  // render — so it sends exactly once and stays safe under re-renders/StrictMode.
  useEffect(() => {
    dispatchEvent(config, ABOUT_SEZZLE_ONLOAD_EVENT);
  }, [config]);

  return (
      <div
          className={`sezzle-container ${
              config && config.theme !== DEFAULT_THEME
                  ? "sezzle-container-dark"
                  : ""
          }`}
      >
          <div className="sezzle-logo" aria-label={translation.logoAltText}>
              <Logo />
          </div>
          <PaymentPlan />

          <div className="section-separator"></div>

          <div className="cta-area">
              <div className="cta-main">
                  <h3 className="cta-header">{translation.ctaHeader}</h3>
                  <p className="cta-description">
                      {translation.ctaDescription}
                  </p>
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
                              <div
                                  className="five-stars"
                                  aria-label="Five stars"
                              >
                                  <img src={fiveStar} alt=""></img>
                              </div>
                          </div>
                          <h4 className="review-header">
                              {translation.review1Header}
                          </h4>
                          <p className="review-description">
                              {translation.review1Description}
                          </p>
                          <div className="review-name">
                              {translation.reviewer1Name}{" "}
                              <span className="review-date">
                                  {translation.review1Date}
                              </span>
                          </div>
                      </div>
                      <div
                          className={`review-card ${
                              config &&
                              (config.language === "fr" ||
                                  config.language === "es")
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
                          <h4 className="review-header">
                              {translation.review2Header}
                          </h4>
                          <p className="review-description">
                              {translation.review2Description}
                          </p>
                          <div className="review-name">
                              {translation.reviewer2Name}
                              <span className="review-date">
                                  {translation.review2Date}
                              </span>
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
      </div>
  );
}
export default App;
