import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { productService } from "../services/productService";

import saltImg from "../images/product/salt.webp";
import riceImg from "../images/product/rice.webp";
import drinksImg from "../images/product/drinks.webp";
import dryfruitsImg from "../images/product/dryfruits.webp";
import Loader from "../components/Loader";

function AllCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <InternalHeader title="All Categories" showSearch />

      <div className="all-categories-page content">
        {loading ? (
          <Loader text="Loading All Categories..." />
        ) : (
          <div className="categories-grid-new">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                className="category-box"
                onClick={() => navigate(`/category/${cat.id}`)}
              >
                <img 
                  src={cat.image_url || defaultImages[index % 4]} 
                  alt={cat.name} 
                />
                <div className="category-info">
                  <h4>{cat.name}</h4>
                  {cat.description && <p>{cat.description}</p>}
                </div>
                <i className='bx bx-chevron-right'></i>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </>
  );
}

export default AllCategories;