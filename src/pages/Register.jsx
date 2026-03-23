import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import BottomNav from "../components/BottomNav";
import { useLoader } from "../context/LoaderContext";
import { useAuth } from "../context/AuthContext";
import InternalHeader from "../components/InternalHeader";

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

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (popupMessage && popupType === "success") {
      const timeout = setTimeout(() => setPopupMessage(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [popupMessage, popupType]);

  const validate = () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Enter your full name (at least 2 characters)");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter valid 10 digit mobile number");
      return false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
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
      setPopupMessage("Registration Successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setLoading(false);
      setPopupType("error");
      setPopupMessage(err.message || "Registration failed");
    }
  };

  return (
    <>
      <InternalHeader title="Register" />

      <div className="content">
        <div className="login-container">
          <div className="login-card">
            <h3 style={{ textAlign: "center", marginBottom: "15px", color: "#333" }}>
              Create Account
            </h3>

            <div className="input-box">
              <i className="bx bx-user"></i>
              <input
                type="text"
                placeholder="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="input-box">
              <i className="bx bx-phone"></i>
              <input
                type="tel"
                placeholder="Mobile Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="input-box">
              <i className="bx bx-envelope"></i>
              <input
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="primary-btn" onClick={handleRegister}>
              Register
            </button>

            <p className="register-link" style={{ textAlign: "center", marginTop: "15px" }}>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                style={{ color: "#4CAF50", cursor: "pointer", fontWeight: 600 }}
              >
                Login here
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

export default Register;
