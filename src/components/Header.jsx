import { useState } from "react";
import SlideMenu from "./SlideMenu";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <>
      <div className="header">

        <div className="menu-icon" onClick={() => setOpen(true)}>
          <i className='bx bx-grid-alt'></i>
        </div>

        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
        </Link>

        <div className="right-icons">
          
          <Link to="/cart" className="cart-icon">
            <i className='bx bx-cart'></i>
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
          {isAuthenticated && (
            <Link to="/notifications" className="bell-icon">
              <i className='bx bx-bell'></i>
              {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
            </Link>
          )}
        </div>

      </div>

      <SlideMenu open={open} setOpen={setOpen} />
    </>
  );
}

export default Header;