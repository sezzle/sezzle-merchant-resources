// Small check used by the hero "Trusted by millions" line. Uses the theme
// progress/success indicator, which is also the primary-button fill: Bold Plum
// on light, Bold Green on dark.
export const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--indicator)"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// Chevron used by the FAQ accordion (stroked; CSS rotates + recolors it).
export const FaqChevronIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// Store-rating stars. `fill` is a fraction 0–1 so a 4.5 average renders four
// solid stars and one half star (the gradient id is suffixed per instance so
// multiple half stars on one page can't collide).
export const StarIcon = ({
  fill = 1,
  id = "0",
}: {
  fill?: number;
  id?: string;
}) => {
  const gradientId = `hsw-star-${id}`;
  const path =
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z";
  if (fill >= 1) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${fill * 100}%`} stopColor="currentColor" />
          <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradientId})`} d={path} />
    </svg>
  );
};

// "How Sezzle works" step illustrations, taken from the design handoff: a
// shopping cart, the Sezzle petal mark, then a check-circle. They sit on the
// dark step badge, so they stroke with --badge-fg rather than --accent.
export const StepOneIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--badge-fg)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

// The Sezzle petal mark. Its artwork fills only the middle of the 40-unit
// viewBox, so it renders at 44px to sit visually level with the 26px glyphs —
// hence the `is-mark` hook the stylesheet sizes separately.
export const StepTwoIcon = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 40 40"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="is-mark"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.2881 10.7291C24.1599 11.245 26.5746 12.9993 27.9542 15.5719L21.2881 17.7369V10.7291Z"
      stroke="var(--badge-fg)"
      strokeOpacity="0.5"
      strokeWidth="1.7"
    />
    <path
      d="M29.0589 18.9713C29.4556 21.8624 28.5328 24.7009 26.512 26.8073L23.2982 22.3825H23.2991L22.3939 21.1364L29.0589 18.9713Z"
      fill="var(--badge-fg)"
      stroke="var(--badge-fg)"
      strokeWidth="1.7"
    />
    <path
      d="M23.621 28.9097C22.3217 29.5403 20.9249 29.8676 19.5019 29.8677C18.0789 29.8676 16.682 29.5403 15.3828 28.9097L19.5019 23.2388L23.621 28.9097Z"
      fill="var(--badge-fg)"
      stroke="var(--badge-fg)"
      strokeWidth="1.7"
    />
    <path
      d="M17.7137 17.7369L11.0477 15.5709C12.426 12.9989 14.8408 11.245 17.7137 10.7291V17.7369Z"
      stroke="var(--badge-fg)"
      strokeWidth="1.7"
    />
    <path
      d="M16.6055 21.1364L12.4863 26.8073C10.4658 24.7009 9.54349 21.862 9.94141 18.9713L16.6055 21.1364Z"
      fill="var(--badge-fg)"
      stroke="var(--badge-fg)"
      strokeWidth="1.7"
    />
  </svg>
);

export const StepThreeIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--badge-fg)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

// In-store step illustrations (virtual card / contactless), drawn to match the
// online steps above: same 24x24 stroked-line treatment, colored by --badge-fg
// and sized to 30px by .hsw-step-badge. Step 1 uses the Sezzle app mark image
// instead, so it has no glyph here.
export const InStoreStepTwoIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--badge-fg)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M2 10h20" />
  </svg>
);

export const InStoreStepThreeIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--badge-fg)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5.5 7.5a6 6 0 0 1 0 9" />
    <path d="M9.5 4.5a10 10 0 0 1 0 15" />
    <path d="M13.5 2a14 14 0 0 1 0 20" />
  </svg>
);
