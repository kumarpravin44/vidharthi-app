import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import ImageUpload from "../../components/ImageUpload";
import { adminService } from "../../services/adminService";
import Loader from "../../components/Loader";
import "boxicons/css/boxicons.min.css";

function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [expandedParents, setExpandedParents] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    name_hi: "",
    slug: "",
    description: "",
    description_hi: "",
    image_url: "",
    parent_id: "",
    sort_order: 0,
    show_in_nav: false,
    show_on_top: false,
  });

  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    loadCategories();
  }, [navigate]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      showPopup("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Top-level categories only (for parent dropdown)
  const parentOptions = categories.filter((c) => !c.parent_id);

  const handleAdd = (parentId = null) => {
    setEditingCategory(null);
    setFormData({
      name: "",
      name_hi: "",
      slug: "",
      description: "",
      description_hi: "",
      image_url: "",
      parent_id: parentId || "",
      sort_order: 0,
      show_in_nav: false,
      show_on_top: false,
    });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_hi: category.name_hi || "",
      slug: category.slug,
      description: category.description || "",
      description_hi: category.description_hi || "",
      image_url: category.image_url || "",
      parent_id: category.parent_id || "",
      sort_order: category.sort_order ?? 0,
      show_in_nav: category.show_in_nav ?? false,
      show_on_top: category.show_on_top ?? false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Products inside will not be deleted but may become uncategorized.")) return;
    try {
      await adminService.deleteCategory(id);
      showPopup("Category deleted");
      loadCategories();
    } catch {
      showPopup("Failed to delete category");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleCategoryStatus(id);
      showPopup("Category status updated");
      loadCategories();
    } catch {
      showPopup("Failed to update status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      name_hi: formData.name_hi || "",
      slug: formData.slug,
      description: formData.description || null,
      description_hi: formData.description_hi || "",
      image_url: formData.image_url || null,
      parent_id: formData.parent_id || null,
      sort_order: Number(formData.sort_order) || 0,
      show_in_nav: formData.show_in_nav,
      show_on_top: formData.show_on_top,
    };
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, payload);
        showPopup("Category updated");
      } else {
        await adminService.createCategory(payload);
        showPopup("Category created");
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      showPopup(err.message || "Failed to save category");
    }
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const newVal = inputType === "checkbox" ? checked : value;
    setFormData((prev) => {
      const updated = { ...prev, [name]: newVal };
      if (name === "name" && !editingCategory) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      return updated;
    });
  };

  const toggleExpand = (id) => {
    setExpandedParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <Loader text="Loading categories..." />;
  }

  // Separate parent categories and their children
  const topLevel = categories.filter((c) => !c.parent_id);

  return (
    <>
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Categories</h1>
            <p>Manage parent categories and sub-categories</p>
          </div>
          <button className="admin-primary-btn" onClick={() => handleAdd()}>
            <i className="bx bx-plus"></i> Add Category
          </button>
        </div>

        {topLevel.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px" }}>No categories yet. Click "Add Category" to create one.</p>
        ) : (
          <div className="cat-tree">
            {topLevel.map((parent) => {
              const subs = (parent.children || []);
              const isExpanded = expandedParents[parent.id] !== false; // default expanded
              return (
                <div className="cat-parent-block" key={parent.id}>
                  {/* Parent row */}
                  <div className={`cat-row cat-parent-row ${!parent.is_active ? "cat-inactive" : ""}`}>
                    <div className="cat-row-left">
                      {subs.length > 0 && (
                        <button className="cat-expand-btn" onClick={() => toggleExpand(parent.id)}>
                          <i className={`bx ${isExpanded ? "bx-chevron-down" : "bx-chevron-right"}`}></i>
                        </button>
                      )}
                      {parent.image_url ? (
                        <img src={parent.image_url} alt={parent.name} className="cat-thumb" />
                      ) : (
                        <div className="cat-thumb-placeholder"><i className="bx bx-category"></i></div>
                      )}
                      <div>
                        <span className="cat-name">{parent.name}</span>
                        {parent.show_in_nav && <span className="cat-nav-badge">Nav</span>}
                        {parent.show_on_top && <span className="cat-top-badge">Top</span>}
                        {!parent.is_active && <span className="cat-disabled-badge">Disabled</span>}
                        <p className="cat-slug">/{parent.slug}</p>
                      </div>
                    </div>
                    <div className="cat-row-actions">
                      <button className="cat-action-btn" title="Add subcategory" onClick={() => handleAdd(parent.id)}>
                        <i className="bx bx-subdirectory-right"></i>
                      </button>
                      <button
                        className={`cat-action-btn ${parent.is_active ? "cat-btn-disable" : "cat-btn-enable"}`}
                        title={parent.is_active ? "Disable" : "Enable"}
                        onClick={() => handleToggleStatus(parent.id)}
                      >
                        <i className={`bx ${parent.is_active ? "bx-block" : "bx-check-circle"}`}></i>
                      </button>
                      <button className="cat-action-btn cat-btn-edit" title="Edit" onClick={() => handleEdit(parent)}>
                        <i className="bx bx-edit"></i>
                      </button>
                      <button className="cat-action-btn cat-btn-delete" title="Delete" onClick={() => handleDelete(parent.id)}>
                        <i className="bx bx-trash"></i>
                      </button>
                    </div>
                  </div>

                  {/* Sub-category rows */}
                  {isExpanded && subs.map((sub) => (
                    <div className={`cat-row cat-sub-row ${!sub.is_active ? "cat-inactive" : ""}`} key={sub.id}>
                      <div className="cat-row-left">
                        <span className="cat-sub-indent"><i className="bx bx-subdirectory-right"></i></span>
                        {sub.image_url ? (
                          <img src={sub.image_url} alt={sub.name} className="cat-thumb cat-thumb-sm" />
                        ) : (
                          <div className="cat-thumb-placeholder cat-thumb-sm"><i className="bx bx-tag"></i></div>
                        )}
                        <div>
                          <span className="cat-name">{sub.name}</span>
                          {!sub.is_active && <span className="cat-disabled-badge">Disabled</span>}
                          <p className="cat-slug">/{sub.slug}</p>
                        </div>
                      </div>
                      <div className="cat-row-actions">
                        <button
                          className={`cat-action-btn ${sub.is_active ? "cat-btn-disable" : "cat-btn-enable"}`}
                          title={sub.is_active ? "Disable" : "Enable"}
                          onClick={() => handleToggleStatus(sub.id)}
                        >
                          <i className={`bx ${sub.is_active ? "bx-block" : "bx-check-circle"}`}></i>
                        </button>
                        <button className="cat-action-btn cat-btn-edit" title="Edit" onClick={() => handleEdit(sub)}>
                          <i className="bx bx-edit"></i>
                        </button>
                        <button className="cat-action-btn cat-btn-delete" title="Delete" onClick={() => handleDelete(sub.id)}>
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingCategory ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setShowModal(false)}><i className="bx bx-x"></i></button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">

              {/* Parent Category */}
              <div className="form-group">
                <label>Parent Category</label>
                <select name="parent_id" value={formData.parent_id} onChange={handleChange}>
                  <option value="">— Top-level (no parent) —</option>
                  {parentOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <small style={{ color: "#666", fontSize: "12px" }}>
                  Leave empty to create a parent category
                </small>
              </div>

              <div className="form-group">
                <label>Category Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Vegetables, Fruits, Dairy" />
              </div>

              <div className="form-group">
                <label>Hindi Name (हिन्दी नाम)</label>
                <input type="text" name="name_hi" value={formData.name_hi} onChange={handleChange} placeholder="श्रेणी का नाम हिन्दी में" />
              </div>

              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  pattern="^[a-z0-9-]+$"
                  placeholder="auto-generated"
                  title="Only lowercase letters, numbers, and hyphens"
                />
                <small style={{ color: "#666", fontSize: "12px" }}>Auto-generated from name</small>
              </div>

              <div className="form-group">
                <label>Sort Order</label>
                <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} min="0" placeholder="0" />
                <small style={{ color: "#666", fontSize: "12px" }}>Lower number = shown first</small>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Brief description" />
              </div>

              <div className="form-group">
                <label>Hindi Description (हिन्दी विवरण)</label>
                <textarea name="description_hi" value={formData.description_hi} onChange={handleChange} rows="2" placeholder="श्रेणी का विवरण हिन्दी में" />
              </div>

              <ImageUpload
                type="category"
                currentImage={formData.image_url}
                onImageUploaded={(url) => setFormData((prev) => ({ ...prev, image_url: url || "" }))}
                label="Category Image"
              />

              {/* Show in Nav toggle */}
              <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="show_in_nav"
                  name="show_in_nav"
                  checked={formData.show_in_nav}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px" }}
                />
                <label htmlFor="show_in_nav" style={{ margin: 0, cursor: "pointer" }}>
                  Show in bottom navigation bar
                </label>
              </div>

              {/* Show on Top toggle */}
              <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="show_on_top"
                  name="show_on_top"
                  checked={formData.show_on_top}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px" }}
                />
                <label htmlFor="show_on_top" style={{ margin: 0, cursor: "pointer" }}>
                  Show on top of categories list
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {popupMessage && (
        <div className="admin-popup">
          <div className="admin-popup-content">
            <i className="bx bx-check-circle"></i>
            <span>{popupMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminCategories;
