// Footer: white logo + "Shop Now at {merchant}" CTA, then the legal
// disclosures. Disclosures are driven by the existing PaymentTerms component so
// the copy stays i18n- and rule-aware (PI4 vs PI5 example, long-term APR/term
// range only when long-term is eligible), plus a merchant-personalized
// copyright line.
import { ITranslation } from "../interface";
import { ResolvedLTConfig } from "../utils/ltConfig";
import { interpolate } from "../utils/interpolate";
import PaymentTerms from "./PaymentPlan/PaymentTerms";
import { Eligibility } from "./PaymentPlan/PaymentWrapper";
import whiteLogo from "../assets/sezzle-horizontal-white.svg";

interface FooterProps {
  translation: ITranslation;
  merchantName: string;
  shopUrl: string;
  eligibility: Eligibility;
  ltConfig: ResolvedLTConfig;
  lang: string;
}

const Footer = ({
  translation,
  merchantName,
  shopUrl,
  eligibility,
  ltConfig,
  lang,
}: FooterProps) => (
  <footer className="hsw-footer">
    <div className="hsw-footer-inner">
      <div className="hsw-footer-top">
        <img src={whiteLogo} alt="Sezzle" />
        <a className="hsw-btn hsw-footer-cta" href={shopUrl} rel="noreferrer">
          {interpolate(translation.footerShopNow, { merchantName })}
        </a>
      </div>
      <div className="hsw-footer-disclosures">
        <PaymentTerms
          eligibility={eligibility}
          translation={translation}
          ltConfig={ltConfig}
          lang={lang}
        />
        <p className="hsw-footer-copyright">
          {interpolate(translation.footerCopyright, { merchantName })}
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
