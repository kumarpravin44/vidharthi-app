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
            <Link to="/">
              <i className='bx bx-home'></i> Home
            </Link>
          </li>

          <li onClick={handleClose}>
            <Link to="/categories">
              <i className='bx bx-category'></i> Categories
            </Link>
          </li>

          <li onClick={handleClose}>
            <Link to="/top-picks">
              <i className='bx bx-star'></i> Top Picks
            </Link>
          </li>

          <li onClick={handleClose}>
            <Link to="/account">
              <i className='bx bx-user'></i> My Account
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