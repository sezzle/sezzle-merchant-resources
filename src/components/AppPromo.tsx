// App-promo section: phone screenshot beside the copy, the app-download CTA,
// and the two store-rating pills. Sits on the light brand tint (a full-width
// section, not an inset banner).
//
// The CTA follows the device: on mobile it deep-links to the viewer's own store
// listing, on desktop it points at sezzle.com/app. Either way both rating pills
// link to their respective listings, so both stores stay reachable.
import { ITranslation } from "../interface";
import appScreen from "../assets/sezzle-app-screen.webp";
// Official store badges, as used in the design handoff. Their artwork carries
// the store name, so the pills need no separate text label.
import appStoreBadge from "../assets/app-store-badge.png";
import googlePlayBadge from "../assets/google-play-badge.png";
import { StarIcon } from "./PaymentPlan/icons";
import { isMobileDevice, isIOSDevice } from "../utils/device";
import { interpolate } from "../utils/interpolate";
import {
  APP_URL,
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  APP_RATINGS_AS_OF,
} from "../constants";
import { Footnotes } from "./PaymentPlan/footnotes";
import { withFootnote } from "../utils/footnoteText";

interface AppPromoProps {
  translation: ITranslation;
  footnotes: Footnotes;
}

// Ratings are strings in the bundle so each locale can use its own decimal
// separator ("4.9" / "4,9"); parse for the star fill only.
const starFills = (rating: string) => {
  const value = Number(rating.replace(",", ".")) || 0;
  return [0, 1, 2, 3, 4].map((i) => Math.max(0, Math.min(1, value - i)));
};

const RatingPill = ({
  href,
  badgeSrc,
  badgeAlt,
  rating,
  count,
  starsLabel,
  idPrefix,
  badgeWidth,
  badgeHeight,
  newTabLabel,
}: {
  href: string;
  badgeSrc: string;
  badgeAlt: string;
  rating: string;
  count: string;
  starsLabel: string;
  idPrefix: string;
  badgeWidth: number;
  badgeHeight: number;
  newTabLabel: string;
}) => (
  <a className="hsw-rating-pill" href={href} target="_blank" rel="noreferrer">
    <img
      className="hsw-rating-badge"
      src={badgeSrc}
      alt={badgeAlt}
      width={badgeWidth}
      height={badgeHeight}
      loading="lazy"
      decoding="async"
    />
    {/* The stars' label already announces the score, so the visible number is
        hidden from assistive tech to avoid reading it twice. */}
    <span className="hsw-rating-score" aria-hidden="true">
      {rating}
    </span>
    <span className="hsw-rating-meta">
      <span className="hsw-rating-stars" role="img" aria-label={starsLabel}>
        {starFills(rating).map((fill, i) => (
          <StarIcon key={i} fill={fill} id={`${idPrefix}-${i}`} />
        ))}
      </span>
      <span className="hsw-rating-count">{count}</span>
    </span>
    <span className="hsw-sr-only">{newTabLabel}</span>
  </a>
);

const AppPromo = ({ translation, footnotes }: AppPromoProps) => {
  const isMobile = isMobileDevice();
  const ctaHref = isMobile
    ? isIOSDevice()
      ? APP_STORE_URL
      : GOOGLE_PLAY_URL
    : APP_URL;

  return (
    <section className="hsw-app">
      <div className="hsw-app-grid">
        <div className="hsw-app-phone">
          {/* Below the fold: load lazily, and reserve the intrinsic ratio so
              the section doesn't shift when the image decodes. */}
          <img
            src={appScreen}
            alt={translation.appScreenAlt}
            width={960}
            height={1152}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="hsw-app-content">
          <h2 className="hsw-app-title">{translation.appTitle}</h2>
          <p className="hsw-app-body">
            {withFootnote(translation.appBody, footnotes.reschedule)}
          </p>
          <div className="hsw-app-actions">
            <a
              className="hsw-btn hsw-btn-primary hsw-app-cta"
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
            >
              {translation.appGetTheApp}
            </a>
          </div>
          <div className="hsw-ratings">
            <RatingPill
              href={APP_STORE_URL}
              badgeSrc={appStoreBadge}
              badgeAlt={translation.appStoreBadgeAlt}
              rating={translation.appStoreRating}
              count={translation.appStoreRatingsCount}
              starsLabel={interpolate(translation.appRatingStarsLabel, {
                rating: translation.appStoreRating,
              })}
              idPrefix="ios"
              badgeWidth={565}
              badgeHeight={193}
              newTabLabel={translation.opensInNewTab}
            />
            <RatingPill
              href={GOOGLE_PLAY_URL}
              badgeSrc={googlePlayBadge}
              badgeAlt={translation.googlePlayBadgeAlt}
              rating={translation.googlePlayRating}
              count={translation.googlePlayRatingsCount}
              starsLabel={interpolate(translation.appRatingStarsLabel, {
                rating: translation.googlePlayRating,
              })}
              idPrefix="play"
              badgeWidth={588}
              badgeHeight={176}
              newTabLabel={translation.opensInNewTab}
            />
          </div>
          <p className="hsw-ratings-asof">
            {interpolate(translation.appRatingsAsOf, {
              date: APP_RATINGS_AS_OF,
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;
