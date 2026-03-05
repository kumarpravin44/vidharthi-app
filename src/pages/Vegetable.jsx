import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";

import tomatoImg from "../images/product/tomoato.jpg";
import potatoImg from "../images/product/potato.jpg";
import oninonImg from "../images/product/oninon.jpg";
import carrotImg from "../images/product/carrot.jpg";

function Vegetable() {

  const navigate = useNavigate();

  const [popupMessage, setPopupMessage] = useState("");

  const vegetables = [
    { id: 1, name: "Tomato", price: 30, image: tomatoImg },
    { id: 2, name: "Potato", price: 25, image: potatoImg },
    { id: 3, name: "Onion", price: 40, image: oninonImg },
    { id: 4, name: "Carrot", price: 50, image: carrotImg }
  ];

  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  return (
    <>
      <InternalHeader title="Fresh Vegetables" showSearch />

      <div className="vegetable-page content">

        <div className="products-grid">

          {vegetables.map(item => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => navigate(`/product/${item.id}`)}
            >

              {/* Wishlist */}
              <div
                className="wishlist-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  showPopup("Added to wishlist ❤️");
                }}
              >
                <i className='bx bx-heart'></i>
              </div>

              <img src={item.image} alt={item.name} />

              <h4>{item.name}</h4>
              <p className="price">₹ {item.price} / kg</p>

              <button
                className="add-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  showPopup("Added to cart 🛒");
                }}
              >
                Add to Cart
              </button>

            </div>
          ))}

        </div>

      </div>

      {/* Popup */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i className="bx bx-check-circle success-icon"></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default Vegetable;