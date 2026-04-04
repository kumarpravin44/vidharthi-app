import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useLanguage } from "../context/LanguageContext";
import "boxicons/css/boxicons.min.css";

function HelpSupport() {

  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: t("faq_q1"),
      answer: t("faq_a1")
    },
    {
      question: t("faq_q2"),
      answer: t("faq_a2")
    },
    {
      question: t("faq_q3"),
      answer: t("faq_a3")
    },
    {
      question: t("faq_q4"),
      answer: t("faq_a4")
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <InternalHeader title={t("help_support")} />

      <div className="help-page page-container content">

        {/* FAQ */}
        <div className="help-card">
          <h3 className="section-heading">
            {t("faq_heading")}
          </h3>

          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <i className={`bx ${
                  activeIndex === index
                    ? "bx-chevron-up"
                    : "bx-chevron-down"
                }`}></i>
              </div>

              {activeIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

        </div>

        {/* Contact */}
        <div className="help-card">
          <h3 className="section-heading">
            {t("contact_support")}
          </h3>

          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>{t("support_phone")}</span>
          </div>

          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <span>{t("support_email")}</span>
          </div>

          <button className="chat-btn">
            <i className="bx bx-chat"></i>
            {t("chat_with_us")}
          </button>
        </div>

      </div>

      <BottomNav />
    </>
  );
}

export default HelpSupport;