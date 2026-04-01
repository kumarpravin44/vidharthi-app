import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { orderService } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import "boxicons/css/boxicons.min.css";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { getLocalizedName } = useLanguage();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadOrder();
  }, [id, isAuthenticated, navigate]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'placed': 'pending',
      'confirmed': 'confirmed',
      'packed': 'processing',
      'out_for_delivery': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusMap[status?.toLowerCase()] || 'pending';
  };

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handleRepeatOrder = async () => {
    console.log('Repeat order clicked:', order);
    
    if (!order?.items || order.items.length === 0) {
      console.log('No items in order');
      showPopup("No items found in this order", "error");
      return;
    }

    console.log('Order items:', order.items);
    setReordering(true);
    
    try {
      for (const item of order.items) {
        console.log('Adding item to cart:', item);
        await addItem(item.product_id, item.quantity);
      }
      showPopup("Items added to cart! 🛒", "success");
      setTimeout(() => navigate("/cart"), 1500);
    } catch (error) {
      console.error('Error repeating order:', error);
      showPopup(error.message || "Failed to add some items", "error");
    } finally {
      setReordering(false);
    }
  };

  if (loading) {
    return (
      <>
        <InternalHeader title="Order Details" />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading order...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <InternalHeader title="Order Details" />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '40px' }}>Order not found</p>
          <button 
            className="primary-btn" 
            style={{ margin: '0 auto', display: 'block' }}
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title="Order Details" />
      <div className="content">
        <div className="order-detail-page">

          {/* Order Summary */}
          <div className="order-summary-card">
            <div className="order-header-row">
              <div>
                <h3>Order #{order.id.substring(0, 8)}</h3>
                <p className="order-date">{formatDate(order.created_at)}</p>
              </div>
              <span className={`status-badge ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            {order.cancel_reason && (
              <div className="cancel-reason">
                <strong>Cancellation Reason:</strong> {order.cancel_reason}
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="info-card">
            <h4><i className='bx bx-map'></i> Delivery Address</h4>
            <p>{order.delivery_address}</p>
            {order.notes && (
              <p className="notes"><strong>Notes:</strong> {order.notes}</p>
            )}
          </div>

          {/* Order Items */}
          <div className="info-card">
            <h4><i className='bx bx-package'></i> Items</h4>
            <div className="order-items-list">
              {order.items?.map((item, idx) => (
                <div 
                  className="order-item-row clickable" 
                  key={idx}
                  onClick={() => item.product?.id && navigate(`/product/${item.product.id}`)}
                  style={{ cursor: item.product?.id ? 'pointer' : 'default' }}
                >
                  {item.product?.image_url && (
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name}
                      className="order-item-image"
                    />
                  )}
                  <div className="order-item-details">
                    <p className="item-name">
                      {getLocalizedName(item.product) || `Product ID: ${item.product_id.substring(0, 8)}`}
                    </p>
                    <p className="item-qty">Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-prices">
                    <p>₹{item.unit_price} × {item.quantity}</p>
                    <p className="item-subtotal">₹{item.subtotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="info-card">
            <h4><i className='bx bx-receipt'></i> Price Details</h4>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charge</span>
                <span>₹{order.delivery_charge.toFixed(2)}</span>
              </div>
              <div className="price-row total-row">
                <strong>Total</strong>
                <strong>₹{order.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          {order.tracking && order.tracking.length > 0 && (
            <div className="info-card">
              <h4><i className='bx bx-time-five'></i> Order Tracking</h4>
              <div className="tracking-timeline">
                {order.tracking.map((track, idx) => (
                  <div className="tracking-event" key={idx}>
                    <div className="tracking-dot"></div>
                    <div className="tracking-content">
                      <p className="tracking-status">
                        <span className={`status-badge ${getStatusClass(track.status)}`}>
                          {track.status}
                        </span>
                      </p>
                      {track.description && <p className="tracking-desc">{track.description}</p>}
                      <p className="tracking-time">{formatDate(track.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="order-detail-actions">
            <button
              className="repeat-order-btn-lg"
              onClick={handleRepeatOrder}
              disabled={reordering}
            >
              <i className='bx bx-revision'></i>
              {reordering ? "Adding to Cart..." : "Repeat This Order"}
            </button>
            <button 
              className="primary-btn" 
              style={{ width: '100%' }}
              onClick={() => navigate("/orders")}
            >
              Back to Orders
            </button>
          </div>

        </div>
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

export default OrderDetail;
