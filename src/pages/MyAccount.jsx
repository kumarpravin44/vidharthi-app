import InternalHeader from "../components/InternalHeader";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";

function MyAccount() {

  return (
    <>
      <InternalHeader title="My Account"  />
     <div className="content" >
      <div className="account-page">

        {/* 👤 Profile Card */}
        <div className="account-card profile-card">
          <div className="profile-left">
            <div className="profile-avatar">
              <i className='bx bx-user'></i>
            </div>

            <div>
              <h4>Pravin Kumar</h4>
              <p>+91 9876543210</p>
              <p>pravin@email.com</p>
            </div>
          </div>

          <Link to="/edit-profile" className="edit-profile-btn">
            Edit
          </Link>
        </div>

        {/* 📦 Account Options */}
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

        {/* 🚪 Logout */}
        <div className="account-card">
          <div className="account-item logout">
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