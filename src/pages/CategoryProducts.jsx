import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageWithFallback, noImagePlaceholder } from "../utils/placeholderImage";
import "boxicons/css/boxicons.min.css";

import saltImg from "../images/product/salt.webp";

function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    // Reset subcategory filter when category changes
    setSelectedSubcategory("");
    setFilterBy("");
    loadCategoryData();
  }, [id]); // Reload only when category changes

  useEffect(() => {
    // Reload products when sort changes
    if (subcategories.length > 0) {
      loadProductsFromSubcategories(subcategories);
    } else if (products.length > 0 && sortBy === "popular") {
      // Reload for popular sort when there are no subcategories
      loadCategoryData();
    }
  }, [sortBy]); // Reload when sort changes

  const loadCategoryData = async () => {
    setLoading(true);
    // Don't reset selectedSubcategory here - only reset in the id useEffect
    try {
      const res = await productService.getCategoryDetails(id);
      if (res.type === "subcategories") {
        setSubcategories(res.data);
        // Fetch all products from all subcategories
        await loadProductsFromSubcategories(res.data);
      } else {
        setProducts(res.data);
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Error loading category data:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsFromSubcategories = async (subcats) => {
    try {
      // Fetch products from all subcategories in parallel
      const productPromises = subcats.map(subcat => 
        productService.getProducts({ 
          category_id: subcat.id, 
          limit: 100,
          sort_by: sortBy === "popular" ? "popular" : null
        })
      );
      
      const productsArrays = await Promise.all(productPromises);
      
      // Flatten all products into a single array
      const allProducts = productsArrays.flat();
      
      setProducts(allProducts);
    } catch (error) {
      console.error("Error loading products from subcategories:", error);
      setProducts([]);
    }
  };

  // Filtering + Sorting Logic
  const filteredProducts = useMemo(() => {
    let updatedProducts = [...products];

    // Filter by subcategory if selected
    if (selectedSubcategory) {
      updatedProducts = updatedProducts.filter(p => p.category.id === selectedSubcategory);
    }

    // Filter by price
    if (filterBy === "under50") {
      updatedProducts = updatedProducts.filter(p => p.price <= 50);
    }
    if (filterBy === "above50") {
      updatedProducts = updatedProducts.filter(p => p.price > 50);
    }

    // Sort (for non-popular sorts, since popular comes pre-sorted from backend)
    if (sortBy === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }
    // Popular sort is already handled by backend query

    return updatedProducts;
  }, [products, sortBy, filterBy, selectedSubcategory]);

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 1000);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showPopup("Please login to add items to cart", "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      await addItem(product.id, 1, product);
      showPopup("Added to cart 🛒", "success");
    } catch (error) {
      showPopup(error.message || "Failed to add to cart", "error");
    }
  };

  const handleWishlist = async (e, productId) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showPopup("Please login to add to wishlist", "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const result = await toggleWishlist(productId);
      if (result.wishlisted) {
        showPopup("Added to wishlist ❤️", "success");
      } else {
        showPopup("Removed from wishlist", "success");
      }
    } catch (error) {
      showPopup(error.message || "Failed to update wishlist", "error");
    }
  };

  if (loading) {
    return (
      <>
        <InternalHeader title="" showSearch />
        <div className="content" style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading products...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title={category?.name || "Products"} showSearch />

      <div className="category-products-page content">
        {/* Filter + Sort Bar */}
        <div className="filter-sort-bar">
          {subcategories.length > 0 && (
            <select 
              value={selectedSubcategory} 
              onChange={(e) => setSelectedSubcategory(e.target.value)}
            >
              <option value="">All Subcategories</option>
              {subcategories.map(subcat => (
                <option key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </option>
              ))}
            </select>
          )}

          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="">Filter</option>
            <option value="under50">Under ₹50</option>
            <option value="above50">Above ₹50</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="lowToHigh">Price: Low → High</option>
            <option value="highToLow">Price: High → Low</option>
            <option value="popular">Popular</option>
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
                  onClick={(e) => handleWishlist(e, product.id)}
                >
                  <i className={`bx ${isWishlisted(product.id) ? 'bxs-heart' : 'bx-heart'}`}></i>
                </div>

                <img 
                  src={getImageWithFallback(product.image_url)} 
                  alt={product.name}
                  onError={(e) => e.target.src = noImagePlaceholder}
                />

                <h4>{product.name}</h4>

                <div className="price-section">
                  <span className="new-price">₹ {product.price}</span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="old-price">₹ {product.mrp}</span>
                  )}
                </div>

                {product.mrp && product.mrp > product.price && (
                  <span className="discount-badge">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                )}

                <button
                  className="add-cart-btn"
                  onClick={(e) => handleAddToCart(e, product)}
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

export default CategoryProducts;