import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useAppSettings } from "../context/AppSettingsContext";
import { orderService } from "../services/orderService";
import { addressService } from "../services/addressService";
import { useLoader } from "../context/LoaderContext";
import "boxicons/css/boxicons.min.css";

function Checkout() {
  const navigate = useNavigate();
  const { cart, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { settings: appSettings } = useAppSettings();
  const { setLoading } = useLoader();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  // Address state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressMode, setAddressMode] = useState("saved"); // "saved" or "new"
  const [manualAddress, setManualAddress] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // New address form
  const [newAddress, setNewAddress] = useState({
    label: "home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false
  });
  const [savingAddress, setSavingAddress] = useState(false);

  const deliveryCharge = cart && cart.items && cart.items.length === 1
    ? appSettings.delivery_charge_single
    : appSettings.delivery_charge_multiple;
  const total = totalAmount + deliveryCharge;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate("/cart");
    }
  }, [isAuthenticated, cart, navigate]);

  // Load saved addresses
  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await addressService.getAddresses();
      setSavedAddresses(data);
      // Auto-select default address
      const defaultAddr = data.find(a => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setAddressMode("saved");
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
        setAddressMode("saved");
      } else {
        setAddressMode("new");
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setAddressMode("new");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const formatAddress = (addr) => {
    return `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
  };

  const handleSaveNewAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      showPopup("Please fill all required address fields", "error");
      return;
    }

    setSavingAddress(true);
    try {
      const saved = await addressService.createAddress(newAddress);
      setSavedAddresses(prev => [...prev, saved]);
      setSelectedAddressId(saved.id);
      setAddressMode("saved");
      setNewAddress({ label: "home", street: "", city: "", state: "", pincode: "", is_default: false });
      showPopup("Address saved successfully!");
    } catch (error) {
      showPopup(error.message || "Failed to save address", "error");
    } finally {
      setSavingAddress(false);
    }
  };

  const getDeliveryAddress = () => {
    if (addressMode === "saved" && selectedAddressId) {
      const addr = savedAddresses.find(a => a.id === selectedAddressId);
      return addr ? formatAddress(addr) : "";
    }
    return manualAddress;
  };

  const handlePlaceOrder = async () => {
    const deliveryAddress = getDeliveryAddress();
    if (!deliveryAddress) {
      showPopup("Please select or enter a delivery address", "error");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        delivery_address: deliveryAddress,
        address_id: addressMode === "saved" ? selectedAddressId : undefined,
        payment_method: paymentMethod,
        notes: ""
      };

      const order = await orderService.createOrder(orderData);
      
      // Clear cart from frontend state (backend already cleared it)
      await clearCart();
      
      setLoading(false);
      showPopup("Order placed successfully! 🎉", "success");
      
      setTimeout(() => {
        navigate(`/orders`);
      }, 2000);
    } catch (error) {
      setLoading(false);
      showPopup(error.message || "Failed to place order", "error");
    }
  };

  if (!cart || !cart.items) {
    return (
      <>
        <InternalHeader title="Checkout" />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title="Checkout" />
      <div className="content">
        <div className="checkout-page">

          {/* Maintenance Mode Banner */}
          {appSettings.maintenance_mode && (
            <div style={{
              background: '#fff3e0', border: '1px solid #ff9800', borderRadius: '8px',
              padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <i className='bx bx-error-circle' style={{ fontSize: '22px', color: '#e65100' }}></i>
              <span style={{ color: '#e65100', fontSize: '14px', fontWeight: 500 }}>
                {appSettings.maintenance_message || "We are currently under maintenance. Please try again later."}
              </span>
            </div>
          )}

          {/* Address Section */}
          <div className="checkout-card">
            <div className="card-header">
              <i className='bx bx-map'></i>
              <h4>Delivery Address</h4>
            </div>

            {loadingAddresses ? (
              <p style={{ color: '#999', fontSize: '14px' }}>Loading addresses...</p>
            ) : (
              <>
                {/* Address mode tabs */}
                <div className="address-mode-tabs">
                  <button
                    className={`mode-tab ${addressMode === "saved" ? "active" : ""}`}
                    onClick={() => setAddressMode("saved")}
                    disabled={savedAddresses.length === 0}
                  >
                    <i className='bx bx-bookmark'></i> Saved Addresses
                  </button>
                  <button
                    className={`mode-tab ${addressMode === "new" ? "active" : ""}`}
                    onClick={() => setAddressMode("new")}
                  >
                    <i className='bx bx-plus'></i> New Address
                  </button>
                </div>

                {/* Saved addresses list */}
                {addressMode === "saved" && savedAddresses.length > 0 && (
                  <div className="saved-address-list">
                    {savedAddresses.map(addr => (
                      <label
                        key={addr.id}
                        className={`saved-address-option ${selectedAddressId === addr.id ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                        <div className="saved-address-info">
                          <div className="saved-address-top">
                            <span className="address-label-tag">{addr.label}</span>
                            {addr.is_default && <span className="default-badge">Default</span>}
                          </div>
                          <p className="saved-address-text">{formatAddress(addr)}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* New address form */}
                {addressMode === "new" && (
                  <div className="new-address-form">
                    <div className="inline-form-row">
                      <select
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="inline-select"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                      <label className="inline-checkbox">
                        <input
                          type="checkbox"
                          checked={newAddress.is_default}
                          onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                        />
                        Set as default
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Street address *"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="checkout-input"
                    />
                    <div className="inline-form-row">
                      <input
                        type="text"
                        placeholder="City *"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="checkout-input"
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="checkout-input"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="checkout-input"
                      style={{ maxWidth: '180px' }}
                    />
                    <button
                      className="save-address-btn"
                      onClick={handleSaveNewAddress}
                      disabled={savingAddress}
                    >
                      {savingAddress ? "Saving..." : "Save & Use This Address"}
                    </button>

                    <div className="or-divider">
                      <span>or enter manually</span>
                    </div>

                    <textarea
                      placeholder="Type full delivery address..."
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      rows="3"
                      className="checkout-textarea"
                    />
                  </div>
                )}
              </>
            )}

            <p style={{ marginTop: '10px', color: '#666' }}>
              {user?.full_name && `👤 ${user.full_name}`}
              {user?.phone && ` | 📞 ${user.phone}`}
            </p>
          </div>

          {/* Order Summary */}
          <div className="checkout-card">
            <div className="card-header">
              <i className='bx bx-cart'></i>
              <h4>Order Summary</h4>
            </div>

            {cart.items.map(item => (
              <div className="summary-item" key={item.product_id}>
                <span>{item.product?.name} × {item.quantity}</span>
                <span>₹ {(item.product?.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="price-row">
              <span>Subtotal</span>
              <span>₹ {totalAmount.toFixed(2)}</span>
            </div>

            <div className="price-row">
              <span>Delivery</span>
              <span>₹ {deliveryCharge}</span>
            </div>

            <div className="price-total">
              <span>Total</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-card">
            <div className="card-header">
              <i className='bx bx-credit-card'></i>
              <h4>Payment Method</h4>
            </div>

            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
            </div>

            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Online Payment
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom */}
      <div className="place-order-bar">
        <button
          className="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={appSettings.maintenance_mode}
          style={appSettings.maintenance_mode ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          {appSettings.maintenance_mode ? "Store Under Maintenance" : `Place Order ₹ ${total.toFixed(2)}`}
        </button>
      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i
              className={`bx ${
                popupType === "success"
                  ? "bx-check-circle success-icon"
                  : "bx-error error-icon"
              }`}
            ></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default Checkout;