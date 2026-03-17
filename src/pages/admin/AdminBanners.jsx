import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import ImageUpload from "../../components/ImageUpload";
import { adminService } from "../../services/adminService";
import "boxicons/css/boxicons.min.css";

function AdminBanners() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    loadBanners();
  }, [navigate]);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await adminService.getBanners();
      // Sort by sort_order for display
      const sorted = data.sort((a, b) => a.sort_order - b.sort_order);
      setBanners(sorted);
    } catch (error) {
      showPopup("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 2500);
  };

  const handleAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      image_url: "",
      link_url: "",
      sort_order: 0,
      is_active: true,
    });
    setShowModal(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      image_url: banner.image_url || "",
      link_url: banner.link_url || "",
      sort_order: banner.sort_order ?? 0,
      is_active: banner.is_active ?? true,
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminService.toggleBannerStatus(id, !currentStatus);
      showPopup("Banner status updated");
      loadBanners();
    } catch (error) {
      showPopup("Failed to update banner status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image_url) {
      showPopup("Title and image are required");
      return;
    }

    const payload = {
      title: formData.title,
      image_url: formData.image_url,
      link_url: formData.link_url || null,
      sort_order: Number(formData.sort_order) || 0,
      is_active: formData.is_active,
    };

    try {
      if (editingBanner) {
        await adminService.updateBanner(editingBanner.id, payload);
        showPopup("Banner updated");
      } else {
        await adminService.createBanner(payload);
        showPopup("Banner created");
      }
      setShowModal(false);
      loadBanners();
    } catch (err) {
      showPopup(err.message || "Failed to save banner");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <div className="admin-content">
          <p>Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Banners</h1>
            <p>Manage home page banner images</p>
          </div>
          <button className="admin-primary-btn" onClick={handleAdd}>
            <i className="bx bx-plus"></i> Add Banner
          </button>
        </div>

        {banners.length === 0 ? (
          <div className="empty-state">
            <p>No banners found. Create your first banner!</p>
          </div>
        ) : (
          <div className="banners-grid">
            {banners.map((banner) => (
              <div key={banner.id} className="banner-card">
                <div className="banner-image">
                  <img src={banner.image_url} alt={banner.title} />
                  <div className="banner-overlay">
                    <span className={`status-badge ${banner.is_active ? 'active' : 'inactive'}`}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="banner-info">
                  <h4>{banner.title}</h4>
                  {banner.link_url && (
                    <p className="banner-link">
                      <i className="bx bx-link"></i> {banner.link_url}
                    </p>
                  )}
                  <p className="banner-order">Sort Order: {banner.sort_order}</p>
                </div>
                <div className="banner-actions">
                  <button 
                    className="btn-icon" 
                    onClick={() => handleEdit(banner)}
                    title="Edit"
                  >
                    <i className="bx bx-edit"></i>
                  </button>
                  <button 
                    className={`btn-icon ${banner.is_active ? 'danger' : 'success'}`}
                    onClick={() => handleToggleStatus(banner.id, banner.is_active)}
                    title={banner.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <i className={`bx ${banner.is_active ? 'bx-hide' : 'bx-show'}`}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>{editingBanner ? "Edit Banner" : "Add New Banner"}</h2>
                <button onClick={() => setShowModal(false)}>
                  <i className="bx bx-x"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Summer Sale 2026"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Banner Image *</label>
                  <ImageUpload
                    type="banner"
                    currentImage={formData.image_url}
                    onImageUploaded={(url) => setFormData((prev) => ({ ...prev, image_url: url || "" }))}
                    label="Banner Image"
                  />
                  <small className="form-hint">Recommended: 1200x400px, JPG/PNG</small>
                </div>

                <div className="form-group">
                  <label>Link URL (optional)</label>
                  <input
                    type="text"
                    name="link_url"
                    value={formData.link_url}
                    onChange={handleChange}
                    placeholder="e.g., /products?category=sale"
                  />
                  <small className="form-hint">Leave empty if banner is not clickable</small>
                </div>

                <div className="form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    min="0"
                  />
                  <small className="form-hint">Lower numbers appear first</small>
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span>Active (show on homepage)</span>
                  </label>
                  <small className="form-hint">Inactive banners won't appear on the homepage</small>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingBanner ? "Update Banner" : "Create Banner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Popup Message */}
        {popupMessage && (
          <div className="admin-popup">
            <div className="admin-popup-content">
              <i className="bx bx-check-circle"></i>
              <span>{popupMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBanners;
