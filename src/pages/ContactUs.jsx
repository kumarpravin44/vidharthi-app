import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useAppSettings } from "../context/AppSettingsContext";
import { useTranslation } from "react-i18next"; // 👈 ADD
import "boxicons/css/boxicons.min.css";

function ContactUs() {
  const { settings: appSettings } = useAppSettings();
  const { t } = useTranslation(); // 👈 ADD

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t("message_sent")); // 👈 translated
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <InternalHeader title={t("contact_us")} />

      <div className="contact-page content">
        <div className="contact-card">

          <h2>{t("get_in_touch")}</h2>

          <p className="contact-subtitle">
            {t("contact_subtitle")}
          </p>

          {/* Contact Info */}
          <div className="contact-info">

            <div className="info-item">
              <i className='bx bx-phone'></i>
              <span>{appSettings.store_phone || "+91 98765 43210"}</span>
            </div>

            <div className="info-item">
              <i className='bx bx-envelope'></i>
              <span>{appSettings.store_email || "support@vidharthistore.com"}</span>
            </div>

            <div className="info-item">
              <i className='bx bx-map'></i>
              <span>{appSettings.store_address || "Pune, Maharashtra, India"}</span>
            </div>

          </div>

          {/* Contact Form (optional) */}
          {/* 
          <form onSubmit={handleSubmit} className="contact-form">

            <input
              type="text"
              name="name"
              placeholder={t("your_name")}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder={t("your_email")}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder={t("your_message")}
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button type="submit" className="primary-btn">
              {t("send_message")}
            </button>

          </form> 
          */}

        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default ContactUs;