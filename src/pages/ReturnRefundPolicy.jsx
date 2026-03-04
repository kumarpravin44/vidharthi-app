import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";

function ReturnRefundPolicy() {

  return (
    <>
      <InternalHeader title="Return & Refund Policy" />

      <div className="policy-page content">

        <div className="policy-card">

          <h2>Return & Refund Policy</h2>

          <p>
            At Vidharthi Store, we strive to ensure complete customer satisfaction. 
            This policy outlines our return and refund process.
          </p>

          <h3>1. Eligibility for Returns</h3>
          <p>
            Products can be returned within 7 days of delivery if they are:
          </p>
          <ul>
            <li>Damaged or defective</li>
            <li>Incorrect product delivered</li>
            <li>Expired products</li>
          </ul>

          <h3>2. Non-Returnable Items</h3>
          <p>
            The following items cannot be returned:
          </p>
          <ul>
            <li>Opened food products</li>
            <li>Perishable items</li>
            <li>Items without original packaging</li>
          </ul>

          <h3>3. Refund Process</h3>
          <p>
            Once your return request is approved, refunds will be processed within 
            5–7 business days to your original payment method.
          </p>

          <h3>4. Replacement Option</h3>
          <p>
            Customers may choose a replacement instead of a refund, 
            subject to product availability.
          </p>

          <h3>5. Cancellation Policy</h3>
          <p>
            Orders can be cancelled before dispatch. Once shipped, cancellation 
            may not be possible.
          </p>

          <h3>6. Contact Us</h3>
          <p>
            For return or refund requests, please contact our support team through 
            the app or email us at support@vidharthistore.com.
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

export default ReturnRefundPolicy;