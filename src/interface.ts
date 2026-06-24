export interface ITranslation {
  logoAltText: string;
  today: string;

  // Payment-plan / modal keys (ported from sezzle-widget-react)
  MultiPlanpayIn: string;
  MultiPlantrusted: string;
  MultiPlanweeks: string;
  LTadjustedTotal: string;
  LThideDetails: string;
  LTinterest: string;
  LTmonthlyAmount: string;
  LTperMonth: string;
  LTpercent: string;
  LTreadApr: string;
  LTsampleApr: string;
  LTseeDetails: string;
  LTsingleFeatureAffordable: string;
  LTsingleFeaturePrequalify: string;
  LTsingleFeatureTrusted: string;
  LTtermLength: string;
  LTterms3: string;
  terms1: string;
  terms2: string;
  webBankTerms: string;
  webBankTermsPI4: string;
  webBankTermsPI5: string;
  webBankVirtualCards: string;

  // Redesign marketing copy (hero, calculator, how-it-works, app promo, FAQ,
  // footer). `{merchantName}` / `{min}` are interpolated at render.
  heroEyebrow: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroShopNow: string;
  heroSeeHow: string;
  calcTitle: string;
  calcSubtitle: string;
  calcAmountLabel: string;
  payBelowMin: string;
  calcFootnote: string;
  hiwEyebrow: string;
  hiwTitle: string;
  hiwSubcopy: string;
  hiwStepLabel: string;
  hiwStep1Title: string;
  hiwStep1Body: string;
  hiwStep2Title: string;
  hiwStep2Body: string;
  hiwStep3Title: string;
  hiwStep3Body: string;
  appEyebrow: string;
  appTitle: string;
  appBody: string;
  appStore: string;
  googlePlay: string;
  appGetTheApp: string;
  appScreenAlt: string;
  faqEyebrow: string;
  faqTitle: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  faq3APi5: string;
  faq4Q: string;
  faq4A: string;
  faq5Q: string;
  faq5A: string;
  footerShopNow: string;
  footerCopyright: string;
}
