import { useParams } from "react-router-dom";
import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";

import saltImg from "../images/product/salt.webp";
import riceImg from "../images/product/rice.webp";

function CategoryProducts() {

  const { id } = useParams();

  // Dummy Products (Later filter by category id)
  const [products] = useState([
    {
      id: 1,
      name: "Tata Salt",
      price: 25,
      image: saltImg
    },
    {
      id: 2,
      name: "Basmati Rice",
      price: 120,
      image: riceImg
    },
    {
      id: 3,
      name: "Premium Rice",
      price: 150,
      image: riceImg
    },
    {
      id: 4,
      name: "Rock Salt",
      price: 30,
      image: saltImg
    }
  ]);

  return (
    <>
      <InternalHeader title="Products" />

      <div className="category-products-page content">

        {products.length === 0 ? (
          <div className="empty-products">
            <i className='bx bx-package'></i>
            <p>No products found</p>
          </div>
        ) : (
          <div className="products-grid">

            {products.map(product => (
              <div className="product-card" key={product.id}>

                <div className="wishlist-icon">
                  <i className='bx bx-heart'></i>
                </div>

                <img src={product.image} alt={product.name} />

                <h4>{product.name}</h4>
                <p className="price">₹ {product.price}</p>

                <button className="add-cart-btn">
                  Add to Cart
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

      <BottomNav />
    </>
  );
}

export default CategoryProducts;