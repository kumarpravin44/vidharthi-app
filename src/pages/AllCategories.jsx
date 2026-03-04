import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";

import saltImg from "../images/product/salt.webp";
import riceImg from "../images/product/rice.webp";
import drinksImg from "../images/product/drinks.webp";
import dryfruitsImg from "../images/product/dryfruits.webp";

function AllCategories() {

  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "Salt & Sugar", image: saltImg, count: 12 },
    { id: 2, name: "Rice", image: riceImg, count: 8 },
    { id: 3, name: "Drinks", image: drinksImg, count: 15 },
    { id: 4, name: "Dry Fruits", image: dryfruitsImg, count: 6 },
    { id: 5, name: "Snacks", image: saltImg, count: 10 },
    { id: 6, name: "Dairy", image: riceImg, count: 9 },
    { id: 7, name: "Spices", image: drinksImg, count: 7 },
    { id: 8, name: "Bakery", image: dryfruitsImg, count: 5 }
  ];

  return (
    <>
      <InternalHeader title="" showSearch />

      <div className="all-categories-page content">

        <div className="categories-grid-new">

          {categories.map(cat => (
            <div
              key={cat.id}
              className="category-box"
              onClick={() => navigate(`/category/${cat.id}`)}
            >
              <img src={cat.image} alt={cat.name} />
              <div className="category-info">
                <h4>{cat.name}</h4>
                <p>{cat.count} Items</p>
              </div>
              <i className='bx bx-chevron-right'></i>
            </div>
          ))}

        </div>

      </div>

      <BottomNav />
    </>
  );
}

export default AllCategories;