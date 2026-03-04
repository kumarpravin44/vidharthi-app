import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";

function PrivacyPolicy() {

  return (
    <>
      <InternalHeader title="Privacy Policy" />

      <div className="privacy-page content">

        <div className="privacy-card">

          <h2>Privacy Policy</h2>
          <p>
            At Vidharthi Store, your privacy is very important to us. 
            This Privacy Policy explains how we collect, use, and protect your information.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We may collect personal information such as your name, phone number, 
            email address, delivery address, and payment details when you use our app.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use your information to process orders, provide customer support, 
            improve our services, and send important updates.
          </p>

          <h3>3. Data Protection</h3>
          <p>
            We implement appropriate security measures to protect your data 
            from unauthorized access, alteration, or disclosure.
          </p>

          <h3>4. Sharing of Information</h3>
          <p>
            We do not sell or rent your personal information to third parties. 
            Information may be shared with trusted service providers only for order fulfillment.
          </p>

          <h3>5. Cookies & Tracking</h3>
          <p>
            Our app may use cookies and tracking technologies to enhance user experience 
            and analyze app performance.
          </p>

          <h3>6. Your Rights</h3>
          <p>
            You have the right to access, update, or delete your personal information. 
            You may contact us for any privacy-related concerns.
          </p>

          <h3>7. Updates to Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. 
            Changes will be reflected on this page.
          </p>

          <p className="last-updated">
            Last Updated: June 2026
          </p>

        </div>

      </div>

      <BottomNav />
    </>
  );
}

export default PrivacyPolicy;