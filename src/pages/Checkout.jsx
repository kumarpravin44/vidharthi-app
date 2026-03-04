import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";

function Checkout() {

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const cartItems = [
    { id: 1, name: "Tata Salt", price: 25, qty: 2 },
    { id: 2, name: "Basmati Rice", price: 120, qty: 1 }
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const deliveryCharge = 30;
  const total = subtotal + deliveryCharge;

  return (
    <>
      <InternalHeader title="Checkout" />
<div className="content" >
      <div className="checkout-page">

        

        {/* 🏠 Address Section */}
        <div className="checkout-card">
          <div className="card-header">
            <i className='bx bx-map'></i>
            <h4>Delivery Address</h4>
          </div>

          <p>Pravin Kumar</p>
          <p>Flat 204, Yahavi Vanaha Society</p>
          <p>Pune - 411021</p>
          <p>📞 9876543210</p>

          <button className="edit-btn">
            Change Address
          </button>
        </div>

        {/* 🛒 Order Summary */}
        <div className="checkout-card">
          <div className="card-header">
            <i className='bx bx-cart'></i>
            <h4>Order Summary</h4>
          </div>

          {cartItems.map(item => (
            <div className="summary-item" key={item.id}>
              <span>{item.name} × {item.qty}</span>
              <span>₹ {item.price * item.qty}</span>
            </div>
          ))}

          <div className="price-row">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>

          <div className="price-row">
            <span>Delivery</span>
            <span>₹ {deliveryCharge}</span>
          </div>

          <div className="price-total">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>
        </div>

        {/* 💳 Payment Method */}
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

          {/* <div className="payment-option">
            <label>
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI / Card / Net Banking
            </label>
          </div> */}
        </div>

      </div>
      </div>

      {/* 🔥 Sticky Bottom */}
      <div className="place-order-bar">
        <button className="place-order-btn">
          Place Order ₹ {total}
        </button>
      </div>

      <BottomNav />
    </>
  );
}

export default Checkout;