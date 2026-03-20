import { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import BottomNav from "../components/BottomNav";
import { productService } from "../services/productService";

function Home() {
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoriesTree();
  }, []);

  const loadCategoriesTree = async () => {
    try {
      const data = await productService.getCategoriesTree();
      setCategoriesTree(data);
    } catch (error) {
      console.error('Failed to load categories tree:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="content">
        <SearchBar />
        <HeroBanner />
        <BottomNav />

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading categories...</p>
        ) : (
          <div className="home-categories">
            {categoriesTree
              .filter(parentCategory => parentCategory.children?.length > 0)
              .map((parentCategory) => (
                <div key={parentCategory.id} className="category-group">
                  <h3 className="category-group-heading">{parentCategory.name}</h3>
                  <Categories categories={parentCategory.children} />
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;