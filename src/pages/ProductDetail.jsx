import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageWithFallback, noImagePlaceholder } from "../utils/placeholderImage";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next"; // 👈 ADD
import "boxicons/css/boxicons.min.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { getLocalizedName, getLocalizedDescription } = useLanguage();
  const { t } = useTranslation(); // 👈 ADD

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
      showPopup(t("product_load_failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = () => setQty(qty + 1);
  const decreaseQty = () => qty > 1 && setQty(qty - 1);

  const showPopup = (msg, type = "success") => {
    setPopupType(type);
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 1200);
  };

  // Wishlist
  const handleWishlist = async () => {
    if (!isAuthenticated) {
      showPopup(t("login_wishlist"), "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      const result = await toggleWishlist(product.id);
      showPopup(result.wishlisted ? t("added_wishlist") : t("removed_wishlist"));
    } catch (err) {
      showPopup(err.message || t("wishlist_failed"), "error");
    }
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showPopup(t("login_cart"), "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await addItem(product.id, qty, product);
      showPopup(t("added_cart"));
    } catch (error) {
      showPopup(error.message || t("cart_failed"), "error");
    }
  };

  // Buy Now
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showPopup(t("login_continue"), "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await addItem(product.id, qty, product);
      navigate("/checkout");
    } catch (error) {
      showPopup(error.message || t("buy_failed"), "error");
    }
  };

  // Loading
  if (loading) {
    return (
      <>
        <InternalHeader title={t("product_details")} showSearch />
        <div className="content" style={{ textAlign: "center", padding: "20px" }}>
          <p>{t("loading_product")}</p>
        </div>
        <BottomNav />
      </>
    );
  }

  // Not Found
  if (!product) {
    return (
      <>
        <InternalHeader title={t("product_details")} showSearch />
        <div className="content" style={{ textAlign: "center", padding: "20px" }}>
          <p>{t("product_not_found")}</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title={t("product_details")} showSearch />

      <div className="product-detail-page content">

        {/* Image */}
        <div className="product-image-section">
          <img
            src={getImageWithFallback(product.image_url)}
            alt={product.name}
            onError={(e) => e.target.src = noImagePlaceholder}
          />

          <div className="wishlist-toggle" onClick={handleWishlist}>
            <i className={`bx ${isWishlisted(product.id) ? "bxs-heart" : "bx-heart"}`}></i>
          </div>

          {product.mrp > product.price && (
            <span className="discount-badge">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="product-info-card">

          <h2>{getLocalizedName(product)}</h2>

          <p className="product-price">
            <span>₹ {product.price}</span>
            {product.mrp > product.price && (
              <span className="old-price">₹ {product.mrp}</span>
            )}
          </p>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="qty-controls detail-qty">
              <button onClick={decreaseQty}>-</button>
              <span>{qty}</span>
              <button onClick={increaseQty}>+</button>
            </div>
          )}

          {/* Stock */}
          {product.stock !== undefined && (
            <p className={`stock-status ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
              {product.stock > 0
                ? `${t("in_stock")}`
                : t("out_of_stock")}
            </p>
          )}

          {/* Description */}
          {product.description && (
            <p className="product-description">
              {getLocalizedDescription(product)}
            </p>
          )}

        </div>

      </div>

      {/* Bottom Buttons */}
      {product.stock > 0 && (
        <div className="product-action-bar">
          <button className="add-cart-btn" onClick={handleAddToCart}>
            {t("add_to_cart")}
          </button>

          <button className="buy-now-btn" onClick={handleBuyNow}>
            {t("buy_now")}
          </button>
        </div>
      )}

      {/* Popup */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i className={`bx ${popupType === "success" ? "bx-check-circle" : "bx-error"}`}></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default ProductDetail;