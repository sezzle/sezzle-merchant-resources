// Footer: white logo + "Shop Now at {merchant}" CTA, then the legal
// disclosures. Disclosures are driven by the existing PaymentTerms component so
// the copy stays i18n- and rule-aware (PI4 vs PI5 example, long-term APR/term
// range only when long-term is eligible), plus a merchant-personalized
// copyright line.
import { ITranslation } from "../interface";
import { ResolvedLTConfig } from "../utils/ltConfig";
import { interpolate } from "../utils/interpolate";
import PaymentTerms from "./PaymentPlan/PaymentTerms";
import { Footnotes } from "./PaymentPlan/footnotes";
// The footer background is dark in both themes, so the white mark is always
// the legible choice.
import whiteLogo from "../assets/sezzle-wordmark-white.webp";

interface FooterProps {
  translation: ITranslation;
  merchantName: string;
  shopUrl: string;
  ltConfig: ResolvedLTConfig;
  lang: string;
  footnotes: Footnotes;
}

const Footer = ({
  translation,
  merchantName,
  shopUrl,
  ltConfig,
  lang,
  footnotes,
}: FooterProps) => (
  <footer className="hsw-footer">
    <div className="hsw-footer-inner">
      <div className="hsw-footer-top">
        <img src={whiteLogo} alt={translation.logoAltText} />
        {/* target="_top" breaks out of the Sezzle iframe so the merchant's own
            site loads in the full window, not inside this embed. */}
        <a
          className="hsw-btn hsw-footer-cta"
          href={shopUrl}
          target="_top"
          rel="noreferrer"
        >
          {interpolate(translation.footerShopNow, { merchantName })}
        </a>
      </div>
      <div className="hsw-footer-disclosures">
        <PaymentTerms
          translation={translation}
          ltConfig={ltConfig}
          lang={lang}
          footnotes={footnotes}
        />
        <p className="hsw-footer-copyright">
          {interpolate(translation.footerCopyright, { merchantName })}
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
