import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SlideMenu({ open, setOpen }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      handleClose();
      navigate("/login");
    }
  };

  return (
    <>
      {open && (
        <div 
          className="overlay" 
          onClick={handleClose}
        ></div>
      )}

      <div className={`side-menu ${open ? "active" : ""}`}>
        <div className="menu-header">
          <h3>Menu</h3>
          <i className='bx bx-x' onClick={handleClose}></i>
        </div>

        {isAuthenticated && user && (
          <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: '#4CAF50', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px'
              }}>
                <i className='bx bx-user'></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px' }}>{user.full_name}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{user.phone}</p>
              </div>
            </div>
          </div>
        )}

        <ul>
          <li onClick={handleClose}>
            <Link to="/">
              <i className='bx bx-home'></i> Home
            </Link>
          </li>

          <li onClick={handleClose}>
            <Link to="/all-categories">
              <i className='bx bx-category'></i> All Categories
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li onClick={handleClose}>
                <Link to="/account">
                  <i className='bx bx-user'></i> My Account
                </Link>
              </li>
              <li onClick={handleClose}>
                <Link to="/orders">
                  <i className='bx bx-package'></i> My Orders
                </Link>
              </li>
              <li onClick={handleClose}>
                <Link to="/wishlist">
                  <i className='bx bx-heart'></i> Wishlist
                </Link>
              </li>
            </>
          ) : null}

          <li onClick={handleClose}>
            <Link to="/privacy-policy">
              <i className='bx bx-shield'></i> Privacy Policy
            </Link>
          </li>
          <li onClick={handleClose}>
            <Link to="/return-refund-policy">
              <i className='bx bx-rotate-left'></i> Return & Refund Policy
            </Link>
          </li>
          <li onClick={handleClose}>
            <Link to="/contact-us">
              <i className='bx bx-phone'></i> Contact Us
            </Link>
          </li>

          {isAuthenticated ? (
            <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <a>
                <i className='bx bx-log-out'></i> Logout
              </a>
            </li>
          ) : (
            <li onClick={handleClose}>
              <Link to="/login">
                <i className='bx bx-log-in'></i> Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default SlideMenu;