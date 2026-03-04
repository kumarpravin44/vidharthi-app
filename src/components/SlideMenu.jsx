import { Link } from "react-router-dom";

function SlideMenu({ open, setOpen }) {

  const handleClose = () => {
    setOpen(false);
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

        <ul>
          

          

          <li onClick={handleClose}>
            <Link to="/account">
              <i className='bx bx-user'></i> My Account
            </Link>
          </li>
           <li onClick={handleClose}>
            <Link to="/orders">
              <i className='bx bx-package'></i> My Order
            </Link>
          </li>
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

          <li onClick={handleClose}>
            <Link to="/login">
              <i className='bx bx-log-in'></i> Login
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SlideMenu;