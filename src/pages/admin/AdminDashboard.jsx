import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { adminService } from "../../services/adminService";
import "boxicons/css/boxicons.min.css";
import Loader from "../../components/Loader";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setLoading(false);
      
      // Show error state with zeros
      setStats({
        total_users: 0,
        total_products: 0,
        out_of_stock_products: 0,
        total_orders: 0,
        total_revenue: 0,
        pending_orders: 0,
        delivered_orders: 0,
        cancelled_orders: 0,
        active_users: 0,
      });
      alert('Failed to load dashboard stats. Please try refreshing the page.');
    }
  };

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <>
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Dashboard</h1>
          <p>Overview of your e-commerce store</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">
              <i className='bx bx-user'></i>
            </div>
            <div className="stat-info">
              <h3>{stats.total_users || 0}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">
              <i className='bx bx-box'></i>
            </div>
            <div className="stat-info">
              <h3>{stats.total_products || 0}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card red">
            <div className="stat-icon">
              <i className='bx bx-block'></i>
            </div>
            <div className="stat-info">
              <h3>{stats.out_of_stock_products || 0}</h3>
              <p>Out of Stock</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">
              <i className='bx bx-cart'></i>
            </div>
            <div className="stat-info">
              <h3>{stats.total_orders || 0}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">
              <i className='bx bx-rupee'></i>
            </div>
            <div className="stat-info">
              <h3>₹{(stats.total_revenue || 0).toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card yellow">
            <div className="stat-icon">
              <i className='bx bx-time'></i>
            </div>
            <div className="stat-info">
              <h3>{stats.pending_orders || 0}</h3>
              <p>Pending Orders</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <i className='bx bx-check-circle'></i>
            </div>
            <div className="stat-info">
              <h3>{stats.delivered_orders || 0}</h3>
              <p>Delivered Orders</p>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">
              <i className='bx bx-x-circle'></i>
            </div>
            <div className="stat-info">
              <h3>{stats.cancelled_orders || 0}</h3>
              <p>Cancelled Orders</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <i className='bx bx-user-check'></i>
            </div>
            <div className="stat-info">
              <h3>{stats.active_users || 0}</h3>
              <p>Active Users</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => navigate("/admin/products")}>
              <i className='bx bx-plus-circle'></i>
              <span>Add Product</span>
            </button>
            <button className="action-btn" onClick={() => navigate("/admin/orders")}>
              <i className='bx bx-list-ul'></i>
              <span>View Orders</span>
            </button>
            <button className="action-btn" onClick={() => navigate("/admin/categories")}>
              <i className='bx bx-category'></i>
              <span>Manage Categories</span>
            </button>
            <button className="action-btn" onClick={() => navigate("/admin/users")}>
              <i className='bx bx-group'></i>
              <span>View Users</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
