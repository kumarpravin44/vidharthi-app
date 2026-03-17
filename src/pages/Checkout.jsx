import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import { useLoader } from "../context/LoaderContext";
import "boxicons/css/boxicons.min.css";

function Checkout() {
  const navigate = useNavigate();
  const { cart, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { setLoading } = useLoader();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const deliveryCharge = 30;
  const total = totalAmount + deliveryCharge;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate("/cart");
    }
  }, [isAuthenticated, cart, navigate]);

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress) {
      showPopup("Please provide a delivery address", "error");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        notes: ""
      };

      const order = await orderService.createOrder(orderData);
      setLoading(false);
      showPopup("Order placed successfully! 🎉", "success");
      
      setTimeout(() => {
        navigate(`/orders`);
      }, 2000);
    } catch (error) {
      setLoading(false);
      showPopup(error.message || "Failed to place order", "error");
    }
  };

  if (!cart || !cart.items) {
    return (
      <>
        <InternalHeader title="Checkout" />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title="Checkout" />
      <div className="content">
        <div className="checkout-page">

          {/* Address Section */}
          <div className="checkout-card">
            <div className="card-header">
              <i className='bx bx-map'></i>
              <h4>Delivery Address</h4>
            </div>

            <textarea
              placeholder="Enter your full delivery address..."
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginTop: '10px',
                fontSize: '14px'
              }}
            />

            <p style={{ marginTop: '10px', color: '#666' }}>
              {user?.full_name && `👤 ${user.full_name}`}
              {user?.phone && ` | 📞 ${user.phone}`}
            </p>
          </div>

          {/* Order Summary */}
          <div className="checkout-card">
            <div className="card-header">
              <i className='bx bx-cart'></i>
              <h4>Order Summary</h4>
            </div>

            {cart.items.map(item => (
              <div className="summary-item" key={item.product_id}>
                <span>{item.product?.name} × {item.quantity}</span>
                <span>₹ {(item.product?.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="price-row">
              <span>Subtotal</span>
              <span>₹ {totalAmount.toFixed(2)}</span>
            </div>

            <div className="price-row">
              <span>Delivery</span>
              <span>₹ {deliveryCharge}</span>
            </div>

            <div className="price-total">
              <span>Total</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-card">
            <div className="card-header">
              <i className='bx bx-credit-card'></i>
              <h4>Payment Method</h4>
            </div>

            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
            </div>

            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Online Payment
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom */}
      <div className="place-order-bar">
        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order ₹ {total.toFixed(2)}
        </button>
      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i
              className={`bx ${
                popupType === "success"
                  ? "bx-check-circle success-icon"
                  : "bx-error error-icon"
              }`}
            ></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default Checkout;