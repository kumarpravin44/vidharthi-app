import { useState } from "react";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useLoader } from "../context/LoaderContext";
import "boxicons/css/boxicons.min.css";

function EditProfile() {

  const { setLoading } = useLoader();

  const [formData, setFormData] = useState({
    name: "Pravin Kumar",
    email: "pravin@email.com",
    mobile: "9876543210",
    gender: "Male",
    dob: "1998-05-10"
  });

  const [profileImage, setProfileImage] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setPopupMessage("Profile Updated Successfully ✅");
    }, 1500);
  };

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
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Form */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              value={formData.mobile}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
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

export default EditProfile;