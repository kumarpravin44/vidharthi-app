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
import { useTranslation } from "react-i18next";
import "boxicons/css/boxicons.min.css";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { getLocalizedName } = useLanguage();
  const { t } = useTranslation();

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
      showPopup(t("failed_load_search"), "error");
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
      showPopup(t("please_login_cart"), "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      await addItem(product.id, 1, product);
      showPopup(t("added_to_cart"), "success");
    } catch (error) {
      showPopup(error.message || t("failed_add_cart"), "error");
    }
  };

  const handleWishlist = async (e, productId) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showPopup(t("please_login_wishlist"), "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const result = await toggleWishlist(productId);
      if (result.wishlisted) {
        showPopup(t("added_to_wishlist"), "success");
      } else {
        showPopup(t("removed_from_wishlist"), "success");
      }
    } catch (error) {
      showPopup(error.message || t("failed_update_wishlist"), "error");
    }
  };

  if (loading) {
    return (
      <>
        <InternalHeader title={t("search_results")} showSearch />
        <div className="content" style={{ padding: '20px', textAlign: 'center' }}>
          <p>{t("searching_for")} "{searchQuery}"...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title={`${t("search_results")}: "${searchQuery}"`} showSearch />

      <div className="category-products-page content">
        {/* Filter + Sort Bar */}
        <div className="filter-sort-bar">
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="">{t("filter")}</option>
            <option value="under50">{t("under_rupees")}</option>
            <option value="above50">{t("above_rupees")}</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">{t("sort_by")}</option>
            <option value="lowToHigh">{t("price_low_to_high")}</option>
            <option value="highToLow">{t("price_high_to_low")}</option>
            <option value="popular">{t("popular")}</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-products">
            <i className='bx bx-search-alt'></i>
            <p>{t("no_products_found")} "{searchQuery}"</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              {t("try_different_keywords")}
            </p>
          </div>
        ) : (
          <>
            <div className="search-result-count">
              {filteredProducts.length} {filteredProducts.length === 1 ? t("products_found") : t("products_found_plural")} {t("found")}
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
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}{t("percent_off")}
                    </span>
                  )}

                  {product.is_out_of_stock && (
                    <div className="out-of-stock-badge">{t("out_of_stock")}</div>
                  )}

                  <button
                    className="add-cart-btn"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.is_out_of_stock}
                  >
                    {product.is_out_of_stock ? t("out_of_stock") : t("add_to_cart")}
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
