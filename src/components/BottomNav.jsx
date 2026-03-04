import { Link } from "react-router-dom";
function BottomNav() {
  return (
    <div className="bottom-nav">
      <div class="nav-item active">
        <i class='bx bx-home icon'></i>
        <p>Grocery</p>
    </div>

    <div class="nav-item">
        <i class='bx bx-leaf icon'></i>
        <p>Vegetable</p>
    </div>

    <div class="nav-item">
        <i class='bx bx-shopping-bag icon'></i>
        <p>Basket</p>
    </div>

    <Link to="/all-categories" class="nav-item">
        <i class='bx bx-category icon'></i>
        <p>Categories</p>
    </Link>
    </div>
  );
}

export default BottomNav;