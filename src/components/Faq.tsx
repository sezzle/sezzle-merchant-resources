// FAQ accordion. Single-open behavior (first item open by default, mirroring
// the design); the open panel animates via a CSS max-height transition.
import { useState } from "react";
import { ITranslation } from "../interface";
import { interpolate } from "../utils/interpolate";
import { FaqChevronIcon } from "./PaymentPlan/icons";
import { Footnotes } from "./PaymentPlan/footnotes";

interface FaqProps {
  translation: ITranslation;
  // Pay-in-5 is only offered in some markets (hidden in Canada). When it is not
  // offered, the "or 8 weeks for Pay in 5" clause is dropped from the payments
  // answer rather than promising a plan that isn't available.
  showPI5: boolean;
  footnotes: Footnotes;
}

const Faq = ({ translation, showPI5, footnotes }: FaqProps) => {
  // The design sets these markers inline at body size rather than as a <sup>.
  const faq1A = interpolate(translation.faq1A, {
    sezzleUp: footnotes.sezzleUp,
  });
  // The repayment period is a trigger term, so the answer carries the
  // pay-later disclosure.
  const faq2A = interpolate(translation.faq2A, {
    faq2APi5: showPI5 ? translation.faq2APi5 : "",
    payLater: footnotes.payLater,
  });
  const items = [
    { q: translation.faq1Q, a: faq1A },
    { q: translation.faq2Q, a: faq2A },
    { q: translation.faq3Q, a: translation.faq3A },
    { q: translation.faq4Q, a: translation.faq4A },
  ];
  const [open, setOpen] = useState(0);

  return (
    <section className="hsw-faq">
      <div className="hsw-faq-inner">
        <div className="hsw-section-head">
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
