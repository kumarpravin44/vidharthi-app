import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import { getImageWithFallback, noImagePlaceholder } from "../utils/placeholderImage";

import saltImg from "../images/product/salt.webp";
import drinksImg from "../images/product/drinks.webp";
import riceImg from "../images/product/rice.webp";
import dryfruitsImg from "../images/product/dryfruits.webp";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default images mapping
  const defaultImages = {
    0: saltImg,
    1: riceImg,
    2: drinksImg,
    3: dryfruitsImg,
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="categories">
        <p style={{ textAlign: 'center', padding: '20px' }}>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="categories">
      {categories.map((category, index) => (
        <Link
          to={`/category/${category.id}`}
          key={category.id}
          className="category-link"
        >
          <div className="category-card">
            <img 
              src={category.image_url ? getImageWithFallback(category.image_url) : (defaultImages[index % 4] || noImagePlaceholder)} 
              alt={category.name}
              onError={(e) => {
                e.target.src = noImagePlaceholder;
              }}
            />
            <p>{category.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Categories;