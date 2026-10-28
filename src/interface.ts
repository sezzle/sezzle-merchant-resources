export interface ITranslation {
  logoAltText: string;
  // Schedule column label ("Today"); `calcTodayInline` is the lowercase form
  // used mid-phrase beside the amount due ("$37.50 today").
  today: string;
  calcTodayInline: string;

  // Long-term plan keys (ported from sezzle-widget-react). The footnote marker
  // is supplied by the footnote allocator, not baked into the copy.
  MultiPlantrusted: string;
  MultiPlanweeks: string;
  LTadjustedTotal: string;
  LTinterest: string;
  LTmonthlyAmount: string;
  LTperMonth: string;
  LTpercent: string;
  LTreadApr: string;
  LTsampleApr: string;
  LTtermLength: string;
  LTterms3: string;

  // Footer disclosures, one per footnote marker, in footer order.
  footnoteCreditCheck: string;
  // The pay-later umbrella; the two plan examples beneath it share its marker.
  footnotePayLater: string;
  footnotePayIn4: string;
  footnotePayIn5: string;
  footnoteVirtualCard: string;
  footnoteReschedule: string;
  footnoteSezzleUp: string;
  // Accessible name for an in-body footnote marker link; `{marker}` is the
  // symbol itself (*, †, ...).
  footnoteRefLabel: string;

  // Stand-in for the merchant's name when the integration supplies neither
  // `merchantName` nor a usable parent origin, so personalized copy still reads
  // as a sentence.
  merchantFallback: string;

  // Marketing copy (hero, calculator, how-it-works, app promo, FAQ, footer).
  // `{merchantName}` / `{min}` / `{count}` are interpolated at render;
  // `{footnote}` marks where a superscript marker belongs mid-sentence.
  heroHeadline: string;
  heroSubcopy: string;
  heroSubPi5: string;
  heroShopNow: string;
  heroSeeHow: string;
  calcTitle: string;
  calcSubtitle: string;
  calcFeeNote: string;
  // Not rendered as visible text — the input's accessible name, since the
  // design has no visible field label.
  calcAmountLabel: string;
  calcPlanPayments: string;
  // Notes shown in place of a schedule when the amount is outside a plan's
  // range: below its minimum, above the bi-weekly ceiling, or — when long-term
  // widens the valid input range — the whole eligible window at once.
  payBelowMin: string;
  payBelowMax: string;
  payRange: string;

  hiwTitle: string;
  hiwSubcopy: string;
  hiwSubcopyInStore: string;
  hiwStepLabel: string;
  hiwOnlineGroupTitle: string;
  hiwInStoreGroupTitle: string;
  hiwStep1Title: string;
  hiwStep1Body: string;
  hiwStep2Title: string;
  hiwStep2Body: string;
  hiwStep3Title: string;
  hiwStep3Body: string;
  hiwInStore1Title: string;
  hiwInStore1Body: string;
  hiwInStore2Title: string;
  hiwInStore2Body: string;
  hiwInStore3Title: string;
  hiwInStore3Body: string;

  appTitle: string;
  appBody: string;
  appGetTheApp: string;
  // Alt text for the official store badges (the artwork itself is English-only).
  appStoreBadgeAlt: string;
  googlePlayBadgeAlt: string;
  appScreenAlt: string;
  // Store-rating pills. Ratings are marketing claims, so they live in the
  // translation bundle and must be refreshed alongside `appRatingsAsOf`.
  appStoreRating: string;
  appStoreRatingsCount: string;
  googlePlayRating: string;
  googlePlayRatingsCount: string;
  appRatingsAsOf: string;
  appRatingStarsLabel: string;
  // Screen-reader-only suffix for links that open in a new tab.
  opensInNewTab: string;

  faqTitle: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq2APi5: string;
  faq3Q: string;
  faq3A: string;
  faq4Q: string;
  faq4A: string;
  footerShopNow: string;
  footerCopyright: string;
}
