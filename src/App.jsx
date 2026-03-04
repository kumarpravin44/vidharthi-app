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
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;