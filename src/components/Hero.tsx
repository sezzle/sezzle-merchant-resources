// Hero: merchant-personalized headline + CTAs on the left, the payment-plan
// calculator card (passed in as `calculator`) on the right. The design folds
// "Buy Now, Pay Later" into the headline itself, so there is no eyebrow tag.
import { ReactNode } from "react";
import { ITranslation } from "../interface";
import { interpolate } from "../utils/interpolate";
import { CheckIcon } from "./PaymentPlan/icons";
import { Footnotes } from "./PaymentPlan/footnotes";

interface HeroProps {
  translation: ITranslation;
  merchantName: string;
  shopUrl: string;
  calculator: ReactNode;
  // Pay-in-5 is only offered in some markets (config-driven, not amount-driven).
  // When it isn't, the subcopy reads "over 6 weeks" instead of "over 6 to 8".
  showPI5: boolean;
  footnotes: Footnotes;
}

const Hero = ({
  translation,
  merchantName,
  shopUrl,
  calculator,
  showPI5,
  footnotes,
}: HeroProps) => (
  <section className="hsw-hero">
    <div className="hsw-hero-grid">
      <div className="hsw-hero-content">
        {/* The headline breaks at the newlines in its translation rather than
            wrapping, so the merchant's name is never split across two lines. */}
        <h1 className="hsw-hero-title">
          {interpolate(translation.heroHeadline, { merchantName })
            .split("\n")
            .map((line, i) => (
              <span className="hsw-hero-title-line" key={i}>
                {line}
              </span>
            ))}
        </h1>
        <p className="hsw-hero-sub">
          {interpolate(translation.heroSubcopy, {
            heroSubPi5: showPI5 ? translation.heroSubPi5 : "",
          })}
          <sup className="hsw-footnote-ref">{footnotes.creditCheck}</sup>
        </p>
        <div className="hsw-hero-actions">
          {/* target="_top" breaks out of the Sezzle iframe so the merchant's
              own site loads in the full window, not inside this embed. The
              "See how it works" anchor below is in-page, so it stays within
              the iframe (no target). */}
          <a
            className="hsw-btn hsw-btn-primary"
            href={shopUrl}
            target="_top"
            rel="noreferrer"
          >
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
