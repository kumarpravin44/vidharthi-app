import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getImageWithFallback, noImagePlaceholder } from "../utils/placeholderImage";
import "boxicons/css/boxicons.min.css";

function Wishlist() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, loading, remove } = useWishlist();
  const { addItem } = useCart();

  if (!isAuthenticated) {
    return (
      <>
        <InternalHeader title="My Wishlist" />
        <div className="content">
          <div className="empty-wishlist">
            <i className="bx bx-heart"></i>
            <p>Please login to see your wishlist</p>
            <button className="move-btn" style={{ marginTop: 16 }} onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  const handleMoveToCart = async (item) => {
    try {
      await addItem(item.product_id, 1);
      await remove(item.product_id);
    } catch { /* ignore */ }
  };

  return (
    <>
      <InternalHeader title="My Wishlist" />

      <div className="content">
        <div className="wishlist-page page-container">

          {loading ? (
            <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
          ) : items.length === 0 ? (
            <div className="empty-wishlist">
              <i className="bx bx-heart"></i>
              <p>Your wishlist is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="wishlist-card" key={item.id}>
                <img
                  src={getImageWithFallback(item.product?.image_url)}
                  alt={item.product?.name}
                  onClick={() => navigate(`/product/${item.product_id}`)}
                  style={{ cursor: "pointer" }}
                  onError={(e) => e.target.src = noImagePlaceholder}
                />

                <div className="wishlist-details">
                  <h4
                    onClick={() => navigate(`/product/${item.product_id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.product?.name}
                  </h4>
                  <p>₹ {item.product?.price}</p>

                  <div className="wishlist-actions">
                    <button
                      className="move-btn"
                      onClick={() => handleMoveToCart(item)}
                      disabled={!item.product?.stock}
                    >
                      {item.product?.stock ? "Move to Cart" : "Out of Stock"}
                    </button>

                    <i
                      className="bx bx-trash remove-icon"
                      onClick={() => remove(item.product_id)}
                    ></i>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default Wishlist;