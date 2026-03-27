import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { adminService } from "../../services/adminService";
import Loader from "../../components/Loader";
import "boxicons/css/boxicons.min.css";

function AdminOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    title: "",
    discount_percent: "",
    max_uses: "",
    expires_at: "",
    is_active: true,
  });

  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProductDropdown && !e.target.closest('.form-group')) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProductDropdown]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [offersData, productsData] = await Promise.all([
        adminService.getOffers(),
        adminService.getProducts(),
      ]);
      setOffers(offersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      showPopup("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handleAdd = () => {
    setEditingOffer(null);
    setProductSearch("");
    setShowProductDropdown(false);
    setFormData({
      product_id: "",
      title: "",
      discount_percent: "",
      max_uses: "",
      expires_at: "",
      is_active: true,
    });
    setShowModal(true);
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setShowProductDropdown(false);
    // Convert expires_at to datetime-local format (YYYY-MM-DDTHH:MM)
    const expiresDate = new Date(offer.expires_at);
    const formattedDate = expiresDate.toISOString().slice(0, 16);
    
    const selectedProduct = products.find(p => p.id === offer.product_id);
    setProductSearch(selectedProduct ? selectedProduct.name : "");
    
    setFormData({
      product_id: offer.product_id,
      title: offer.title,
      discount_percent: offer.discount_percent,
      max_uses: offer.max_uses || "",
      expires_at: formattedDate,
      is_active: offer.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      await adminService.deleteOffer(id);
      showPopup("Offer deleted successfully");
      loadData();
    } catch (error) {
      showPopup("Failed to delete offer");
    }
  };

  const handleToggleActive = async (offer) => {
    try {
      if (offer.is_active) {
        await adminService.deactivateOffer(offer.id);
        showPopup("Offer deactivated");
      } else {
        // To activate, we update with is_active: true
        await adminService.updateOffer(offer.id, { is_active: true });
        showPopup("Offer activated");
      }
      loadData();
    } catch (error) {
      showPopup("Failed to toggle offer status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const discount = parseFloat(formData.discount_percent);
      
      if (discount <= 0 || discount > 100) {
        showPopup("Discount must be between 1 and 100");
        return;
      }

      // Convert datetime-local to ISO format
      const expiresAt = new Date(formData.expires_at).toISOString();

      const offerData = {
        product_id: formData.product_id,
        title: formData.title,
        discount_percent: discount,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        expires_at: expiresAt,
      };

      // For updates, include is_active
      if (editingOffer) {
        offerData.is_active = formData.is_active;
        await adminService.updateOffer(editingOffer.id, offerData);
        showPopup("Offer updated successfully");
      } else {
        await adminService.createOffer(offerData);
        showPopup("Offer created successfully");
      }
      
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving offer:', error);
      showPopup(`Failed to save offer: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  const getFilteredProducts = () => {
    return products.filter(p => {
      // Filter by search term
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
      
      // When editing, show current product
      if (editingOffer && p.id === editingOffer.product_id) {
        return matchesSearch;
      }
      
      // Otherwise, only show products without active offers
      const hasActiveOffer = offers.some(o => o.product_id === p.id && o.is_active);
      return matchesSearch && !hasActiveOffer;
    });
  };

  const handleProductSelect = (product) => {
    setFormData({ ...formData, product_id: product.id });
    setProductSearch(product.name);
    setShowProductDropdown(false);
  };

  const handleProductSearchChange = (e) => {
    setProductSearch(e.target.value);
    setShowProductDropdown(true);
    if (!e.target.value) {
      setFormData({ ...formData, product_id: "" });
    }
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const getOfferStatusBadge = (offer) => {
    if (!offer.is_active) {
      return <span className="status-badge status-inactive">Inactive</span>;
    }
    if (isExpired(offer.expires_at)) {
      return <span className="status-badge status-expired">Expired</span>;
    }
    return <span className="status-badge status-active">Active</span>;
  };

  if (loading) {
    return <Loader text="Loading offers..." />;
  }

  return (
    <>
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Offers Management</h1>
            <p>Create and manage promotional offers</p>
          </div>
          <button className="admin-primary-btn" onClick={handleAdd}>
            <i className='bx bx-plus'></i>
            Add Offer
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Title</th>
                <th>Discount</th>
                <th>Uses</th>
                <th>Expires At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No offers found
                  </td>
                </tr>
              ) : (
                offers.map(offer => (
                  <tr key={offer.id}>
                    <td>{getProductName(offer.product_id)}</td>
                    <td>{offer.title}</td>
                    <td>
                      <strong>{offer.discount_percent}%</strong>
                    </td>
                    <td>
                      {offer.max_uses 
                        ? `${offer.used_count}/${offer.max_uses}` 
                        : `${offer.used_count}/∞`
                      }
                    </td>
                    <td>{new Date(offer.expires_at).toLocaleString()}</td>
                    <td>{getOfferStatusBadge(offer)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(offer)}
                          title="Edit"
                        >
                          <i className='bx bx-edit'></i>
                        </button>
                        <label className="toggle-switch" title={offer.is_active ? "Active - Click to deactivate" : "Inactive - Click to activate"}>
                          <input
                            type="checkbox"
                            checked={offer.is_active}
                            onChange={() => handleToggleActive(offer)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(offer.id)}
                          title="Delete"
                        >
                          <i className='bx bx-trash'></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offer Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h2>
              <button onClick={() => setShowModal(false)}>
                <i className='bx bx-x'></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Product *</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Search for a product..."
                      value={productSearch}
                      onChange={handleProductSearchChange}
                      onFocus={() => setShowProductDropdown(true)}
                      required
                      disabled={editingOffer !== null}
                      autoComplete="off"
                      style={{ paddingRight: '70px' }}
                    />
                    {productSearch && !editingOffer && (
                      <i 
                        className='bx bx-x' 
                        onClick={() => {
                          setProductSearch("");
                          setFormData({ ...formData, product_id: "" });
                        }}
                        style={{
                          position: 'absolute',
                          right: '35px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#999',
                          cursor: 'pointer',
                          fontSize: '20px'
                        }}
                      ></i>
                    )}
                    <i 
                      className='bx bx-search' 
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#999',
                        pointerEvents: 'none'
                      }}
                    ></i>
                  </div>
                  {showProductDropdown && !editingOffer && (
                    <div 
                      className="product-dropdown"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginTop: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 1000
                      }}
                    >
                      {getFilteredProducts().length > 0 ? (
                        getFilteredProducts().map(product => (
                          <div
                            key={product.id}
                            className="product-dropdown-item"
                            onClick={() => handleProductSelect(product)}
                            style={{
                              padding: '10px 12px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f0f0f0',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <span>{product.name}</span>
                            <small style={{ color: '#666', marginLeft: '8px' }}>
                              ₹{product.price}
                            </small>
                          </div>
                        ))
                      ) : (
                        <div 
                          className="product-dropdown-item" 
                          style={{ 
                            padding: '10px 12px',
                            color: '#999',
                            textAlign: 'center'
                          }}
                        >
                          No products found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {editingOffer && (
                  <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                    Product cannot be changed when editing
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Offer Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Weekend Sale, Limited Time Offer"
                  required
                  minLength="3"
                  maxLength="200"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Percentage *</label>
                  <input
                    type="number"
                    name="discount_percent"
                    value={formData.discount_percent}
                    onChange={handleChange}
                    required
                    min="1"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Max Uses (Optional)</label>
                  <input
                    type="number"
                    name="max_uses"
                    value={formData.max_uses}
                    onChange={handleChange}
                    min="1"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Expires At *</label>
                <input
                  type="datetime-local"
                  name="expires_at"
                  value={formData.expires_at}
                  onChange={handleChange}
                  required
                />
              </div>

              {editingOffer && (
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />
                    <span>Active</span>
                  </label>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Message */}
      {popupMessage && (
        <div className="admin-popup-message">
          {popupMessage}
        </div>
      )}
    </>
  );
}

export default AdminOffers;
