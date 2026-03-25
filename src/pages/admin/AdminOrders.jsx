import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { adminService } from "../../services/adminService";
import "boxicons/css/boxicons.min.css";
import Loader from "../../components/Loader";

function AdminOrders() {
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOrders();
      setAllOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showPopup("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders on the client side
  const filteredOrders = filterStatus
    ? allOrders.filter(order => order.status === filterStatus)
    : allOrders;

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    try {
      debugger;
      await adminService.updateOrderStatus(orderId, newStatus);
      showPopup("Order status updated successfully");
      await loadOrders();
    } catch (error) {
      showPopup("Failed to update order status");
    } finally {
      // setLoading(false);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loader text="Loading orders..." />;
  }

  return (
    <>
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Orders Management</h1>
            <p>Manage customer orders and fulfillment {filterStatus && `(Showing ${filteredOrders.length} ${filterStatus} order${filteredOrders.length !== 1 ? 's' : ''})`}</p>
          </div>
          <div className="filter-section">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Orders</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>
                      <div>{order.user?.full_name || 'N/A'}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {order.user?.phone || ''}
                      </div>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td><strong>₹{order.subtotal?.toFixed(2) || '0.00'}</strong></td>
                    <td>
                      <span className={`payment-badge ${order.payment_method}`}>
                        {order.payment_method === 'cod' ? 'COD' : 'Online'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => navigate(`/admin/order/${order.id}`)}
                          title="View Details"
                        >
                          <i className='bx bx-show'></i>
                        </button>
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packed">Packed</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

export default AdminOrders;
