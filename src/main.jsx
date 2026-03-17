import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LoaderProvider } from "./context/LoaderContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { WishlistProvider } from "./context/WishlistContext";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoaderProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </LoaderProvider>
  </React.StrictMode>
);