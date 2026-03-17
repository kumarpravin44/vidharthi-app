import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { orderService } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import "boxicons/css/boxicons.min.css";

function MyOrders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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
    return statusMap[status.toLowerCase()] || 'pending';
  };

  if (loading) {
    return (
      <>
        <InternalHeader title="My Orders" />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading orders...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title="My Orders" />
      <div className="content">
        <div className="orders-page">

          {orders.length === 0 ? (
            <div className="empty-orders">
              <i className='bx bx-package' style={{ fontSize: '64px', color: '#ccc' }}></i>
              <p>No orders found</p>
              <button 
                className="primary-btn" 
                style={{ marginTop: '20px' }}
                onClick={() => navigate("/")}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div className="order-card" key={order.id}>

                <div className="order-header">
                  <div>
                    <h4>Order #{order.id.substring(0, 8)}</h4>
                    <p>{formatDate(order.created_at)}</p>
                  </div>

                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items">
                  {order.items?.map((item, idx) => (
                    <span key={idx}>
                      {item.product?.name || 'Product'} × {item.quantity}
                      {idx < order.items.length - 1 && ', '}
                    </span>
                  ))}
                </div>

                <div className="order-footer">
                  <h4>Total: ₹ {order.total?.toFixed(2) || '0.00'}</h4>
                  <button 
                    className="view-btn"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    View Details
                  </button>
                </div>

              </div>
            ))
          )}

        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default MyOrders;