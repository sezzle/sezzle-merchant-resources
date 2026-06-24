// "How Sezzle works" — three step cards. Reuses the brand step illustrations
// from PaymentPlan/icons. The anchor id is the target of the hero's
// "See how it works" link.
import { ITranslation } from "../interface";
import { StepOneIcon, StepTwoIcon, StepThreeIcon } from "./PaymentPlan/icons";

interface HowItWorksProps {
  translation: ITranslation;
}

const HowItWorks = ({ translation }: HowItWorksProps) => {
  const steps = [
    { Icon: StepOneIcon, title: translation.hiwStep1Title, body: translation.hiwStep1Body },
    { Icon: StepTwoIcon, title: translation.hiwStep2Title, body: translation.hiwStep2Body },
    { Icon: StepThreeIcon, title: translation.hiwStep3Title, body: translation.hiwStep3Body },
  ];

  return (
    <section id="how-it-works" className="hsw-hiw">
      <div className="hsw-inner">
        <div className="hsw-section-head">
          <span className="hsw-eyebrow">{translation.hiwEyebrow}</span>
          <h2 className="hsw-section-title">{translation.hiwTitle}</h2>
          <p className="hsw-section-sub">{translation.hiwSubcopy}</p>
        </div>
        <div className="hsw-hiw-grid">
          {steps.map(({ Icon, title, body }, i) => (
            <div className="hsw-step-card" key={i}>
              <div className="hsw-step-badge">
                <div className="step-image">
                  <Icon />
                </div>
              </div>
              <div className="hsw-step-num">
                {translation.hiwStepLabel} {i + 1}
              </div>
              <h3 className="hsw-step-title">{title}</h3>
              <p className="hsw-step-body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
