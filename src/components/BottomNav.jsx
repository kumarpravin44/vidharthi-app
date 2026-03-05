import { Link } from "react-router-dom";
function BottomNav() {
  return (
    <div className="bottom-nav">
      <Link to="/" class="nav-item active">
        <i class='bx bx-home icon'></i>
        <p>Grocery</p>
    </Link>

    <Link to="/vegetables" class="nav-item">
        <i class='bx bx-leaf icon'></i>
        <p>Vegetable</p>
    </Link>

    <Link to="/cart" class="nav-item">
        <i class='bx bx-shopping-bag icon'></i>
        <p>Basket</p>
        <span class="cart-count">2</span>
    </Link>

    <Link to="/all-categories" class="nav-item">
        <i class='bx bx-category icon'></i>
        <p>Categories</p>
    </Link>
    </div>
  );
}

export default BottomNav;