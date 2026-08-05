// "How Sezzle works" step cards. Reuses the brand step illustrations from
// PaymentPlan/icons. The anchor id is the target of the hero's "See how it
// works" link.
//
// Merchants who also accept Sezzle at the register (`includeInStore`) get a
// second, labelled group of steps covering the app + virtual-card flow. With
// in-store off, the section renders exactly one unlabelled group of three
// cards, as it always has.
import { ReactNode } from "react";
import { ITranslation } from "../interface";
import { interpolate } from "../utils/interpolate";
import { APP_URL } from "../constants";
import {
  StepOneIcon,
  StepTwoIcon,
  StepThreeIcon,
  InStoreStepTwoIcon,
  InStoreStepThreeIcon,
} from "./PaymentPlan/icons";
import { Footnotes } from "./PaymentPlan/footnotes";
import { withFootnote } from "../utils/footnoteText";
// The in-store flow opens in the Sezzle app, so step 1 carries the app mark
// itself rather than a generic phone glyph.
import sezzleMark from "../assets/sezzle-mark-white.webp";

interface Step {
  Icon: () => ReactNode;
  title: string;
  body: ReactNode;
  // Optional trailing link (the in-store flow starts in the Sezzle app).
  cta?: ReactNode;
}

interface StepGroupProps {
  translation: ITranslation;
  steps: Step[];
  // Group heading. Omitted when the section shows a single group, in which case
  // there is nothing to distinguish and the step titles sit directly under the
  // section's <h2>.
  title?: string;
}

// Step titles drop to <h4> when a group heading occupies <h3>, so the heading
// outline under the section <h2> stays contiguous either way.
const StepGroup = ({ translation, steps, title }: StepGroupProps) => {
  const StepTitle = title ? "h4" : "h3";

  return (
    <>
      {title && <h3 className="hsw-hiw-group-title">{title}</h3>}
      <div className="hsw-hiw-grid">
        {steps.map(({ Icon, title: stepTitle, body, cta }, i) => (
          <div className="hsw-step-card" key={i}>
            <div className="hsw-step-badge">
              <div className="step-image">
                <Icon />
              </div>
            </div>
            <div className="hsw-step-num">
              {translation.hiwStepLabel} {i + 1}
            </div>
            <StepTitle className="hsw-step-title">{stepTitle}</StepTitle>
            <p className="hsw-step-body">{body}</p>
            {cta}
          </div>
        ))}
      </div>
    </>
  );
};

interface HowItWorksProps {
  translation: ITranslation;
  // Merchant accepts Sezzle in-store as well as online (config-driven).
  includeInStore: boolean;
  footnotes: Footnotes;
  // Interpolated into the in-store copy ("search for {merchantName} in the
  // Sezzle app"), matching the hero and footer personalization.
  merchantName: string;
}

const HowItWorks = ({
  translation,
  includeInStore,
  merchantName,
  footnotes,
}: HowItWorksProps) => {
  const onlineSteps: Step[] = [
    {
      Icon: StepOneIcon,
      title: translation.hiwStep1Title,
      body: translation.hiwStep1Body,
    },
    {
      Icon: StepTwoIcon,
      title: translation.hiwStep2Title,
      body: translation.hiwStep2Body,
    },
    {
      Icon: StepThreeIcon,
      title: translation.hiwStep3Title,
      body: translation.hiwStep3Body,
    },
  ];

  const inStoreSteps: Step[] = [
    {
      Icon: () => <img src={sezzleMark} alt="" />,
      title: translation.hiwInStore1Title,
      body: interpolate(translation.hiwInStore1Body, { merchantName }),
      cta: (
        <a
          className="hsw-step-link"
          href={APP_URL}
          target="_blank"
          rel="noreferrer"
        >
          {translation.appGetTheApp}
        </a>
      ),
    },
    {
      Icon: InStoreStepTwoIcon,
      title: translation.hiwInStore2Title,
      body: withFootnote(translation.hiwInStore2Body, footnotes.virtualCard),
    },
    {
      Icon: InStoreStepThreeIcon,
      title: translation.hiwInStore3Title,
      body: translation.hiwInStore3Body,
    },
  ];

  // With both channels on offer the section covers two flows, so the
  // online-only subcopy no longer reads true — swap in the both-channels
  // wording. Either way it names the merchant.
  const subcopy = interpolate(
    includeInStore ? translation.hiwSubcopyInStore : translation.hiwSubcopy,
    { merchantName }
  );

  return (
    <section id="how-it-works" className="hsw-hiw">
      <div className="hsw-inner">
        <div className="hsw-section-head hsw-section-head-narrow">
          <h2 className="hsw-section-title">{translation.hiwTitle}</h2>
          <p className="hsw-section-sub">{subcopy}</p>
        </div>
        <StepGroup
          translation={translation}
          steps={onlineSteps}
          title={includeInStore ? translation.hiwOnlineGroupTitle : undefined}
        />
        {includeInStore && (
          <StepGroup
            translation={translation}
            steps={inStoreSteps}
            title={translation.hiwInStoreGroupTitle}
          />
        )}
      </div>
    </section>
  );
};

export default HowItWorks;
