import { useState } from "react";
import SlideMenu from "./SlideMenu";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="header">

        <div className="menu-icon" onClick={() => setOpen(true)}>
          <i className='bx bx-grid-alt'></i>
        </div>

        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

       

        <Link to="/cart" className="cart-icon">
          <i className='bx bx-cart'></i>
          <span className="cart-count">2</span>
        </Link>

      </div>

      <SlideMenu open={open} setOpen={setOpen} />
    </>
  );
}

export default Header;