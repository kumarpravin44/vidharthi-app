import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { adminService } from "../../services/adminService";
import Loader from "../../components/Loader";
import "boxicons/css/boxicons.min.css";

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    loadOrder();
  }, [id, navigate]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOrderDetail(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
      showPopup("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change order status to "${newStatus}"?`)) {
      return;
    }

    setUpdatingStatus(true);
    try {
      await adminService.updateOrderStatus(id, newStatus);
      showPopup("Order status updated successfully");
      loadOrder(); // Reload order to get updated data
    } catch (error) {
      console.error('Failed to update order status:', error);
      showPopup("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
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

  const getStatusColor = (status) => {
    const colors = {
      placed: 'orange',
      confirmed: 'blue',
      packed: 'purple',
      out_for_delivery: 'info',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status?.toLowerCase()] || 'gray';
  };

  if (loading) {
    return <Loader text="Loading order details..." />;
  }

  if (!order) {
    return (
      <>
        <AdminHeader />
        <div className="admin-content">
          <div className="admin-page-header">
            <h1>Order Not Found</h1>
          </div>
          <p style={{ textAlign: 'center', padding: '40px' }}>Order not found</p>
          <button 
            className="primary-btn" 
            style={{ margin: '0 auto', display: 'block' }}
            onClick={() => navigate("/admin/orders")}
          >
            Back to Orders
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Order Details</h1>
            <p>Order #{order.id}</p>
          </div>
          <button 
            className="secondary-btn"
            onClick={() => navigate("/admin/orders")}
          >
            <i className='bx bx-arrow-back'></i> Back to Orders
          </button>
        </div>

        <div className="admin-order-detail">
          {/* Order Overview */}
          <div className="detail-card">
            <div className="card-header">
              <h3><i className='bx bx-receipt'></i> Order Overview</h3>
              <span className={`status-badge ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Order ID:</label>
                <span><strong>#{order.id}</strong></span>
              </div>
              <div className="detail-item">
                <label>Order Date:</label>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="detail-item">
                <label>Payment Method:</label>
                <span className={`payment-badge ${order.payment_method}`}>
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </div>
              <div className="detail-item">
                <label>Total Items:</label>
                <span>{order.items?.length || 0} items</span>
              </div>
            </div>
            {order.cancel_reason && (
              <div className="cancel-reason">
                <i className='bx bx-info-circle'></i>
                <strong>Cancellation Reason:</strong> {order.cancel_reason}
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="detail-card">
            <div className="card-header">
              <h3><i className='bx bx-user'></i> Customer Information</h3>
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Name:</label>
                <span>{order.user?.full_name || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Phone:</label>
                <span>{order.user?.phone || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{order.user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="detail-card">
            <div className="card-header">
              <h3><i className='bx bx-map'></i> Delivery Address</h3>
            </div>
            <p>{order.delivery_address}</p>
            {order.notes && (
              <div className="order-notes">
                <strong>Order Notes:</strong> {order.notes}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="detail-card">
            <div className="card-header">
              <h3><i className='bx bx-package'></i> Order Items</h3>
            </div>
            <div className="order-items-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div>
                          <strong>{item.product_name || 'Product'}</strong>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            ID: {item.product_id.substring(0, 8)}
                          </div>
                        </div>
                      </td>
                      <td>₹{item.unit_price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td><strong>₹{item.subtotal.toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="detail-card">
            <div className="card-header">
              <h3><i className='bx bx-calculator'></i> Price Details</h3>
            </div>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal ({order.items?.length || 0} items):</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charge:</span>
                <span>₹{order.delivery_charge.toFixed(2)}</span>
              </div>
              <div className="price-row total-row">
                <strong>Total Amount:</strong>
                <strong>₹{order.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Order Status Management */}
          <div className="detail-card">
            <div className="card-header">
              <h3><i className='bx bx-refresh'></i> Update Order Status</h3>
            </div>
            <div className="status-update-section">
              <p>Current Status: <span className={`status-badge ${getStatusColor(order.status)}`}>{order.status}</span></p>
              {(order.status === 'delivered' || order.status === 'cancelled') && (
                <p className="status-note">
                  <i className='bx bx-info-circle'></i>
                  This order is {order.status}. Status cannot be changed.
                </p>
              )}
              <div className="status-buttons">
                <button 
                  className="status-btn placed"
                  onClick={() => handleStatusChange('placed')}
                  disabled={updatingStatus || order.status === 'placed' || order.status === 'delivered' || order.status === 'cancelled'}
                >
                  Placed
                </button>
                <button 
                  className="status-btn confirmed"
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={updatingStatus || order.status === 'confirmed' || order.status === 'delivered' || order.status === 'cancelled'}
                >
                  Confirmed
                </button>
                <button 
                  className="status-btn packed"
                  onClick={() => handleStatusChange('packed')}
                  disabled={updatingStatus || order.status === 'packed' || order.status === 'delivered' || order.status === 'cancelled'}
                >
                  Packed
                </button>
                <button 
                  className="status-btn out-for-delivery"
                  onClick={() => handleStatusChange('out_for_delivery')}
                  disabled={updatingStatus || order.status === 'out_for_delivery' || order.status === 'delivered' || order.status === 'cancelled'}
                >
                  Out for Delivery
                </button>
                <button 
                  className="status-btn delivered"
                  onClick={() => handleStatusChange('delivered')}
                  disabled={updatingStatus || order.status === 'delivered' || order.status === 'cancelled'}
                >
                  Delivered
                </button>
                <button 
                  className="status-btn cancelled"
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={updatingStatus || order.status === 'cancelled' || order.status === 'delivered'}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          {order.tracking && order.tracking.length > 0 && (
            <div className="detail-card">
              <div className="card-header">
                <h3><i className='bx bx-time-five'></i> Order Tracking Timeline</h3>
              </div>
              <div className="tracking-timeline">
                {order.tracking.map((track, idx) => (
                  <div className="tracking-event" key={idx}>
                    <div className="tracking-dot"></div>
                    <div className="tracking-content">
                      <p className="tracking-status">
                        <span className={`status-badge ${getStatusColor(track.status)}`}>
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
        </div>
      </div>

      {popupMessage && (
        <div className="admin-popup">
          <div className="admin-popup-content">
            <i className='bx bx-check-circle'></i>
            <span>{popupMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminOrderDetail;
