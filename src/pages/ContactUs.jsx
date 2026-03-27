import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useAppSettings } from "../context/AppSettingsContext";
import "boxicons/css/boxicons.min.css";

function ContactUs() {
  const { settings: appSettings } = useAppSettings();

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
    alert("Message sent successfully ✅");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <InternalHeader title="Contact Us" />

      <div className="contact-page content">

        <div className="contact-card">

          <h2>Get in Touch</h2>
          <p className="contact-subtitle">
            We'd love to hear from you. Send us your queries anytime.
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

          {/* Contact Form */}
          {/* <form onSubmit={handleSubmit} className="contact-form">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button type="submit" className="primary-btn">
              Send Message
            </button>

          </form> */}

        </div>

      </div>

      <BottomNav />
    </>
  );
}

export default ContactUs;