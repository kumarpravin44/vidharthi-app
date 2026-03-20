import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { addressService } from "../services/addressService";
import { useLoader } from "../context/LoaderContext";
import "boxicons/css/boxicons.min.css";

function AddAddress() {

  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    label: "home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = async () => {

    if (!formData.street || !formData.city || !formData.state || !formData.pincode) {
      setPopupMessage("Please fill all required fields");
      setPopupType("error");
      return;
    }

    setLoading(true);

    try {
      await addressService.createAddress(formData);
      setLoading(false);
      setPopupType("success");
      setPopupMessage("Address Saved Successfully ✅");
      setTimeout(() => {
        navigate("/addresses");
      }, 1500);
    } catch (error) {
      setLoading(false);
      setPopupType("error");
      setPopupMessage(error.message || "Failed to save address");
    }
  };

  return (
    <>
      <InternalHeader title="Add New Address"  />

      <div className="add-address-page content">

        <div className="address-form-card">

          <div className="form-group">
            <label>Address Type</label>
            <select
              name="label"
              value={formData.label}
              onChange={handleChange}
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Street Address *</label>
            <textarea
              name="street"
              rows="2"
              value={formData.street}
              onChange={handleChange}
              placeholder="House no, Building, Street, Area"
            />
          </div>

          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              maxLength="10"
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
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
            <i
              className={`bx ${
                popupType === "success"
                  ? "bx-check-circle success-icon"
                  : "bx-error error-icon"
              }`}
            ></i>
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