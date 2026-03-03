import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useLoader } from "../context/LoaderContext";

function Login() {

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // success / error

  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { setLoading } = useLoader();

  // ⏳ Countdown Timer
  useEffect(() => {
    let interval;

    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showOtp, timer]);

  // ✅ Send OTP
  const handleSendOtp = () => {

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobile)) {
      setError("Please enter valid 10 digit mobile number");
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

  // 🔁 Resend OTP
  const handleResendOtp = () => {
    setTimer(30);
    setPopupType("success");
    setPopupMessage("OTP Resent Successfully");
  };

  // ✅ OTP Change
  const handleOtpChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1].focus();
    }
  };

  // ⬅ Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // ✅ Verify OTP
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
      <Header />

      <div className="content">
        <div className="login-container">
          <div className="login-card">

            <h2>Login with OTP</h2>

            {!showOtp && (
              <>
                <div className="input-box">
                  <i className='bx bx-phone'></i>
                  <input
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    maxLength="10"
                  />
                </div>

                {error && <p className="error-text">{error}</p>}

                <button
                  className="primary-btn"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              </>
            )}

            {showOtp && (
              <div className="otp-section">

                <p>Enter OTP sent to {mobile}</p>

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

                <button
                  className="primary-btn"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>

                <div className="resend-section">
                  {timer > 0 ? (
                    <p>Resend OTP in {timer}s</p>
                  ) : (
                    <button
                      className="resend-btn"
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* 🔥 COMMON POPUP */}
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

            <button onClick={() => setPopupMessage("")}>
              OK
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default Login;