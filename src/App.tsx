import { DEFAULT_THEME } from "./constants";
import { useConfig, AppConfig } from "./containers/ConfigProvider";
import { ITranslation } from "./interface";
import "./stylesheets/styles.css";
import pieSeparator from "./assets/pie-separator.svg";
import quarterPie from "./assets/quarter-pie.svg";
import halfPie from "./assets/half-pie.svg";
import threeQuarterPie from "./assets/quarter-pie.svg";
import fullPie from "./assets/full-pie.svg";
import cartIcon from "./assets/cart-icon.svg";
import cardIcon from "./assets/card-icon.svg";
import shipTimeIcon from "./assets/ship-time-icon.svg";
import trustPilot from "./assets/trustpilot.svg";
import mobile from "./assets/mobile.svg";
import fiveStar from "./assets/five-star.svg";
import Logo from "./components/Logo";
import { sendEvent } from "./remote/api";
import { ABOUT_SEZZLE_ONLOAD_EVENT } from "./constants";

const dispatchEvent = (
    config: AppConfig,
    eventType: string
) => {
    const body = [
        {
            event_name: eventType,
            merchant_site: config.origin,
            merchant_uuid: config.merchant_uuid
        },
    ];
    // hooks are only accessible from inside a JSX element.
    // So passing data from here, instead of directly getting them during api call.
    // Some room for improvement.
    sendEvent(body);
};

const onSuccess = (config: AppConfig) => {
  dispatchEvent(config, ABOUT_SEZZLE_ONLOAD_EVENT)
}

function App() {
  const ctx = useConfig();
  const config = ctx.config;
  if (!config) {
    return <></>
  }
  const translation: ITranslation = ctx.translation;
  onSuccess(config);

  return (
    <div
      className={`sezzle-container ${
        config.theme === DEFAULT_THEME ? "" : "sezzle-container-dark"
      }`}
    >
      <div className="sezzle-logo" aria-label={translation.logoAltText}>
        <Logo />
      </div>
      <h1 className="sezzle-header">{translation.header}</h1>
      <p className="sezzle-description">
        {translation.description}
        <sup>1</sup>
      </p>
      <div className="payment-pie-area">
        <div className="installment-wrapper">
          <div className="pie">
            <img src={quarterPie} alt=""></img>
          </div>
          <div className="installment">25%</div>
          <div className="due-date">{translation.today}</div>
        </div>
        <div className="pie-separator">
          <img src={pieSeparator} alt=""></img>
        </div>
        <div className="installment-wrapper">
          <div className="pie">
            <img src={halfPie} alt=""></img>
          </div>
          <div className="installment">25%</div>
          <div className="due-date">2 {translation.weeks}</div>
        </div>
        <div className="pie-separator">
          <img src={pieSeparator} alt=""></img>
        </div>
        <div className="installment-wrapper">
          <div className="pie">
            <img src={threeQuarterPie} alt=""></img>
          </div>
          <div className="installment">25%</div>
          <div className="due-date">4 {translation.weeks}</div>
        </div>
        <div className="pie-separator">
          <img src={pieSeparator} alt=""></img>
        </div>
        <div className="installment-wrapper">
          <div className="pie">
            <img src={fullPie} alt=""></img>
          </div>
          <div className="installment">25%</div>
          <div className="due-date">6 {translation.weeks}</div>
        </div>
      </div>
      <div className="section-separator"></div>

      <h2 className="sezzle-subheader">{translation.subHeader}</h2>
      <p className="sezzle-description">{translation.subDescription}</p>

      <div className="card-area">
        <div className="info-card">
          <div className="shopping-cart-icon">
            <img src={cartIcon} alt=""></img>
          </div>
          <p className="sezzle-info">{translation.cartInfo}</p>
        </div>
        <div className="info-card">
          <div className="sezzle-card-icon">
            <img src={cardIcon} alt=""></img>
          </div>
          <p className="sezzle-info">{translation.checkoutInfo}</p>
        </div>
        <div className="info-card">
          <div className="ship-time-icon">
            <img src={shipTimeIcon} alt=""></img>
          </div>
          <p
            className="sezzle-info"
            dangerouslySetInnerHTML={{ __html: translation.shipmentInfo }}
          ></p>
        </div>
      </div>

      <div className="section-separator"></div>

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

            <div className="review-card review-card-2">
              <div className="trustpilot-group">
                <div className="trustpilot">
                  <img src={trustPilot} alt=""></img>
                </div>
                <div
                  className="five-stars"
                  aria-label="{translation.ratingAltTex}"
                >
                  <img src={fiveStar} alt=""></img>
                </div>
              </div>
              <h4 className="review-header">{translation.review2Header}</h4>
              <p className="review-description">{translation.review2Header}</p>
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

      <div className="terms">
        <p>
          <sup>1</sup>
          {translation.term1}
        </p>
        <p>
          <sup>2</sup>
          {translation.term2}
        </p>
      </div>
    </div>
  );
}

export default App;
