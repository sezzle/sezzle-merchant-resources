// FAQ accordion. Single-open behavior (first item open by default, mirroring
// the design); the open panel animates via a CSS max-height transition.
import { useState } from "react";
import { ITranslation } from "../interface";
import { FaqChevronIcon } from "./PaymentPlan/icons";

interface FaqProps {
  translation: ITranslation;
}

const Faq = ({ translation }: FaqProps) => {
  const items = [
    { q: translation.faq1Q, a: translation.faq1A },
    { q: translation.faq2Q, a: translation.faq2A },
    { q: translation.faq3Q, a: translation.faq3A },
    { q: translation.faq4Q, a: translation.faq4A },
    { q: translation.faq5Q, a: translation.faq5A },
  ];
  const [open, setOpen] = useState(0);

  return (
    <section className="hsw-faq">
      <div className="hsw-faq-inner">
        <div className="hsw-section-head">
          <span className="hsw-eyebrow">{translation.faqEyebrow}</span>
          <h2 className="hsw-section-title">{translation.faqTitle}</h2>
        </div>
        <div className="hsw-faq-list">
          {items.map((item, i) => {
            const expanded = open === i;
            return (
              <div className="hsw-faq-item" key={i}>
                <button
                  className="hsw-faq-q"
                  aria-expanded={expanded}
                  aria-controls={`hsw-faq-a-${i}`}
                  onClick={() => setOpen(expanded ? -1 : i)}
                >
                  {item.q}
                  <FaqChevronIcon />
                </button>
                <div
                  id={`hsw-faq-a-${i}`}
                  className={`hsw-faq-a${expanded ? " is-open" : ""}`}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
