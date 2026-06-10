// "How to pay with Sezzle" 3-step carousel, ported from the how-to-sezzle
// markup + handleCarousel in sezzle-widget-react's MultiPlanModal.js. The
// imperative DOM toggling is replaced with a single activeTab state value.
import { useState } from "react";
import { ITranslation } from "../../interface";
import { useConfig } from "../../containers/ConfigProvider";
import { ArrowLeftIcon, ArrowRightIcon, DotMarkerIcon } from "./icons";

const MIN_TAB = 1;
const MAX_TAB = 3;

const FULL_COLOR_LOGO =
  "https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg";
const WHITE_LOGO =
    "https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor_WhiteWM.svg";

const logoSrcForTheme = (theme: string): string => {
  switch (theme) {
    case "dark":
      return WHITE_LOGO;
    default:
      return FULL_COLOR_LOGO;
  }
};

const HowToPayCarousel = ({ translation }: { translation: ITranslation }) => {
  const { config } = useConfig();
  const [activeTab, setActiveTab] = useState(MIN_TAB);
  const steps = [
    translation.MultiPlanStep1,
    translation.MultiPlanStep2,
    translation.MultiPlanStep3,
  ];

  const leftDisabled = activeTab === MIN_TAB;
  const rightDisabled = activeTab === MAX_TAB;

  return (
    <div className="how-to-sezzle">
      <div className="carousel-header">
        <div className="how-to-text-wrapper">
          <span className="how-to-text">{translation.MultiPlanhowToPay}</span>
          <div className="how-to-logo">
            <img
              className="how-to-sezzle-logo"
              src={logoSrcForTheme(config?.theme ?? "light")}
              alt="Sezzle"
              style={{ height: "14px", width: "58px" }}
            />
          </div>
        </div>
        <div className="arrows">
          <button
            type="button"
            className={`arrow arrow-left${leftDisabled ? " disabled" : ""}`}
            disabled={leftDisabled}
            aria-label={translation.previousSlide}
            onClick={() => setActiveTab((t) => Math.max(t - 1, MIN_TAB))}
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            className={`arrow arrow-right${rightDisabled ? " disabled" : ""}`}
            disabled={rightDisabled}
            aria-label={translation.nextSlide}
            onClick={() => setActiveTab((t) => Math.min(t + 1, MAX_TAB))}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
      <div className={`carousel position-${activeTab}`}>
        {steps.map((step, i) => (
          <div className="carousel-item" key={i}>
            <div className="carousel-item-content">
              <div className="step-number">
                <span className="step-number-content">{i + 1}</span>
              </div>
              <div className="step-name">{step}</div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="carousel-dots"
        role="tablist"
        aria-label={translation.carouselPosition}
      >
        {[1, 2, 3].map((n) => (
          <div
            className={`dot${activeTab === n ? " active" : ""}`}
            role="tab"
            aria-selected={activeTab === n}
            aria-label={`${translation.slide} ${n}`}
            key={n}
          >
            <DotMarkerIcon />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToPayCarousel;
