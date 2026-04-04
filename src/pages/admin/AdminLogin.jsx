import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { useLanguage } from "../../context/LanguageContext";
import "boxicons/css/boxicons.min.css";

function AdminLogin() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      setError(t("enter_email_or_phone") + " / " + t("enter_password"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await adminService.login(formData.identifier, formData.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || t("login_failed") || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <i className='bx bx-shield'></i>
            <h2>{t("admin_login")}</h2>
            <p>{t("access_admin_panel")}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t("email_or_phone")}</label>
              <div className="input-with-icon">
                <i className='bx bx-user'></i>
                <input
                  type="text"
                  name="identifier"
                  placeholder={t("enter_email_or_phone")}
                  value={formData.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t("password")}</label>
              <div className="input-with-icon">
                <i className='bx bx-lock'></i>
                <input
                  type="password"
                  name="password"
                  placeholder={t("enter_password")}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="admin-login-footer">
            <a href="/" className="back-to-store">
              <i className='bx bx-arrow-back'></i>
              Back to Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
