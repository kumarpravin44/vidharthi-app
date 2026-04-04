import { useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../services/adminService";
import { useLanguage } from "../context/LanguageContext";
import "boxicons/css/boxicons.min.css";

function AdminHeader() {
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    adminService.logout();
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", icon: "bx-grid-alt", label: "dashboard" },
    { path: "/admin/products", icon: "bx-box", label: "products" },
    { path: "/admin/orders", icon: "bx-cart", label: "orders" },
    { path: "/admin/users", icon: "bx-user", label: "users" },
    { path: "/admin/categories", icon: "bx-category", label: "categories" },
    { path: "/admin/banners", icon: "bx-image", label: "banners" },
    // { path: "/admin/offers", icon: "bx-purchase-tag", label: "offers" },
    { path: "/admin/settings", icon: "bx-cog", label: "settings" },
  ];

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-logo" onClick={() => navigate("/admin/dashboard")}>
          <i className='bx bx-store'></i>
          <span>{t("admin_panel")}</span>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => navigate(item.path)}
            >
              <i className={`bx ${item.icon}`}></i>
              <span>{t(item.label)}</span>
            </button>
          ))}
        </nav>

        <div className="admin-header-actions">
          <button className="admin-lang-btn" onClick={toggleLanguage}>
            {language === "en" ? "HI" : "EN"}
          </button>

          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className='bx bx-log-out'></i>
            <span>{t("logout")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
