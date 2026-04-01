import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageWithFallback, noImagePlaceholder } from "../utils/placeholderImage";
import { useLanguage } from "../context/LanguageContext";
import "boxicons/css/boxicons.min.css";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { getLocalizedName } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");

  useEffect(() => {
    if (searchQuery) {
      loadSearchResults();
    }
  }, [searchQuery]);

  const loadSearchResults = async () => {
    setLoading(true);
    try {
      const productsData = await productService.getProducts({ search: searchQuery });
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to load search results:', error);
      showPopup("Failed to load search results", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filtering + Sorting Logic
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
    if (sortBy === "popular") {
      // Popular products (assuming they come sorted from backend)
      // This could be enhanced with actual order count data
    }

    return updatedProducts;
  }, [products, sortBy, filterBy]);

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
        <InternalHeader title="Search Results" showSearch />
        <div className="content" style={{ padding: '20px', textAlign: 'center' }}>
          <p>Searching for "{searchQuery}"...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title={`Search: "${searchQuery}"`} showSearch />

      <div className="category-products-page content">
        {/* Filter + Sort Bar */}
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
            <option value="popular">Popular</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-products">
            <i className='bx bx-search-alt'></i>
            <p>No products found for "{searchQuery}"</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Try different keywords or browse categories
            </p>
          </div>
        ) : (
          <>
            <div className="search-result-count">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
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

                  <h4>{getLocalizedName(product)}</h4>

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

                  {product.is_out_of_stock && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}

                  <button
                    className="add-cart-btn"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.is_out_of_stock}
                  >
                    {product.is_out_of_stock ? 'Out of Stock' : 'Add to Cart'}
                  </button>

                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />

      {/* Popup Notification */}
      {popupMessage && (
        <div className={`popup-message ${popupType}`}>
          {popupMessage}
        </div>
      )}
    </>
  );
}

export default SearchResults;
