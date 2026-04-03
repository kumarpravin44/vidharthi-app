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
import { useLanguage } from "../context/LanguageContext";
import "boxicons/css/boxicons.min.css";

function Checkout() {
  const navigate = useNavigate();
  const { cart, totalAmount, clearCart } = useCart();
  const { getLocalizedName, t } = useLanguage();
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

  // Calculate delivery charge using tiers (matching backend logic)
  const calculateDeliveryCharge = () => {
    if (!cart || !cart.items) return 0;
    
    const tiers = appSettings.delivery_charge_tiers;
    if (tiers && Array.isArray(tiers) && tiers.length > 0) {
      // Find the first tier where totalAmount is within min/max
      for (const tier of tiers) {
        const minPrice = tier.min_price || 0;
        const maxPrice = tier.max_price;
        if (totalAmount >= minPrice && (maxPrice === null || maxPrice === undefined || totalAmount <= maxPrice)) {
          return tier.delivery_charge || 0;
        }
      }
      return 0; // No matching tier, free delivery
    } else {
      // Fallback to old logic if tiers not configured
      return cart.items.length === 1
        ? appSettings.delivery_charge_single
        : appSettings.delivery_charge_multiple;
    }
  };
  
  const deliveryCharge = calculateDeliveryCharge();
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
      showPopup(t("please_fill_fields"), "error");
      return;
    }

    setSavingAddress(true);
    try {
      const saved = await addressService.createAddress(newAddress);
      setSavedAddresses(prev => [...prev, saved]);
      setSelectedAddressId(saved.id);
      setAddressMode("saved");
      setNewAddress({ label: "home", street: "", city: "", state: "", pincode: "", is_default: false });
      showPopup(t("address_saved"));
    } catch (error) {
      showPopup(error.message || t("failed_save_address"), "error");
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
      showPopup(t("please_select_address"), "error");
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
      showPopup(t("order_placed"), "success");
      
      setTimeout(() => {
        navigate(`/orders`);
      }, 2000);
    } catch (error) {
      setLoading(false);
      showPopup(error.message || t("failed_place_order"), "error");
    }
  };

  if (!cart || !cart.items) {
    return (
      <>
        <InternalHeader title={t("checkout")} />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '20px' }}>{t("loading_checkout")}</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title={t("checkout")} />
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
                {appSettings.maintenance_message || t("store_maintenance")}
              </span>
            </div>
          )}

          {/* Address Section */}
          <div className="checkout-card">
            <div className="card-header">
              <i className='bx bx-map'></i>
              <h4>{t("delivery_address")}</h4>
            </div>

            {loadingAddresses ? (
              <p style={{ color: '#999', fontSize: '14px' }}>{t("loading_addresses")}</p>
            ) : (
              <>
                {/* Address mode tabs */}
                <div className="address-mode-tabs">
                  <button
                    className={`mode-tab ${addressMode === "saved" ? "active" : ""}`}
                    onClick={() => setAddressMode("saved")}
                    disabled={savedAddresses.length === 0}
                  >
                    <i className='bx bx-bookmark'></i> {t("saved_addresses")}
                  </button>
                  <button
                    className={`mode-tab ${addressMode === "new" ? "active" : ""}`}
                    onClick={() => setAddressMode("new")}
                  >
                    <i className='bx bx-plus'></i> {t("new_address")}
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
                        <option value="home">{t("home")}</option>
                        <option value="work">{t("work")}</option>
                        <option value="other">{t("other")}</option>
                      </select>
                      <label className="inline-checkbox">
                        <input
                          type="checkbox"
                          checked={newAddress.is_default}
                          onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                        />
                        {t("set_default")}
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder={t("street_address")}
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="checkout-input"
                    />
                    <div className="inline-form-row">
                      <input
                        type="text"
                        placeholder={t("city")}
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="checkout-input"
                      />
                      <input
                        type="text"
                        placeholder={t("state")}
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="checkout-input"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder={t("pincode")}
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="checkout-input"
                    />
                    <button
                      className="save-address-btn"
                      onClick={handleSaveNewAddress}
                      disabled={savingAddress}
                    >
                      {savingAddress ? t("saving") : t("save_use_address")}
                    </button>

                    <div className="or-divider">
                      <span>{t("or_enter_manually")}</span>
                    </div>

                    <textarea
                      placeholder={t("type_full_address")}
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
              <h4>{t("order_summary")}</h4>
            </div>

            {cart.items.map(item => (
              <div className="summary-item" key={item.product_id}>
                <span>{getLocalizedName(item.product)} × {item.quantity}</span>
                <span>₹ {(item.product?.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="price-row">
              <span>{t("subtotal")}</span>
              <span>₹ {totalAmount.toFixed(2)}</span>
            </div>

            <div className="price-row">
              <span>{t("delivery")}</span>
              <span>₹ {deliveryCharge}</span>
            </div>

            <div className="price-total">
              <span>{t("total")}</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-card">
            <div className="card-header">
              <i className='bx bx-credit-card'></i>
              <h4>{t("payment_method")}</h4>
            </div>

            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {t("cash_delivery")}
              </label>
            </div>

            {/* <div className="payment-option">
              <label>
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Online Payment
              </label>
            </div> */}
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
          {appSettings.maintenance_mode ? t("store_maintenance") : `${t("place_order")} ₹ ${total.toFixed(2)}`}
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