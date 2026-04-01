import { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import CategoryProducts from "../components/CategoryProducts";
import BottomNav from "../components/BottomNav";
import { productService } from "../services/productService";
import { useTranslation } from "react-i18next"; // 👈 ADD

function Home() {
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // 👈 ADD

  useEffect(() => {
    loadCategoriesTree();
  }, []);

  const loadCategoriesTree = async () => {
    try {
      const data = await productService.getCategoriesTree();
      setCategoriesTree(data);
    } catch (error) {
      console.error("Failed to load categories tree:", error);
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
          <p style={{ textAlign: "center", padding: "20px" }}>
            {t("loading_categories")} {/* 👈 translated */}
          </p>
        ) : (
          <div className="home-categories">
            {categoriesTree.map((parentCategory) => (
              <div key={parentCategory.id} className="category-group">
                
                {/* ⚠️ Dynamic text */}
                <h3 className="category-group-heading">
                  {parentCategory.name}
                </h3>

                {parentCategory.children && parentCategory.children.length > 0 ? (
                  <Categories categories={parentCategory.children} />
                ) : (
                  <CategoryProducts
                    categoryId={parentCategory.id}
                    categoryName={parentCategory.name}
                    limit={8}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;