import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "boxicons/css/boxicons.min.css";

function InternalHeader({ title, showSearch = false }) {

  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchActive(false);
      setSearchValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
      <h3 className={`header-title ${searchActive ? "hide-title" : ""}`}>
        {title}
      </h3>

      <div className="header-actions">

        {/* 🔥 Search (Hidden by default) */}
        {showSearch && (
          <div className={`search-wrapper ${searchActive ? "active" : ""}`}>

            <i
              className="bx bx-search search-icon"
              onClick={() => {
                if (searchActive && searchValue.trim()) {
                  handleSearch();
                } else {
                  setSearchActive(true);
                }
              }}
            ></i>

            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            {searchActive && (
              <i
                className='bx bx-x close-icon'
                onClick={() => {
                  setSearchActive(false);
                  setSearchValue("");
                }}
              ></i>
            )}

          </div>
        )}

        {/* Cart
        {!searchActive && (
          <Link to="/cart" className="cart-icon">
            <i className='bx bx-cart'></i>
            <span className="cart-count">2</span>
          </Link>
        )} */}

      </div>

    </div>
  );
}

export default InternalHeader;