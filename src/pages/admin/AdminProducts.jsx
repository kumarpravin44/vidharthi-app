import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import ImageUpload from "../../components/ImageUpload";
import { adminService } from "../../services/adminService";
import "boxicons/css/boxicons.min.css";
import Loader from "../../components/Loader";

import saltImg from "../../images/product/salt.webp";

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    stock: "",
    category_id: "",
    image_url: "",
  });

  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      showPopup("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      mrp: "",
      stock: "",
      category_id: "",
      image_url: "",
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      mrp: product.mrp || "",
      stock: product.stock || 0,
      category_id: product.category_id,
      image_url: product.image_url || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await adminService.deleteProduct(id);
      showPopup("Product deleted successfully");
      loadData();
    } catch (error) {
      showPopup("Failed to delete product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Form submission started');
      console.log('Editing product:', editingProduct);
      console.log('Form data:', formData);
      
      const price = parseFloat(formData.price);
      const mrp = formData.mrp ? parseFloat(formData.mrp) : null;
      
      // Validate MRP
      if (mrp !== null && mrp < price) {
        showPopup(`MRP (₹${mrp}) cannot be less than selling price (₹${price})`);
        return;
      }
      
      // Send mrp as well (from mrp field)
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: price,
        mrp: mrp,
        stock: parseInt(formData.stock),
        category_id: formData.category_id,
        image_url: formData.image_url || null,
      };
      
      console.log('Cleaned product data:', productData);
      
      if (editingProduct) {
        console.log('Updating product with ID:', editingProduct.id);
        const result = await adminService.updateProduct(editingProduct.id, productData);
        console.log('Update result:', result);
        showPopup("Product updated successfully");
      } else {
        console.log('Creating new product');
        const result = await adminService.createProduct(productData);
        console.log('Create result:', result);
        showPopup("Product created successfully");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      showPopup(`Failed to save product: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(p => p.category_id === filterCategory);
    }

    // Filter by stock status
    if (filterStock === 'in-stock') {
      filtered = filtered.filter(p => p.stock > 0);
    } else if (filterStock === 'out-of-stock') {
      filtered = filtered.filter(p => p.stock === 0 || !p.stock);
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle special cases
        if (sortConfig.key === 'category') {
          aVal = a.category?.name || '';
          bVal = b.category?.name || '';
        }

        if (sortConfig.key === 'stock') {
          aVal = a.stock || 0;
          bVal = b.stock || 0;
        }

        // Handle string comparison
        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        // Handle number comparison
        return sortConfig.direction === 'asc' 
          ? aVal - bVal
          : bVal - aVal;
      });
    }

    return filtered;
  }, [products, filterCategory, filterStock, sortConfig]);

  if (loading) {
    return <Loader text="Loading products..." />;
  }

  return (
    <>
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Products Management</h1>
            <p>Manage your product catalog</p>
          </div>
          <button className="admin-primary-btn" onClick={handleAdd}>
            <i className='bx bx-plus'></i>
            Add Product
          </button>
        </div>

        {/* Filter Bar */}
        <div className="admin-filter-bar">
          <div className="filter-group">
            <label>Category</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Stock Status</label>
            <select 
              value={filterStock} 
              onChange={(e) => setFilterStock(e.target.value)}
              className="filter-select"
            >
              <option value="">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div className="filter-group" style={{ marginLeft: 'auto' }}>
            <label>Results</label>
            <div className="result-count">{filteredAndSortedProducts.length} products</div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th className="sortable" onClick={() => handleSort('name')}>
                  Name
                  {sortConfig.key === 'name' && (
                    <i className={`bx bx-${sortConfig.direction === 'asc' ? 'up' : 'down'}-arrow-alt`}></i>
                  )}
                </th>
                <th className="sortable" onClick={() => handleSort('category')}>
                  Category
                  {sortConfig.key === 'category' && (
                    <i className={`bx bx-${sortConfig.direction === 'asc' ? 'up' : 'down'}-arrow-alt`}></i>
                  )}
                </th>
                <th className="sortable" onClick={() => handleSort('price')}>
                  Price
                  {sortConfig.key === 'price' && (
                    <i className={`bx bx-${sortConfig.direction === 'asc' ? 'up' : 'down'}-arrow-alt`}></i>
                  )}
                </th>
                <th>MRP</th>
                <th className="sortable" onClick={() => handleSort('stock')}>
                  Stock
                  {sortConfig.key === 'stock' && (
                    <i className={`bx bx-${sortConfig.direction === 'asc' ? 'up' : 'down'}-arrow-alt`}></i>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    {products.length === 0 ? 'No products found' : 'No products match the filters'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image_url || saltImg}
                        alt={product.name}
                        className="product-thumb"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category?.name || 'N/A'}</td>
                    <td>₹{product.price}</td>
                    <td>{product.mrp ? `₹${product.mrp}` : '-'}</td>
                    <td>
                      <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(product)}
                          title="Edit"
                        >
                          <i className='bx bx-edit'></i>
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product.id)}
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

      {/* Product Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)}>
                <i className='bx bx-x'></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>MRP</label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ImageUpload
                type="product"
                currentImage={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url || "" })}
                label="Product Image"
              />

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {popupMessage && (
        <div className="admin-popup">
          <div className="admin-popup-content">
            <i className='bx bx-check-circle'></i>
            <span>{popupMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminProducts;
