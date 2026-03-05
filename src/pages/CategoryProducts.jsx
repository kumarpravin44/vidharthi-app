import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";

import saltImg from "../images/product/salt.webp";
import riceImg from "../images/product/rice.webp";

function CategoryProducts() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");

  const products = [
    { id: 1, name: "Tata Salt", price: 25, image: saltImg },
    { id: 2, name: "Basmati Rice", price: 120, image: riceImg },
    { id: 3, name: "Premium Rice", price: 150, image: riceImg },
    { id: 4, name: "Rock Salt", price: 30, image: saltImg }
  ];

  // 🔥 Filtering + Sorting Logic
  const filteredProducts = useMemo(() => {

    let updatedProducts = [...products];

    // Filter
    if (filterBy === "under50") {
      updatedProducts = updatedProducts.filter(p => p.price <= 50);
    }
    if (filterBy === "above50") {
      updatedProducts = updatedProducts.filter(p => p.price > 50);
    }

    // Sort
    if (sortBy === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    return updatedProducts;

  }, [sortBy, filterBy]);

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);

    setTimeout(() => {
      setPopupMessage("");
    }, 2000);
  };

  return (
    <>
      <InternalHeader title="" showSearch />

      <div className="category-products-page content">

        {/* 🔥 Filter + Sort Bar */}
        <div className="filter-sort-bar">
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="">Filter</option>
            <option value="under50">Under ₹50</option>
            <option value="above50">Above ₹50</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="lowToHigh">Price: Low → High</option>
            <option value="highToLow">Price: High → Low</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-products">
            <i className='bx bx-package'></i>
            <p>No products found</p>
          </div>
        ) : (
          <div className="products-grid">

            {filteredProducts.map(product => (
              <div
                className="product-card"
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
              >

                <div
                  className="wishlist-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPopup("Added to wishlist ❤️");
                  }}
                >
                  <i className='bx bx-heart'></i>
                </div>

                <img src={product.image} alt={product.name} />

                <h4>{product.name}</h4>
                <p className="price">₹ {product.price}</p>

                <button
                  className="add-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPopup("Added to cart 🛒");
                  }}
                >
                  Add to Cart
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i className="bx bx-check-circle success-icon"></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default CategoryProducts;