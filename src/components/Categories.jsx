import { Link } from "react-router-dom";

import saltImg from "../images/product/salt.webp";
import drinksImg from "../images/product/drinks.webp";
import riceImg from "../images/product/rice.webp";
import dryfruitsImg from "../images/product/dryfruits.webp";

function Categories() {

  const items = [
    { id: 1, img: saltImg, name: "Salt & Sugar" },
    { id: 2, img: riceImg, name: "Rice" },
    { id: 3, img: drinksImg, name: "Drinks" },
    { id: 4, img: dryfruitsImg, name: "Dry Fruits" },
    { id: 5, img: saltImg, name: "Salt & Sugar" },
    { id: 6, img: riceImg, name: "Rice" },
    { id: 7, img: drinksImg, name: "Drinks" },
    { id: 8, img: dryfruitsImg, name: "Dry Fruits" },
  ];

  return (
    <div className="categories">

      {items.map((item) => (
        <Link
          to={`/category/${item.id}`}
          key={item.id}
          className="category-link"
        >
          <div className="category-card">
            <img src={item.img} alt={item.name} />
            <p>{item.name}</p>
          </div>
        </Link>
      ))}

    </div>
  );
}

export default Categories;