import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import { getImageWithFallback, noImagePlaceholder } from "../utils/placeholderImage";

import saltImg from "../images/product/salt.webp";
import drinksImg from "../images/product/drinks.webp";
import riceImg from "../images/product/rice.webp";
import dryfruitsImg from "../images/product/dryfruits.webp";

function Categories({ parentCategoryId = null, categories = null }) {
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [loading, setLoading] = useState(!categories);

  const defaultImages = {
    0: saltImg,
    1: riceImg,
    2: drinksImg,
    3: dryfruitsImg,
  };

  useEffect(() => {
    // If categories are passed as prop, use them directly
    if (categories !== null) {
      setLocalCategories(categories);
      setLoading(false);
      return;
    }
    // Otherwise, fetch from API
    loadCategories();
  }, [parentCategoryId, categories]);

  const loadCategories = async () => {
    try {
      let data;
      if (parentCategoryId) {
        data = await productService.getSubcategories(parentCategoryId);
      } else {
        data = await productService.getCategories();
      }
      setLocalCategories(data);
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

  if (localCategories.length === 0) {
    return null; // Don't show anything if no categories
  }

  return (
    <div className="categories">
      {localCategories.map((category, index) => (
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