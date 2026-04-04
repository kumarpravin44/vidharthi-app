import { useParams, useNavigate } from "react-router-dom";
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

function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { getLocalizedName } = useLanguage();
  const { t } = useTranslation();

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
    setSelectedSubcategory("");
    setFilterBy("");
    loadCategoryData();
  }, [id]);

  useEffect(() => {
    if (subcategories.length > 0) {
      loadProductsFromSubcategories(subcategories);
    } else if (products.length > 0 && sortBy === "popular") {
      loadCategoryData();
    }
  }, [sortBy]);

  const loadCategoryData = async () => {
    setLoading(true);
    try {
      const res = await productService.getCategoryDetails(id);

      if (res.type === "subcategories") {
        setSubcategories(res.data);
        await loadProductsFromSubcategories(res.data);
      } else {
        setProducts(res.data);
        setSubcategories([]);
      }

      setCategory(res.category || null); // 👈 important for title
    } catch (error) {
      console.error("Error loading category data:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsFromSubcategories = async (subcats) => {
    try {
      const productPromises = subcats.map(subcat =>
        productService.getProducts({
          category_id: subcat.id,
          limit: 100,
          sort_by: sortBy === "popular" ? "popular" : null
        })
      );

      const productsArrays = await Promise.all(productPromises);
      setProducts(productsArrays.flat());
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    }
  };

  const filteredProducts = useMemo(() => {
    let updated = [...products];

    if (selectedSubcategory) {
      updated = updated.filter(p => p.category.id === selectedSubcategory);
    }

    if (filterBy === "under50") {
      updated = updated.filter(p => p.price <= 50);
    }

    if (filterBy === "above50") {
      updated = updated.filter(p => p.price > 50);
    }

    if (sortBy === "lowToHigh") {
      updated.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "highToLow") {
      updated.sort((a, b) => b.price - a.price);
    }

    return updated;
  }, [products, sortBy, filterBy, selectedSubcategory]);

  const showPopup = (msg, type = "success") => {
    setPopupType(type);
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 1000);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showPopup(t("login_required"), "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      await addItem(product.id, 1, product);
      showPopup(t("added_to_cart"));
    } catch (error) {
      showPopup(error.message || "Error", "error");
    }
  };

  const handleWishlist = async (e, productId) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showPopup(t("login_required"), "error");
      return;
    }

    try {
      const res = await toggleWishlist(productId);
      showPopup(res.wishlisted ? t("wishlist_added") : t("wishlist_removed"));
    } catch {
      showPopup("Error", "error");
    }
  };

  if (loading) {
    return (
      <>
        <InternalHeader title={t("loading")} showSearch />
        <div className="content"><p>{t("loading_products")}</p></div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader 
        title={category ? getLocalizedName(category) : t("products")} 
        showSearch 
      />

      <div className="category-products-page content">

        {/* FILTER */}
        <div className="filter-sort-bar">

          {subcategories.length > 0 && (
            <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
              <option value="">{t("all_subcategories")}</option>
              {subcategories.map(subcat => (
                <option key={subcat.id} value={subcat.id}>
                  {getLocalizedName(subcat)}
                </option>
              ))}
            </select>
          )}

          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="">{t("filter")}</option>
            <option value="under50">{t("under_50")}</option>
            <option value="above50">{t("above_50")}</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">{t("sort_by")}</option>
            <option value="lowToHigh">{t("price_low_high")}</option>
            <option value="highToLow">{t("price_high_low")}</option>
            <option value="popular">{t("popular")}</option>
          </select>

        </div>

        {/* PRODUCTS */}
        {filteredProducts.length === 0 ? (
          <div className="empty-products">
            <i className='bx bx-package'></i>
            <p>{t("no_products")}</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >

                <div className="wishlist-icon" onClick={(e) => handleWishlist(e, product.id)}>
                  <i className={`bx ${isWishlisted(product.id) ? 'bxs-heart' : 'bx-heart'}`}></i>
                </div>

                <img
                  src={getImageWithFallback(product.image_url)}
                  onError={(e) => e.target.src = noImagePlaceholder}
                  alt=""
                />

                <h4>{getLocalizedName(product)}</h4>

                <div className="price-section">
                  <span className="new-price">₹ {product.price}</span>
                </div>

                <button className="add-cart-btn" onClick={(e) => handleAddToCart(e, product)}>
                  {t("add_to_cart")}
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

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

export default CategoryProducts;