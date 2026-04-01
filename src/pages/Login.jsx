import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import BottomNav from "../components/BottomNav";
import { useLoader } from "../context/LoaderContext";
import { useAuth } from "../context/AuthContext";
import InternalHeader from "../components/InternalHeader";
import { authService } from "../services/authService";
import { useTranslation } from "react-i18next"; // 👈 ADD

function Login() {
  const [loginType, setLoginType] = useState("phone");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { loginWithOTP, isAuthenticated } = useAuth();
  const { t } = useTranslation(); // 👈 ADD

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let interval;
    if (showOtp && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  useEffect(() => {
    if (popupMessage && popupType === "success") {
      const timeout = setTimeout(() => setPopupMessage(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [popupMessage, popupType]);

  const validateInput = () => {
    if (loginType === "phone") {
      return /^[6-9]\d{9}$/.test(inputValue);
    } else {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);
    }
  };

  const handleSendOtp = async () => {
    if (!validateInput()) {
      setError(
        loginType === "phone"
          ? t("invalid_phone")
          : t("invalid_email")
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authService.sendOTP(inputValue);
      setLoading(false);
      setPopupType("success");
      setPopupMessage(t("otp_sent"));
      setShowOtp(true);
      setTimer(30);
    } catch (err) {
      setLoading(false);
      setPopupType("error");
      setPopupMessage(err.message || t("otp_failed"));
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.sendOTP(inputValue);
      setLoading(false);
      setTimer(30);
      setPopupType("success");
      setPopupMessage(t("otp_resent"));
    } catch (err) {
      setLoading(false);
      setPopupType("error");
      setPopupMessage(err.message || t("otp_resend_failed"));
    }
  };

  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setPopupType("error");
      setPopupMessage(t("enter_full_otp"));
      return;
    }

    setLoading(true);

    try {
      await loginWithOTP(inputValue, finalOtp);
      setLoading(false);
      setPopupType("success");
      setPopupMessage(t("login_success"));
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setLoading(false);
      setPopupType("error");
      setPopupMessage(err.message || t("invalid_otp"));
    }
  };

  return (
    <>
      <InternalHeader title={t("login")} />

      <div className="content">
        <div className="login-card">
          <div className="login-container">

            <div className="login-top-icon">
              <i className="bx bx-lock-alt"></i>
              <h2>{t("welcome_back")}</h2>
              <p>{t("login_continue")}</p>
            </div>

            {!showOtp && (
              <div className="login-toggle">
                <button
                  className={loginType === "phone" ? "active" : ""}
                  onClick={() => { setLoginType("phone"); setInputValue(""); setError(""); }}
                >
                  {t("phone")}
                </button>
                <button
                  className={loginType === "email" ? "active" : ""}
                  onClick={() => { setLoginType("email"); setInputValue(""); setError(""); }}
                >
                  {t("email")}
                </button>
              </div>
            )}

            {!showOtp && (
              <>
                <div className="input-box">
                  <i className={`bx ${loginType === "phone" ? "bx-phone" : "bx-envelope"}`}></i>
                  <input
                    type={loginType === "phone" ? "tel" : "email"}
                    placeholder={
                      loginType === "phone"
                        ? t("enter_phone")
                        : t("enter_email")
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>

                {error && <p className="error-text">{error}</p>}

                <button className="primary-btn" onClick={handleSendOtp}>
                  {t("send_otp")}
                </button>

                <p className="register-link">
                  {t("new_user")}{" "}
                  <span onClick={() => navigate("/register")} style={{ color: "rgb(76, 175, 80)", cursor: "pointer", fontWeight: "600" }}>
                    {t("register_here")}
                  </span>
                </p>
              </>
            )}

            {showOtp && (
              <div className="otp-section">
                <p>
                  {t("enter_otp")} {inputValue}
                </p>

                <div className="otp-inputs">
                  {[0,1,2,3,4,5].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={otp[index]}
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!/^[0-9]?$/.test(val)) return;
                        const newOtp = [...otp];
                        newOtp[index] = val;
                        setOtp(newOtp);
                        if (val && index < 5) otpRefs.current[index + 1].focus();
                      }}
                    />
                  ))}
                </div>

                <button className="primary-btn" onClick={handleVerifyOtp}>
                  {t("verify_otp")}
                </button>

                <div className="resend-section">
                  {timer > 0 ? (
                    <p>{t("resend_in")} {timer}s</p>
                  ) : (
                    <button className="resend-btn" onClick={handleResendOtp}>
                      {t("resend_otp")}
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i className={`bx ${popupType === "success" ? "bx-check-circle" : "bx-error"}`}></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default Login;