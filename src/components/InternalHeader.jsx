import { useNavigate, Link } from "react-router-dom";

import "boxicons/css/boxicons.min.css";

function InternalHeader({ title, rightIcon, onRightClick }) {

  const navigate = useNavigate();

  return (
    <div className="internal-header">

      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        <i className='bx bx-arrow-back'></i>
      </button>

      {/* Title */}
      <h3 className="header-title">{title}</h3>

      {/* Optional Right Icon */}
      {rightIcon ? (
        <button
          className="right-btn"
          onClick={onRightClick}
        >
          <i className={`bx ${rightIcon}`}></i>
        </button>
      ) : (
        <div style={{ width: 40 }}>

            <Link to="/cart" className="cart-icon">
          <i className='bx bx-cart'></i>
          <span className="cart-count">2</span>
        </Link>
        </div>  // balance spacing
      )}

    </div>
  );
}

export default InternalHeader;