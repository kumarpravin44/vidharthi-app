import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../context/NavigationContext";
import { productService } from '../services/productService';
import { getAvatarUrl } from '../utils/placeholderImage';
import { useTranslation } from "react-i18next";
import "boxicons/css/boxicons.min.css";

function MyAccount() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { refreshNavCategories } = useNavigation();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    setConfirmType("logout");
    setShowConfirm(true);
  };

  const handleRefreshCache = () => {
    setConfirmType("refresh");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    if (confirmType === "logout") {
      logout();
      setPopupMessage(t("logout_success"));
      setPopupType("success");

      setTimeout(() => navigate("/login"), 1500);
    }

    if (confirmType === "refresh") {
      setRefreshing(true);
      try {
        await refreshNavCategories();
        await productService.getCategoriesTree(true);

        setPopupMessage(t("refresh_success"));
        setPopupType("success");
      } catch {
        setPopupMessage(t("refresh_failed"));
        setPopupType("error");
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleCancel = () => setShowConfirm(false);

  if (!user) {
    return (
      <>
        <InternalHeader title={t("my_account")} />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '20px' }}>{t("loading")}</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title={t("my_account")} />

      <div className="content">
        <div className="account-page">

          {/* Profile */}
          <div className="account-card profile-card">
            <div className="profile-left">
              <div className="profile-avatar">
                {user.avatar_url ? (
                  <img src={getAvatarUrl(user.avatar_url)} alt={user.full_name} />
                ) : (
                  <i className='bx bx-user'></i>
                )}
              </div>

              <div>
                <h4>{user.full_name}</h4>
                <p>+91 {user.phone}</p>
                {user.email && <p>{user.email}</p>}
              </div>
            </div>

            <Link to="/edit-profile" className="edit-profile-btn">
              <i className='bx bx-edit-alt'></i>
            </Link>
          </div>

          {/* Options */}
          <div className="account-card">

            <Link to="/orders" className="account-item">
              <i className='bx bx-package'></i>
              <span>{t("my_orders")}</span>
              <i className='bx bx-chevron-right'></i>
            </Link>

            <Link to="/addresses" className="account-item">
              <i className='bx bx-map'></i>
              <span>{t("saved_addresses")}</span>
              <i className='bx bx-chevron-right'></i>
            </Link>

            <Link to="/wishlist" className="account-item">
              <i className='bx bx-heart'></i>
              <span>{t("wishlist")}</span>
              <i className='bx bx-chevron-right'></i>
            </Link>

            <Link to="/help" className="account-item">
              <i className='bx bx-help-circle'></i>
              <span>{t("help_support")}</span>
              <i className='bx bx-chevron-right'></i>
            </Link>

          </div>

          {/* Refresh */}
          <div className="account-card">
            <div className="account-item" onClick={handleRefreshCache}>
              <i className={`bx ${refreshing ? 'bx-loader bx-spin' : 'bx-refresh'}`}></i>
              <span>
                {refreshing ? t("refreshing") : t("refresh_app")}
              </span>
            </div>
          </div>

          {/* Logout */}
          <div className="account-card">
            <div className="account-item logout" onClick={handleLogout}>
              <i className='bx bx-log-out'></i>
              <span>{t("logout")}</span>
            </div>
          </div>

        </div>
      </div>

      <BottomNav />

      {/* Confirm Popup */}
      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup-box">

            <i className={`bx ${confirmType === "logout" ? "bx-log-out" : "bx-refresh"}`}></i>

            <h3>
              {confirmType === "logout"
                ? t("logout_confirm1")
                : t("refresh_confirm")}
            </h3>

            <p>
              {confirmType === "logout"
                ? t("logout_msg")
                : t("refresh_msg")}
            </p>

            <div style={{ marginTop: "15px" }}>
              <button onClick={handleCancel}>{t("cancel")}</button>
              <button onClick={handleConfirm}>
                {confirmType === "logout" ? t("logout") : t("refresh")}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Popup */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i className={`bx ${popupType === "success" ? "bx-check-circle" : "bx-error"}`}></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}
    </>
  );
}

export default MyAccount;