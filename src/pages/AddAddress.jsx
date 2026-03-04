import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useLoader } from "../context/LoaderContext";
import "boxicons/css/boxicons.min.css";

function AddAddress() {

  const { setLoading } = useLoader();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pincode: "",
    state: "",
    city: "",
    address: "",
    type: "Home",
    isDefault: false
  });

  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = () => {

    if (!formData.name || !formData.mobile || !formData.address) {
      setPopupMessage("Please fill all required fields");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setPopupMessage("Address Saved Successfully ✅");
    }, 1500);
  };

  return (
    <>
      <InternalHeader title="Add New Address" />

      <div className="add-address-page content">

        <div className="address-form-card">

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              maxLength="10"
            />
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Full Address *</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option>Home</option>
              <option>Work</option>
            </select>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            <label>Set as Default Address</label>
          </div>

          <button
            className="primary-btn"
            onClick={handleSave}
          >
            Save Address
          </button>

        </div>

      </div>

      {/* Popup */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i className='bx bx-check-circle success-icon'></i>
            <h3>{popupMessage}</h3>
            <button onClick={() => setPopupMessage("")}>
              OK
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default AddAddress;