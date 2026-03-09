import { useParams } from "react-router-dom";
import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";

import saltImg from "../images/product/salt.webp";

function ProductDetail() {

  const { id } = useParams();

  const product = {
  id,
  name: "Tata Salt - 1kg",
  price: 25,
  oldPrice: 35,
  description:
    "High quality iodized salt for daily cooking. Pure and hygienically packed.",
  image: saltImg
};

  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const increaseQty = () => setQty(qty + 1);
  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  // 🔥 Wishlist Toggle
  const handleWishlist = () => {

    const newState = !wishlisted;
    setWishlisted(newState);

    if (newState) {
      setPopupType("success");
      setPopupMessage("Added to wishlist ❤️");
    } else {
      setPopupType("error");
      setPopupMessage("Removed from wishlist ❌");
    }

    // Auto close after 2 sec
    setTimeout(() => setPopupMessage(""), 2000);
  };

  return (
    <>
      <InternalHeader title="Product Details" showSearch />

      <div className="product-detail-page content">

        {/* Image Section */}
        <div className="product-image-section">
          <img src={product.image} alt={product.name} />

          <div
            className="wishlist-toggle"
            onClick={handleWishlist}
          >
            <i
              className={`bx ${
                wishlisted ? "bxs-heart" : "bx-heart"
              }`}
            ></i>
          </div>
           <span className="discount-badge">
  {Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  )}% OFF
</span>
        </div>

        {/* Info Section */}
        <div className="product-info-card">

          <h2>{product.name}</h2>
          <p className="product-price">
            <span>₹ {product.price}</span> <span className="old-price">₹ {product.oldPrice}</span>
            </p>
         

          <p className="product-description">
            {product.description}
          </p>

          <div className="qty-controls detail-qty">
            <button onClick={decreaseQty}>-</button>
            <span>{qty}</span>
            <button onClick={increaseQty}>+</button>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Buttons */}
      <div className="product-action-bar">
        <button
          className="add-cart-btn"
          onClick={() => {
            setPopupType("success");
            setPopupMessage("Added to cart 🛒");
            setTimeout(() => setPopupMessage(""), 2000);
          }}
        >
          Add to Cart
        </button>

        <button className="buy-now-btn">
          Buy Now
        </button>
      </div>

      {/* 🔥 Modal Popup */}
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