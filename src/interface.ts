export interface ITranslation {
  logoAltText: string;
  longTerm: string;
  header: string;
  description: string;
  today: string;
  weeks: string;
  subHeader: string;
  subDescription: string;
  cartInfo: string;
  checkoutInfo: string;
  shipmentInfo: string;
  ctaHeader: string;
  ctaDescription: string;
  ctaButton: string;
  review1Header: string;
  review1Description: string;
  reviewer1Name: string;
  review1Date: string;
  ratingAltText: string;
  review2Header: string;
  review2Description: string;
  reviewer2Name: string;
  review2Date: string;
  term1: string;
  term2: string;
  term3: string;
  term4: string;
  term1noServiceFee: string;
  term2noServiceFee: string;

  // Payment-plan / modal keys (ported from sezzle-widget-react)
  MultiPlanAmount: string;
  MultiPlanevery2Weeks: string;
  MultiPlanheader: string;
  MultiPlanhowToPay: string;
  MultiPlanpayIn: string;
  MultiPlanSeePlans: string;
  MultiPlanStep1: string;
  MultiPlanStep2: string;
  MultiPlanStep3: string;
  MultiPlantrusted: string;
  MultiPlanweeks: string;
  LTadjustedTotal: string;
  LThideDetails: string;
  LTinterest: string;
  LTmonthlyAmount: string;
  LTpercent: string;
  LTperMonth: string;
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
  termsHiw: string;
  webBankTerms: string;
  webBankTermsPI4: string;
  webBankTermsPI5: string;
  linkToCompleteTerms: string;
  sezzleInformation: string;
  closeSezzleModal: string;
  previousSlide: string;
  nextSlide: string;
  carouselPosition: string;
  slide: string;
}

// Interface for merchant details response
export interface IMerchantDetails {
  is_direct_integration_merchant: boolean;
}
