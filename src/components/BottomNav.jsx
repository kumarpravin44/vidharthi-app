import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNavigation } from "../context/NavigationContext";

const NAV_ICONS = ["bx-store", "bx-leaf",  "bx-star", "bx-grid-alt", "bx-tag"];

function BottomNav() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { navCategories } = useNavigation();

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
        <i className="bx bx-home icon"></i>
        <p>Home</p>
        
      </Link>
      {navCategories.map((cat, idx) => {
        const path = `/category/${cat.id}`;
        const isActive = location.pathname === path;
        return (
          <Link to={path} key={cat.id} className={`nav-item ${isActive ? "active" : ""}`}>
            <i className={`bx ${NAV_ICONS[idx % NAV_ICONS.length]} icon`}></i>
            <p>{cat.name}</p>
          </Link>
        );
      })}

      {/* Cart — always visible */}
      <Link to="/cart" className={`nav-item ${location.pathname === "/cart" ? "active" : ""}`}>
        <i className="bx bx-shopping-bag icon"></i>
        <p>Basket</p>
        {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
      </Link>

      {/* All Categories — always visible */}
      <Link to="/all-categories" className={`nav-item ${location.pathname === "/all-categories" ? "active" : ""}`}>
        <i className="bx bx-category icon"></i>
        <p>Categories</p>
      </Link>
    </div>
  );
}

export default BottomNav;
