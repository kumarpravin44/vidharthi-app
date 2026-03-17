import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getImageWithFallback, noImagePlaceholder } from "../utils/placeholderImage";

function CategoryWithProducts() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategoriesWithProducts();
  }, []);

  const loadCategoriesWithProducts = async () => {
    try {
      // Get all categories
      const categories = await productService.getCategories();
      console.log('Loaded categories:', categories);
      
      // For each category, fetch top 4 most popular products (based on order count)
      const categoryData = await Promise.all(
        categories.map(async (category) => {
          try {
            const products = await productService.getProducts({
              category_id: category.id,
              limit: 4,
              sort_by: 'popular'
            });
            console.log(`Popular products for ${category.name}:`, products);
            return {
              category,
              products: products || []
            };
          } catch (error) {
            console.error(`Failed to load products for ${category.name}:`, error);
            return {
              category,
              products: []
            };
          }
        })
      );

      // Filter out categories with no products
      const categoriesWithItems = categoryData.filter(item => item.products.length > 0);
      console.log('Categories with products:', categoriesWithItems);
      setCategoriesWithProducts(categoriesWithItems);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 1000);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showPopup("Please login to add items to cart", "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (product.is_out_of_stock) {
      showPopup("Product is out of stock", "error");
      return;
    }

    try {
      await addItem(product.id, 1, product);
      showPopup("Added to cart 🛒", "success");
    } catch (error) {
      showPopup(error.message || "Failed to add to cart", "error");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  if (categoriesWithProducts.length === 0) {
    return null;
  }

  return (
    <div className="category-products-container">
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
      {categoriesWithProducts.map(({ category, products }) => (
        <div key={category.id} className="category-section">
          {/* Category Header */}
          <div className="category-header">
            <h2>{category.name} - Popular Products</h2>
            <Link to={`/category/${category.id}`} className="view-all-link">
              View All <i className="bx bx-chevron-right"></i>
            </Link>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="product-card"
              >
                <div className="product-image">
                  <img 
                    src={getImageWithFallback(product.image_url)} 
                    alt={product.name}
                    onError={(e) => {
                      console.error('Image failed to load:', product.image_url);
                      e.target.src = noImagePlaceholder;
                    }}
                  />
                  {product.is_out_of_stock && (
                    <span className="out-of-stock-badge">Out of Stock</span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{truncateText(product.name, 40)}</h3>
                  <p className="product-unit">{product.unit}</p>
                  <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
                    {!product.is_out_of_stock && (
                      <button 
                        className="add-btn" 
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <i className="bx bx-plus"></i>
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CategoryWithProducts;
