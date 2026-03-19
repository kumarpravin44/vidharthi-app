import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import "boxicons/css/boxicons.min.css";

function MyAccount() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  if (!user) {
    return (
      <>
        <InternalHeader title="My Account" />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title="My Account" />
      <div className="content">
        <div className="account-page">

          {/* Profile Card */}
          <div className="account-card profile-card">
            <div className="profile-left">
              <div className="profile-avatar">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} />
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
              <i class='bx bx-edit-alt'></i>
            </Link>
          </div>

          {/* Account Options */}
          <div className="account-card">

            <Link to="/orders" className="account-item">
              <i className='bx bx-package'></i>
              <span>My Orders</span>
              <i className='bx bx-chevron-right'></i>
            </Link>

            <Link to="/addresses" className="account-item">
              <i className='bx bx-map'></i>
              <span>Saved Addresses</span>
              <i className='bx bx-chevron-right'></i>
            </Link>

            <Link to="/wishlist" className="account-item">
              <i className='bx bx-heart'></i>
              <span>Wishlist</span>
              <i className='bx bx-chevron-right'></i>
            </Link>

            <Link to="/help" className="account-item">
              <i className='bx bx-help-circle'></i>
              <span>Help & Support</span>
              <i className='bx bx-chevron-right'></i>
            </Link>

          </div>

          {/* Logout */}
          <div className="account-card">
            <div className="account-item logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <i className='bx bx-log-out'></i>
              <span>Logout</span>
            </div>
          </div>

        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default MyAccount;