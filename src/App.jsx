import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyAccount from "./pages/MyAccount";
import MyOrders from "./pages/MyOrders";
import SavedAddresses from "./pages/SavedAddresses";
import Wishlist from "./pages/Wishlist";
import HelpSupport from "./pages/HelpSupport";
import EditProfile from "./pages/EditProfile";
import AddAddress from "./pages/AddAddress";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetail from "./pages/ProductDetail";
import AllCategories from "./pages/AllCategories";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnRefundPolicy from "./pages/ReturnRefundPolicy";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/addresses" element={<SavedAddresses />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/help" element={<HelpSupport />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/all-categories" element={<AllCategories />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;