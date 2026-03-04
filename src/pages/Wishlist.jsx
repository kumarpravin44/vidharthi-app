import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";

import saltImg from "../images/product/salt.webp";
import riceImg from "../images/product/rice.webp";

function Wishlist() {

  const [wishlist, setWishlist] = useState([
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
    }
  ]);

  const removeItem = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const moveToCart = (item) => {
    alert(`${item.name} moved to cart 🛒`);
  };

  return (
    <>
      <InternalHeader title="My Wishlist" />

      <div className="content" >

      <div className="wishlist-page page-container">

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <i className='bx bx-heart'></i>
            <p>Your wishlist is empty</p>
          </div>
        ) : (
          wishlist.map(item => (
            <div className="wishlist-card" key={item.id}>

              <img src={item.image} alt={item.name} />

              <div className="wishlist-details">
                <h4>{item.name}</h4>
                <p>₹ {item.price}</p>

                <div className="wishlist-actions">
                  <button
                    className="move-btn"
                    onClick={() => moveToCart(item)}
                  >
                    Move to Cart
                  </button>

                  <i
                    className='bx bx-trash remove-icon'
                    onClick={() => removeItem(item.id)}
                  ></i>
                </div>
              </div>

            </div>
          ))
        )}

      </div>
      </div>

      <BottomNav />
    </>
  );
}

export default Wishlist;