import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LoaderProvider } from "./context/LoaderContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { NavigationProvider } from "./context/NavigationContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./i18n";
import "./style.css";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
    <AppSettingsProvider>
      <AuthProvider>
        <LoaderProvider>
          <NavigationProvider>
            <CartProvider>
              <NotificationProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </NotificationProvider>
            </CartProvider>
          </NavigationProvider>
        </LoaderProvider>
      </AuthProvider>
    </AppSettingsProvider>
    </LanguageProvider>
  </React.StrictMode>
);