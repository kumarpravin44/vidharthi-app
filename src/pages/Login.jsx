import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useLoader } from "../context/LoaderContext";
import InternalHeader from "../components/InternalHeader";

function Login() {

  const [loginType, setLoginType] = useState("phone"); // phone | email
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { setLoading } = useLoader();

  // ⏳ Timer
  useEffect(() => {
    let interval;
    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  // ✅ Validate Input
  const validateInput = () => {
    if (loginType === "phone") {
      const mobileRegex = /^[6-9]\d{9}$/;
      return mobileRegex.test(inputValue);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(inputValue);
    }
  };

  // ✅ Send OTP
  const handleSendOtp = () => {

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

    setTimeout(() => {
      setLoading(false);
      setPopupType("success");
      setPopupMessage("OTP Sent Successfully");
      setShowOtp(true);
      setTimer(30);
    }, 2000);
  };

  // 🔁 Resend
  const handleResendOtp = () => {
    setTimer(30);
    setPopupType("success");
    setPopupMessage("OTP Resent Successfully");
  };

  // OTP change
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = () => {

    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      setPopupType("error");
      setPopupMessage("Please enter complete OTP");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 2000);
  };

  return (
    <>
       <InternalHeader title="Login"  />

      <div className="content">
        <div className="login-container">
          <div className="login-card">

            

            {/* 🔁 Toggle */}
            {!showOtp && (
              <div className="login-toggle">
                <button
                  className={loginType === "phone" ? "active" : ""}
                  onClick={() => setLoginType("phone")}
                >
                  Phone
                </button>
                <button
                  className={loginType === "email" ? "active" : ""}
                  onClick={() => setLoginType("email")}
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
              </>
            )}

            {showOtp && (
              <div className="otp-section">

                <p>Enter OTP sent to {inputValue}</p>

                <div className="otp-inputs">
                  {[0,1,2,3].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={otp[index]}
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChange={(e) =>
                        handleOtpChange(e.target.value, index)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, index)
                      }
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
            <button onClick={() => setPopupMessage("")}>OK</button>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default Login;