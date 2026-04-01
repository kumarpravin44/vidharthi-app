import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { getAvatarUrl } from '../utils/placeholderImage';
import { useTranslation } from "react-i18next"; // 👈 ADD

function SlideMenu({ open, setOpen }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation(); // 👈 ADD

  const [showConfirm, setShowConfirm] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    handleClose();
    setShowConfirm(false);

    setPopupMessage(t("logout_success")); // 👈 translated
    setPopupType("success");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {open && <div className="overlay" onClick={handleClose}></div>}

      <div className={`side-menu ${open ? "active" : ""}`}>
        <div className="menu-header">
          <h3>{t("menu")}</h3> {/* 👈 */}
          <i className="bx bx-x" onClick={handleClose}></i>
        </div>

        {isAuthenticated && user && (
          <div style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="profile-avatar">
                {user.avatar_url ? (
                  <img src={getAvatarUrl(user.avatar_url)} alt={user.full_name} />
                ) : (
                  <i className='bx bx-user'></i>
                )}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "16px" }}>
                  {user.full_name}
                </h4>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                  {user.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        <ul>
          <li onClick={handleClose}>
            <Link to="/">
              <i className="bx bx-home"></i> {t("home")}
            </Link>
          </li>

          <li onClick={handleClose}>
            <Link to="/all-categories">
              <i className="bx bx-category"></i> {t("all_categories")}
            </Link>
          </li>

          {isAuthenticated && (
            <>
              <li onClick={handleClose}>
                <Link to="/account">
                  <i className="bx bx-user"></i> {t("my_account")}
                </Link>
              </li>
              <li onClick={handleClose}>
                <Link to="/orders">
                  <i className="bx bx-package"></i> {t("my_orders")}
                </Link>
              </li>
              <li onClick={handleClose}>
                <Link to="/wishlist">
                  <i className="bx bx-heart"></i> {t("wishlist")}
                </Link>
              </li>
            </>
          )}

          <li onClick={handleClose}>
            <Link to="/privacy-policy">
              <i className="bx bx-shield"></i> {t("privacy_policy")}
            </Link>
          </li>

          <li onClick={handleClose}>
            <Link to="/return-refund-policy">
              <i className="bx bx-rotate-left"></i> {t("return_refund")}
            </Link>
          </li>

          <li onClick={handleClose}>
            <Link to="/contact-us">
              <i className="bx bx-phone"></i> {t("contact_us")}
            </Link>
          </li>

          {isAuthenticated ? (
            <li style={{ cursor: "pointer" }} onClick={handleLogout}>
              <a>
                <i className="bx bx-log-out"></i> {t("logout")}
              </a>
            </li>
          ) : (
            <li onClick={handleClose}>
              <Link to="/login">
                <i className="bx bx-log-in"></i> {t("login")}
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Confirm Logout Popup */}
      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i className="bx bx-log-out" style={{ fontSize: "35px", color: "#ff4d4f" }}></i>
            <h3>{t("logout_confirm")}</h3> {/* 👈 */}
            <div style={{ marginTop: "15px" }}>
              <button onClick={confirmLogout}>{t("yes")}</button>
              <button onClick={cancelLogout} style={{ marginLeft: "10px" }}>
                {t("no")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
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
    </>
  );
}

export default SlideMenu;