export const DotIcon = () => (
  <svg
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.39999 12C10.6091 12 12.4 10.2091 12.4 8C12.4 5.79086 10.6091 4 8.39999 4C6.19085 4 4.39999 5.79086 4.39999 8C4.39999 10.2091 6.19085 12 8.39999 12Z"
      fill="var(--indicator)"
    />
  </svg>
);

// Small check used by the hero "Trusted by millions" line. Uses the theme
// progress/success indicator (Bold Plum on light, Bold Green on dark).
export const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--green-bold)"
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

export const AppStoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.365 1.43c0 1.14-.467 2.227-1.225 3.02-.81.85-2.14 1.5-3.24 1.41-.13-1.09.43-2.26 1.13-3 .79-.85 2.18-1.47 3.21-1.51.03.04.12.05.12.08zM20.94 17.06c-.55 1.28-.82 1.85-1.53 2.98-.99 1.58-2.39 3.54-4.12 3.55-1.54.02-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.73-.02-3.06-1.79-4.05-3.37-2.77-4.42-3.06-9.6-1.35-12.35.96-1.53 2.47-2.43 3.89-2.43 1.45 0 2.36.99 3.56.99 1.16 0 1.87-.99 3.55-.99 1.27 0 2.61.69 3.57 1.88-3.14 1.72-2.63 6.2.56 7.74z" />
  </svg>
);

export const GooglePlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3.6 2.3 13 11.7 3.6 21.1c-.4-.2-.7-.6-.7-1.2V3.5c0-.6.3-1 .7-1.2zm10.7 10.6 2.6 2.6-9.4 5.4 6.8-8zm3.9-3.9 2.9 1.7c.6.4.6 1.3 0 1.7l-2.9 1.7-2.9-2.5 2.8-2.6zM6.9 2.6l9.4 5.4-2.6 2.6-6.8-8z" />
  </svg>
);

// "How Sezzle works" step illustrations, matching the redesign: simple stroked
// line icons (storefront / options / check-circle). Color comes from the
// stroke — violet for steps 1-2, jade for step 3 — and CSS sizes them to 30px.
export const StepOneIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--accent)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const StepTwoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--accent)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="21" x2="14" y1="4" y2="4" />
    <line x1="10" x2="3" y1="4" y2="4" />
    <line x1="21" x2="12" y1="12" y2="12" />
    <line x1="8" x2="3" y1="12" y2="12" />
    <line x1="21" x2="16" y1="20" y2="20" />
    <line x1="12" x2="3" y1="20" y2="20" />
    <line x1="14" x2="14" y1="2" y2="6" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="16" x2="16" y1="18" y2="22" />
  </svg>
);

export const StepThreeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--accent)"
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
