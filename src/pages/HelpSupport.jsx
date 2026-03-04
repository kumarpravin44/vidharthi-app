import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";

function HelpSupport() {

  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How can I track my order?",
      answer: "Go to My Orders section and click on View Details to track your order."
    },
    {
      question: "How can I cancel my order?",
      answer: "Orders can be cancelled before they are shipped from My Orders page."
    },
    {
      question: "How do I change my address?",
      answer: "You can update your address from Saved Addresses section."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can call us or email us using the options below."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <InternalHeader title="Help & Support" />

      <div className="help-page page-container content">

        {/* 📌 FAQ Section */}
        <div className="help-card">
          <h3 className="section-heading">Frequently Asked Questions</h3>

          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <i className={`bx ${activeIndex === index ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
              </div>

              {activeIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

        </div>

        {/* 📞 Contact Support */}
        <div className="help-card">
          <h3 className="section-heading">Contact Support</h3>

          <div className="contact-item">
            <i className='bx bx-phone'></i>
            <span>+91 9876543210</span>
          </div>

          <div className="contact-item">
            <i className='bx bx-envelope'></i>
            <span>support@vidharthi.com</span>
          </div>

          <button className="chat-btn">
            <i className='bx bx-chat'></i> Chat With Us
          </button>
        </div>

      </div>

      <BottomNav />
    </>
  );
}

export default HelpSupport;