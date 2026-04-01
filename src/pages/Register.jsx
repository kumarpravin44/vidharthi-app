import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import BottomNav from "../components/BottomNav";
import { useLoader } from "../context/LoaderContext";
import { useAuth } from "../context/AuthContext";
import InternalHeader from "../components/InternalHeader";
import { useTranslation } from "react-i18next"; // 👈 ADD

function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { register, isAuthenticated } = useAuth();
  const { t } = useTranslation(); // 👈 ADD

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (popupMessage && popupType === "success") {
      const timeout = setTimeout(() => setPopupMessage(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [popupMessage, popupType]);

  const validate = () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError(t("invalid_name"));
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(t("invalid_phone"));
      return false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("invalid_email"));
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setError("");
    setLoading(true);

    try {
      await register({
        full_name: fullName.trim(),
        phone: phone,
        email: email,
      });
      setLoading(false);
      setPopupType("success");
      setPopupMessage(t("register_success"));
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setLoading(false);
      setPopupType("error");
      setPopupMessage(err.message || t("register_failed"));
    }
  };

  return (
    <>
      <InternalHeader title={t("register")} />

      <div className="content">
        <div className="login-container">
          <div className="login-card">

            <div className="login-top-icon">
              <i className="bx bx-user-plus"></i>
              <h2>{t("create_account")}</h2>
            </div>

            <div className="input-box">
              <i className="bx bx-user"></i>
              <input
                type="text"
                placeholder={t("full_name")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="input-box">
              <i className="bx bx-phone"></i>
              <input
                type="tel"
                placeholder={t("mobile_number")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="input-box">
              <i className="bx bx-envelope"></i>
              <input
                type="email"
                placeholder={t("email_address")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="primary-btn" onClick={handleRegister}>
              {t("register")}
            </button>

            <p className="register-link" style={{ textAlign: "center", marginTop: "15px" }}>
              {t("already_account")}{" "}
              <span  onClick={() => navigate("/login")} style={{ color: "rgb(76, 175, 80)", cursor: "pointer", fontWeight: "600" }}>
                    
                {t("login_here")}
              </span>
            </p>

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

export default Register;