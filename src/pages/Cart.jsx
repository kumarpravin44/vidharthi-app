import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";
import { Link } from "react-router-dom";


import saltImg from "../images/product/salt.webp";

import riceImg from "../images/product/rice.webp";


function Cart() {

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Tata Salt",
      price: 25,
      quantity: 1,
      image: saltImg
    },
    {
      id: 2,
      name: "Basmati Rice",
      price: 120,
      quantity: 1,
      image: riceImg
    }
  ]);

  // Increase Quantity
  const increaseQty = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // Decrease Quantity
  const decreaseQty = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  // Remove Item
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculate Total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <InternalHeader title="My Cart" />

     <div className="content" >
      <div className="cart-page">

        

        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          cartItems.map(item => (
            <div className="cart-item" key={item.id}>

              <img src={item.image} alt={item.name} />

              <div className="cart-details">
                <h4>{item.name}</h4>
                <p>₹ {item.price}</p>

                <div className="qty-controls">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>
              </div>

              <i
                className='bx bx-trash remove-icon'
                onClick={() => removeItem(item.id)}
              ></i>

            </div>
          ))
        )}

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h3>Total: ₹ {total}</h3>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        )}

      </div>
      </div>  

      <BottomNav />
    </>
  );
}

export default Cart;