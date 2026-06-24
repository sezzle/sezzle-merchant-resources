// Hero: merchant-personalized headline + CTAs on the left, the payment-plan
// calculator card (passed in as `calculator`) on the right.
import { ReactNode } from "react";
import { ITranslation } from "../interface";
import { interpolate } from "../utils/interpolate";
import { CheckIcon } from "./PaymentPlan/icons";

interface HeroProps {
  translation: ITranslation;
  merchantName: string;
  shopUrl: string;
  calculator: ReactNode;
  // Pay-in-5 is only offered in some markets (config-driven, not amount-driven).
  // When it isn't, the subcopy reads "over 6 weeks" instead of "over 6 to 8".
  showPI5: boolean;
}

const Hero = ({
  translation,
  merchantName,
  shopUrl,
  calculator,
  showPI5,
}: HeroProps) => (
  <section className="hsw-hero">
    <div className="hsw-hero-glow" aria-hidden="true" />
    <div className="hsw-hero-grid">
      <div className="hsw-hero-content">
        <span className="hsw-eyebrow hsw-hero-eyebrow">
          {translation.heroEyebrow}
        </span>
        <h1 className="hsw-hero-title">
          {interpolate(translation.heroHeadline, { merchantName })}
        </h1>
        <p className="hsw-hero-sub">
          {interpolate(translation.heroSubcopy, {
            heroSubPi5: showPI5 ? translation.heroSubPi5 : "",
          })}
        </p>
        <div className="hsw-hero-actions">
          <a className="hsw-btn hsw-btn-primary" href={shopUrl} rel="noreferrer">
            {translation.heroShopNow}
          </a>
          <a className="hsw-btn hsw-btn-secondary" href="#how-it-works">
            {translation.heroSeeHow}
          </a>
        </div>
        <p className="hsw-trusted">
          <CheckIcon />
          {translation.MultiPlantrusted}
        </p>
      </div>
      {calculator}
    </div>
  </section>
);

export default Hero;
