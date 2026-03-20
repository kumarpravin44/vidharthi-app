import { useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../services/adminService";
import "boxicons/css/boxicons.min.css";

function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    adminService.logout();
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", icon: "bx-grid-alt", label: "Dashboard" },
    { path: "/admin/products", icon: "bx-box", label: "Products" },
    { path: "/admin/orders", icon: "bx-cart", label: "Orders" },
    { path: "/admin/users", icon: "bx-user", label: "Users" },
    { path: "/admin/categories", icon: "bx-category", label: "Categories" },
    { path: "/admin/banners", icon: "bx-image", label: "Banners" },
    { path: "/admin/offers", icon: "bx-purchase-tag", label: "Offers" },
    { path: "/admin/settings", icon: "bx-cog", label: "Settings" },
  ];

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-logo" onClick={() => navigate("/admin/dashboard")}>
          <i className='bx bx-store'></i>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => navigate(item.path)}
            >
              <i className={`bx ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <i className='bx bx-log-out'></i>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
