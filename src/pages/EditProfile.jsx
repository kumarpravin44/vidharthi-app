import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useLoader } from "../context/LoaderContext";
import { useAuth } from "../context/AuthContext";
import "boxicons/css/boxicons.min.css";

function EditProfile() {
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { user, isAuthenticated, updateProfile, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
      });
      if (user.avatar_url) {
        setProfileImage(user.avatar_url);
      }
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    // TODO: In production, upload image to server and get URL
    }
  };

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const updateData = {};
      if (formData.full_name !== user.full_name) {
        updateData.full_name = formData.full_name;
      }
      if (formData.email !== user.email) {
        updateData.email = formData.email;
      }

      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData);
        await refreshUser();
        showPopup("Profile Updated Successfully ✅", "success");
      } else {
        showPopup("No changes made", "error");
      }
    } catch (error) {
      showPopup(error.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <InternalHeader title="Edit Profile" />
        <div className="content">
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title="Edit Profile" />

      <div className="edit-profile-page content">

        <div className="edit-card">

          {/* Profile Image */}
          <div className="profile-image-section">
            <div className="profile-preview">
              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <i className='bx bx-user'></i>
              )}
            </div>

            <label className="upload-btn">
              Change Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Form */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              value={user.phone}
              readOnly
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>Phone number cannot be changed</small>
          </div>

          <button
            className="primary-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>

        </div>

      </div>

      {/* Success Popup */}
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

export default EditProfile;