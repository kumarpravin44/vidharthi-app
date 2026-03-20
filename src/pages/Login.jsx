import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import BottomNav from "../components/BottomNav";
import { useLoader } from "../context/LoaderContext";
import { useAuth } from "../context/AuthContext";
import InternalHeader from "../components/InternalHeader";
import { authService } from "../services/authService";

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

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Timer
  useEffect(() => {
    let interval;
    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  // Auto-close popup
  useEffect(() => {
    if (popupMessage && popupType === "success") {
      const timeout = setTimeout(() => setPopupMessage(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [popupMessage, popupType]);

  // Validate Input
  const validateInput = () => {
    if (loginType === "phone") {
      const mobileRegex = /^[6-9]\d{9}$/;
      return mobileRegex.test(inputValue);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(inputValue);
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!validateInput()) {
      setError(
        loginType === "phone"
          ? "Enter valid 10 digit mobile number"
          : "Enter valid email address"
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authService.sendOTP(inputValue);
      setLoading(false);
      setPopupType("success");
      setPopupMessage("OTP Sent Successfully");
      setShowOtp(true);
      setTimer(30);
    } catch (err) {
      setLoading(false);
      setPopupType("error");
      setPopupMessage(err.message || "Failed to send OTP");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.sendOTP(inputValue);
      setLoading(false);
      setTimer(30);
      setPopupType("success");
      setPopupMessage("OTP Resent Successfully");
    } catch (err) {
      setLoading(false);
      setPopupType("error");
      setPopupMessage(err.message || "Failed to resend OTP");
    }
  };

  // OTP change
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setPopupType("error");
      setPopupMessage("Please enter complete OTP");
      return;
    }

    setLoading(true);

    try {
      await loginWithOTP(inputValue, finalOtp);
      setLoading(false);
      setPopupType("success");
      setPopupMessage("Login Successful!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setLoading(false);
      setPopupType("error");
      setPopupMessage(err.message || "Invalid OTP");
    }
  };

  return (
    <>
      <InternalHeader title="Login" />

      <div className="content">
        <div className="login-container">
          <div className="login-card">

            {/* Toggle - Phone / Email */}
            {!showOtp && (
              <div className="login-toggle">
                <button
                  className={loginType === "phone" ? "active" : ""}
                  onClick={() => { setLoginType("phone"); setInputValue(""); setError(""); }}
                >
                  Phone
                </button>
                <button
                  className={loginType === "email" ? "active" : ""}
                  onClick={() => { setLoginType("email"); setInputValue(""); setError(""); }}
                >
                  Email
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
                        ? "Enter Mobile Number"
                        : "Enter Email Address"
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>

                {error && <p className="error-text">{error}</p>}

                <button className="primary-btn" onClick={handleSendOtp}>
                  Send OTP
                </button>

                <p className="register-link">
                  New user?{" "}
                  <span onClick={() => navigate("/register")} style={{ color: "#4CAF50", cursor: "pointer", fontWeight: 600 }}>
                    Register here
                  </span>
                </p>
              </>
            )}

            {showOtp && (
              <div className="otp-section">
                <p>Enter 6-digit OTP sent to {loginType === "email" ? "your email " : ""}{inputValue}</p>

                <div className="otp-inputs">
                  {[0,1,2,3,4,5].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={otp[index]}
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>

                <button className="primary-btn" onClick={handleVerifyOtp}>
                  Verify OTP
                </button>

                <div className="resend-section">
                  {timer > 0 ? (
                    <p>Resend OTP in {timer}s</p>
                  ) : (
                    <button className="resend-btn" onClick={handleResendOtp}>
                      Resend OTP
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
            <i
              className={`bx ${
                popupType === "success"
                  ? "bx-check-circle success-icon"
                  : "bx-error error-icon"
              }`}
            ></i>
            <h3>{popupMessage}</h3>
            {popupType === "error" && (
              <button onClick={() => setPopupMessage("")}>OK</button>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default Login;