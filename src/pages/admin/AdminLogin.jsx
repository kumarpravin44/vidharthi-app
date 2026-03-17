import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import "boxicons/css/boxicons.min.css";

function AdminLogin() {
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
      setError("Please enter email/phone and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await adminService.login(formData.identifier, formData.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
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
            <h2>Admin Login</h2>
            <p>Access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email or Phone Number</label>
              <div className="input-with-icon">
                <i className='bx bx-user'></i>
                <input
                  type="text"
                  name="identifier"
                  placeholder="admin@example.com or +919876543210"
                  value={formData.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <i className='bx bx-lock'></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
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
