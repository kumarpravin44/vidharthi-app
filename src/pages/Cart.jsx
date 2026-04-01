import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getImageWithFallback, noImagePlaceholder } from "../utils/placeholderImage";
import { useLanguage } from "../context/LanguageContext";
import "boxicons/css/boxicons.min.css";

import saltImg from "../images/product/salt.webp";

function Cart() {
  const navigate = useNavigate();
  const { cart, loading, totalAmount, updateItem, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { getLocalizedName } = useLanguage();
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 1000);
  };

  // Increase Quantity
  const increaseQty = async (productId, currentQty) => {
    try {
      await updateItem(productId, currentQty + 1);
    } catch (error) {
      showPopup(error.message || "Failed to update quantity");
    }
  };

  // Decrease Quantity
  const decreaseQty = async (productId, currentQty) => {
    if (currentQty > 1) {
      try {
        await updateItem(productId, currentQty - 1);
      } catch (error) {
        showPopup(error.message || "Failed to update quantity");
      }
    }
  };

  // Remove Item
  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId);
      showPopup("Item removed from cart");
    } catch (error) {
      showPopup(error.message || "Failed to remove item");
    }
  };

  if (loading) {
    return (
      <>
        <InternalHeader title="My Cart" />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading cart...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <>
      <InternalHeader title="My Cart" />

      <div className="content">
        <div className="cart-page">

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className='bx bx-cart' style={{ fontSize: '64px', color: '#ccc' }}></i>
              <p>Your cart is empty</p>
              <Link to="/" className="primary-btn" style={{ marginTop: '20px' }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {cartItems.map(item => (
                <div className="cart-item" key={item.product_id}>

                  <img 
                    src={getImageWithFallback(item.product?.image_url)} 
                    alt={item.product?.name || 'Product'}
                    onError={(e) => e.target.src = noImagePlaceholder}
                  />

                  <div className="cart-details">
                    <h4>{getLocalizedName(item.product)}</h4>
                    <p>₹ {item.unit_price}</p>

                    <div className="qty-controls">
                      <button onClick={() => decreaseQty(item.product_id, item.quantity)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.product_id, item.quantity)}>+</button>
                    </div>
                  </div>

                  <i
                    className='bx bx-trash remove-icon'
                    onClick={() => handleRemoveItem(item.product_id)}
                  ></i>

                </div>
              ))}

              <div className="cart-summary">
                <h3>Total: ₹ {totalAmount.toFixed(2)}</h3>
                <Link to="/checkout" className="checkout-btn">
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}

        </div>
      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i className="bx bx-info-circle success-icon"></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default Cart;