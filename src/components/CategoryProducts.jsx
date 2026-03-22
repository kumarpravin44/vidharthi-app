import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageWithFallback, noImagePlaceholder } from "../utils/placeholderImage";
import "boxicons/css/boxicons.min.css";

function CategoryProducts({ categoryId, categoryName, limit=1000 }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({ category_id: categoryId , limit:limit});
      setProducts(data.slice(0, 8)); // Show max 8 products on home page
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await addItem(product.id, 1, product);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWishlist = async (e, productId) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await toggleWishlist(productId);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
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

      {products.length >= 8 && (
        <div 
          className="view-all-card"
          onClick={() => navigate(`/category/${categoryId}`)}
        >
          <i className='bx bx-right-arrow-circle'></i>
          <p>View All {categoryName}</p>
        </div>
      )}
    </div>
  );
}

export default CategoryProducts;
