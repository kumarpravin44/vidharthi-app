
import saltImg from "../images/product/salt.webp";
import drinksImg from "../images/product/drinks.webp";
import riceImg from "../images/product/rice.webp";
import dryfruitsImg from "../images/product/dryfruits.webp";


function Categories() {
  const items = [
    { img: saltImg, name: "Salt & Sugar" },
    { img: riceImg, name: "Rice" },
    { img: drinksImg, name: "Drinks" },
    { img: dryfruitsImg, name: "Dry Fruits" },
    { img: saltImg, name: "Salt & Sugar" },
    { img: riceImg, name: "Rice" },
    { img: drinksImg, name: "Drinks" },
    { img: dryfruitsImg, name: "Dry Fruits" },
    { img: saltImg, name: "Salt & Sugar" },
    { img: riceImg, name: "Rice" },
    { img: drinksImg, name: "Drinks" },
    { img: dryfruitsImg, name: "Dry Fruits" },
    { img: saltImg, name: "Salt & Sugar" },
    { img: riceImg, name: "Rice" },
    { img: drinksImg, name: "Drinks" },
    { img: dryfruitsImg, name: "Dry Fruits" },
  ];

  return (
    <div className="categories">
      {items.map((item, index) => (
        <div className="category-card" key={index}>
          <img src={item.img} />
          <p>{item.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;