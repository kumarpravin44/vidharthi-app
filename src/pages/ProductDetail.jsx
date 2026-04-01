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
import "boxicons/css/boxicons.min.css";

import saltImg from "../images/product/salt.webp";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { getLocalizedName, getLocalizedDescription } = useLanguage();

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
      showPopup("Failed to load product", "error");
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = () => setQty(qty + 1);
  
  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  // Wishlist Toggle
  const handleWishlist = async () => {
    if (!isAuthenticated) {
      showPopup("Please login to add to wishlist", "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    try {
      const result = await toggleWishlist(product.id);
      if (result.wishlisted) {
        showPopup("Added to wishlist ❤️", "success");
      } else {
        showPopup("Removed from wishlist", "success");
      }
    } catch (err) {
      showPopup(err.message || "Failed to update wishlist", "error");
    }
  };

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 1000);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showPopup("Please login to add items to cart", "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      await addItem(product.id, qty, product);
      showPopup("Added to cart 🛒", "success");
    } catch (error) {
      showPopup(error.message || "Failed to add to cart", "error");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showPopup("Please login to continue", "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      await addItem(product.id, qty, product);
      navigate("/checkout");
    } catch (error) {
      showPopup(error.message || "Failed to proceed", "error");
    }
  };

  if (loading) {
    return (
      <>
        <InternalHeader title="" showSearch />
        <div className="content" style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading product...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <InternalHeader title="" showSearch />
        <div className="content" style={{ padding: '20px', textAlign: 'center' }}>
          <p>Product not found</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title="Product Details" showSearch />

      <div className="product-detail-page content">

        {/* Image Section */}
        <div className="product-image-section">
          <img 
            src={getImageWithFallback(product.image_url)} 
            alt={product.name}
            onError={(e) => e.target.src = noImagePlaceholder}
          />

          <div
            className="wishlist-toggle"
            onClick={handleWishlist}
          >
            <i
              className={`bx ${
                product && isWishlisted(product.id) ? "bxs-heart" : "bx-heart"
              }`}
            ></i>
          </div>
          
          {product.mrp && product.mrp > product.price && (
            <span className="discount-badge">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Info Section */}
        <div className="product-info-card">

          <h2>{getLocalizedName(product)}</h2>
          <p className="product-price">
            <span>₹ {product.price}</span> 
            {product.mrp && product.mrp > product.price && (
              <span className="old-price">₹ {product.mrp}</span>
            )}
          </p>

          {product.stock > 0 && (
            <div className="qty-controls detail-qty">
              <button onClick={decreaseQty}>-</button>
              <span>{qty}</span>
              <button onClick={increaseQty}>+</button>
            </div>
          )}

          {product.stock !== undefined && (
            <p className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          )}
         
          {product.description && (
            <p className="product-description">
              {getLocalizedDescription(product)}
            </p>
          )}

          

          

        </div>

      </div>

      {/* Sticky Bottom Buttons */}
      {product.stock > 0 && (
        <div className="product-action-bar">
          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      )}

      {/* Modal Popup */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i
              className={`bx ${
                popupType === "success"
                  ? "bx-check-circle success-icon"
                  : "bx-error error-icon"
              }`}
            ></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default ProductDetail;