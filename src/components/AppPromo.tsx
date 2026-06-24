// App-promo banner: phone screenshot + copy and the app-download CTA(s).
// On mobile we surface the native App Store / Google Play listings; on desktop
// a single "Get The App" button points at sezzle.com/app.
import { ITranslation } from "../interface";
import appScreen from "../assets/sezzle-app-screen.webp";
import { AppStoreIcon, GooglePlayIcon } from "./PaymentPlan/icons";
import { isMobileDevice } from "../utils/device";

const APP_URL = "https://sezzle.com/app";
const APP_STORE_URL =
  "https://apps.apple.com/us/app/sezzle-buy-now-pay-later/id1434922495";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.sezzle.sezzlemobile";

interface AppPromoProps {
  translation: ITranslation;
}

const AppPromo = ({ translation }: AppPromoProps) => {
  const isMobile = isMobileDevice();

  return (
    <section className="hsw-app">
      <div className="hsw-app-banner">
        <div className="hsw-app-glow" aria-hidden="true" />
        <div className="hsw-app-phone">
          <img src={appScreen} alt={translation.appScreenAlt} />
        </div>
        <div className="hsw-app-content">
          <span className="hsw-eyebrow hsw-app-eyebrow">{translation.appEyebrow}</span>
          <h2 className="hsw-app-title">{translation.appTitle}</h2>
          <p className="hsw-app-body">{translation.appBody}</p>
          <div className="hsw-store-btns">
            {isMobile ? (
              <>
                <a
                  className="hsw-store-btn is-primary"
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <AppStoreIcon />
                  {translation.appStore}
                </a>
                <a
                  className="hsw-store-btn is-secondary"
                  href={GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GooglePlayIcon />
                  {translation.googlePlay}
                </a>
              </>
            ) : (
              <a
                className="hsw-store-btn is-primary"
                href={APP_URL}
                target="_blank"
                rel="noreferrer"
              >
                {translation.appGetTheApp}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;
