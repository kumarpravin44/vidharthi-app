import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { adminService } from "../../services/adminService";
import Loader from "../../components/Loader";
import "boxicons/css/boxicons.min.css";
import "../../tier-styles.css";

function AdminSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("store");
  const [settings, setSettings] = useState({
    store_name: "",
    store_phone: "",
    store_email: "",
    store_address: "",
    daily_order_limit: null,
    order_limit_enabled: false,
    order_limit_message: "",
    delivery_charge_single: 10,
    delivery_charge_multiple: 15,
    delivery_charge_tiers: [],
    veg_order_start_hour: 5,
    veg_order_end_hour: 9,
    veg_order_enabled: true,
    maintenance_mode: false,
    maintenance_message: "",
  });
  const [orderStats, setOrderStats] = useState({
    today_orders_count: 0,
    daily_order_limit: null,
    order_limit_enabled: false,
    limit_reached: false,
  });
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [tierForm, setTierForm] = useState({ min_price: "", max_price: "", delivery_charge: "" });
  const [editingTierIndex, setEditingTierIndex] = useState(null);

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
      const [settingsData, statsData] = await Promise.all([
        adminService.getSettings(),
        adminService.getTodayOrdersCount(),
      ]);
      setSettings({
        ...settingsData,
        store_phone: settingsData.store_phone || "",
        store_email: settingsData.store_email || "",
        store_address: settingsData.store_address || "",
        delivery_charge_tiers: settingsData.delivery_charge_tiers || [],
      });
      setOrderStats(statsData);
    } catch (error) {
      showPopup("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...settings };
      // Clean up numeric values
      if (payload.daily_order_limit === "" || payload.daily_order_limit === null) {
        payload.daily_order_limit = null;
      } else {
        payload.daily_order_limit = parseInt(payload.daily_order_limit);
      }
      payload.delivery_charge_single = parseFloat(payload.delivery_charge_single) || 0;
      payload.delivery_charge_multiple = parseFloat(payload.delivery_charge_multiple) || 0;
      payload.veg_order_start_hour = parseInt(payload.veg_order_start_hour) || 0;
      payload.veg_order_end_hour = parseInt(payload.veg_order_end_hour) || 0;
      // Send empty strings as null
      if (!payload.store_phone) payload.store_phone = null;
      if (!payload.store_email) payload.store_email = null;
      if (!payload.store_address) payload.store_address = null;
      // Send empty tier array as null
      if (!payload.delivery_charge_tiers || payload.delivery_charge_tiers.length === 0) {
        payload.delivery_charge_tiers = null;
      }

      const updated = await adminService.updateSettings(payload);
      setSettings({
        ...updated,
        store_phone: updated.store_phone || "",
        store_email: updated.store_email || "",
        store_address: updated.store_address || "",
        delivery_charge_tiers: updated.delivery_charge_tiers || [],
      });
      const statsData = await adminService.getTodayOrdersCount();
      setOrderStats(statsData);
      showPopup("Settings saved successfully!");
    } catch (error) {
      showPopup(error.message || "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addOrUpdateTier = () => {
    const minPrice = parseFloat(tierForm.min_price);
    const maxPrice = tierForm.max_price ? parseFloat(tierForm.max_price) : null;
    const charge = parseFloat(tierForm.delivery_charge);

    if (isNaN(minPrice) || isNaN(charge) || (tierForm.max_price && isNaN(maxPrice))) {
      showPopup("Please enter valid numbers", "error");
      return;
    }

    if (maxPrice !== null && maxPrice < minPrice) {
      showPopup("Max price must be greater than min price", "error");
      return;
    }

    const newTier = { min_price: minPrice, max_price: maxPrice, delivery_charge: charge };
    const updatedTiers = [...(settings.delivery_charge_tiers || [])];

    if (editingTierIndex !== null) {
      updatedTiers[editingTierIndex] = newTier;
      setEditingTierIndex(null);
      showPopup("Tier updated successfully!");
    } else {
      updatedTiers.push(newTier);
      showPopup("Tier added successfully!");
    }

    // Sort by min_price
    updatedTiers.sort((a, b) => a.min_price - b.min_price);
    setSettings(prev => ({ ...prev, delivery_charge_tiers: updatedTiers }));
    setTierForm({ min_price: "", max_price: "", delivery_charge: "" });
  };

  const editTier = (index) => {
    const tier = settings.delivery_charge_tiers[index];
    setTierForm({
      min_price: tier.min_price.toString(),
      max_price: tier.max_price ? tier.max_price.toString() : "",
      delivery_charge: tier.delivery_charge.toString(),
    });
    setEditingTierIndex(index);
  };

  const deleteTier = (index) => {
    const updatedTiers = settings.delivery_charge_tiers.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, delivery_charge_tiers: updatedTiers }));
    setEditingTierIndex(null);
    setTierForm({ min_price: "", max_price: "", delivery_charge: "" });
    showPopup("Tier deleted successfully!");
  };

  const tabs = [
    { id: "store", icon: "bx-store", label: "Store Info" },
    { id: "orders", icon: "bx-cart", label: "Order Limits" },
    { id: "delivery", icon: "bx-car", label: "Delivery Charges" },
    { id: "vegtime", icon: "bx-time-five", label: "Vegetable Orders" },
    { id: "maintenance", icon: "bx-wrench", label: "Maintenance" },
  ];

  if (loading) {
    return <Loader text="Loading settings..." />;
  }

  return (
    <>
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-page-header">
          <h1><i className='bx bx-cog'></i> Settings</h1>
          <p>Manage your store configuration</p>
        </div>

        <div className="settings-layout">
          {/* Sidebar Tabs */}
          <div className="settings-sidebar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={`bx ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="settings-content">
            {/* ── Store Info Tab ──────────────────────────────── */}
            {activeTab === "store" && (
              <div className="settings-section">
                <div className="section-header">
                  <i className='bx bx-store'></i>
                  <div>
                    <h2>Store Information</h2>
                    <p>Basic details about your store</p>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Store Name</label>
                    <input type="text" value={settings.store_name}
                      onChange={e => updateField("store_name", e.target.value)}
                      placeholder="Your Store Name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" value={settings.store_phone}
                      onChange={e => updateField("store_phone", e.target.value)}
                      placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={settings.store_email}
                      onChange={e => updateField("store_email", e.target.value)}
                      placeholder="store@example.com" />
                  </div>
                  <div className="form-group full-width">
                    <label>Store Address</label>
                    <textarea value={settings.store_address}
                      onChange={e => updateField("store_address", e.target.value)}
                      placeholder="Full store address..."
                      rows="3" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Order Limits Tab ────────────────────────────── */}
            {activeTab === "orders" && (
              <div className="settings-section">
                <div className="section-header">
                  <i className='bx bx-cart'></i>
                  <div>
                    <h2>Daily Order Limit</h2>
                    <p>Control the maximum number of orders per day</p>
                  </div>
                </div>

                {/* Live Stats */}
                <div className="stats-banner">
                  <div className="stat-pill">
                    <span className="stat-pill-label">Today</span>
                    <span className="stat-pill-value">{orderStats.today_orders_count}</span>
                  </div>
                  <div className="stat-pill">
                    <span className="stat-pill-label">Limit</span>
                    <span className="stat-pill-value">
                      {orderStats.daily_order_limit ?? "∞"}
                    </span>
                  </div>
                  <div className={`stat-pill ${orderStats.limit_reached ? "danger" : "success"}`}>
                    <span className="stat-pill-label">Status</span>
                    <span className="stat-pill-value">
                      {orderStats.order_limit_enabled
                        ? orderStats.limit_reached ? "FULL" : "OK"
                        : "OFF"}
                    </span>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Enable Order Limit</label>
                    <div className="toggle-row">
                      <button className={`toggle-btn ${!settings.order_limit_enabled ? "active off" : ""}`}
                        onClick={() => updateField("order_limit_enabled", false)}>
                        <i className='bx bx-x'></i> Off
                      </button>
                      <button className={`toggle-btn ${settings.order_limit_enabled ? "active on" : ""}`}
                        onClick={() => updateField("order_limit_enabled", true)}>
                        <i className='bx bx-check'></i> On
                      </button>
                    </div>
                  </div>
                  <div className={`form-group ${!settings.order_limit_enabled ? "disabled" : ""}`}>
                    <label>Max Orders Per Day</label>
                    <input type="number" min="1"
                      value={settings.daily_order_limit ?? ""}
                      onChange={e => updateField("daily_order_limit", e.target.value)}
                      disabled={!settings.order_limit_enabled}
                      placeholder="e.g. 50" />
                  </div>
                  <div className="form-group full-width">
                    <label>Limit Reached Message</label>
                    <textarea value={settings.order_limit_message}
                      onChange={e => updateField("order_limit_message", e.target.value)}
                      placeholder="Message shown to customers when limit is reached"
                      rows="3" maxLength="500" />
                    <span className="char-counter">{settings.order_limit_message.length}/500</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Delivery Charges Tab ────────────────────────── */}
            {activeTab === "delivery" && (
              <div className="settings-section">
                <div className="section-header">
                  <i className='bx bx-car'></i>
                  <div>
                    <h2>Delivery Charges by Order Amount</h2>
                    <p>Set delivery charges based on order value</p>
                  </div>
                </div>

                {/* Add/Edit Tier Form */}
                <div className="tier-form-section">
                  <h3>{editingTierIndex !== null ? "Edit Tier" : "Add New Tier"}</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Min Price (₹)</label>
                      <input type="number" min="0" step="0.01"
                        value={tierForm.min_price}
                        onChange={e => setTierForm({...tierForm, min_price: e.target.value})}
                        placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label>Max Price (₹)</label>
                      <input type="number" min="0" step="0.01"
                        value={tierForm.max_price}
                        onChange={e => setTierForm({...tierForm, max_price: e.target.value})}
                        placeholder="Leave empty for unlimited" />
                    </div>
                    <div className="form-group">
                      <label>Delivery Charge (₹)</label>
                      <input type="number" min="0" step="0.01"
                        value={tierForm.delivery_charge}
                        onChange={e => setTierForm({...tierForm, delivery_charge: e.target.value})}
                        placeholder="0" />
                    </div>
                    <div className="form-group">
                      <button className="btn-primary" onClick={addOrUpdateTier}>
                        {editingTierIndex !== null ? "Update" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Existing Tiers Table */}
                {settings.delivery_charge_tiers && settings.delivery_charge_tiers.length > 0 ? (
                  <div className="tier-table-section">
                    <h3>Delivery Charge</h3>
                    <table className="tier-table">
                      <thead>
                        <tr>
                          <th>Min Price</th>
                          <th>Max Price</th>
                          <th>Delivery Charge</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {settings.delivery_charge_tiers.map((tier, index) => (
                          <tr key={index}>
                            <td>₹{tier.min_price.toFixed(2)}</td>
                            <td>{tier.max_price ? `₹${tier.max_price.toFixed(2)}` : "∞"}</td>
                            <td>{tier.delivery_charge === 0 ? "FREE" : `₹${tier.delivery_charge.toFixed(2)}`}</td>
                            <td className="action-buttons">
                              <button className="btn-edit" onClick={() => editTier(index)}>
                                <i className='bx bx-edit'></i> Edit
                              </button>
                              <button className="btn-delete" onClick={() => deleteTier(index)}>
                                <i className='bx bx-trash'></i> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className='bx bx-inbox'></i>
                    <p>No delivery charge tiers configured yet. Add one to get started.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Vegetable Orders Tab ─────────────────────────── */}
            {activeTab === "vegtime" && (
              <div className="settings-section">
                <div className="section-header">
                  <i className='bx bx-time-five'></i>
                  <div>
                    <h2>Vegetable Order Window</h2>
                    <p>Control when vegetable orders are accepted</p>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Enable Time Restriction</label>
                    <div className="toggle-row">
                      <button className={`toggle-btn ${!settings.veg_order_enabled ? "active off" : ""}`}
                        onClick={() => updateField("veg_order_enabled", false)}>
                        <i className='bx bx-x'></i> Off (Accept Anytime)
                      </button>
                      <button className={`toggle-btn ${settings.veg_order_enabled ? "active on" : ""}`}
                        onClick={() => updateField("veg_order_enabled", true)}>
                        <i className='bx bx-check'></i> On (Time Window)
                      </button>
                    </div>
                  </div>
                  <div className={`form-group ${!settings.veg_order_enabled ? "disabled" : ""}`}>
                    <label>Start Hour</label>
                    <input type="number" min="0" max="23"
                      value={settings.veg_order_start_hour}
                      onChange={e => updateField("veg_order_start_hour", e.target.value)}
                      disabled={!settings.veg_order_enabled} />
                    <span className="form-hint">Orders open at this hour</span>
                  </div>
                  <div className={`form-group ${!settings.veg_order_enabled ? "disabled" : ""}`}>
                    <label>End Hour</label>
                    <input type="number" min="0" max="23"
                      value={settings.veg_order_end_hour}
                      onChange={e => updateField("veg_order_end_hour", e.target.value)}
                      disabled={!settings.veg_order_enabled} />
                    <span className="form-hint">Orders close at this hour</span>
                  </div>
                </div>
                {settings.veg_order_enabled && (
                  <div className="info-banner">
                    <i className='bx bx-info-circle'></i>
                    Vegetable orders will only be accepted between <strong>{settings.veg_order_start_hour}:00 AM</strong> and <strong>{settings.veg_order_end_hour}:00 AM</strong>.
                  </div>
                )}
              </div>
            )}

            {/* ── Maintenance Mode Tab ─────────────────────────── */}
            {activeTab === "maintenance" && (
              <div className="settings-section">
                <div className="section-header">
                  <i className='bx bx-wrench'></i>
                  <div>
                    <h2>Maintenance Mode</h2>
                    <p>Temporarily disable ordering for all users</p>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Maintenance Mode</label>
                    <div className="toggle-row">
                      <button className={`toggle-btn ${!settings.maintenance_mode ? "active on" : ""}`}
                        onClick={() => updateField("maintenance_mode", false)}>
                        <i className='bx bx-check'></i> Store Open
                      </button>
                      <button className={`toggle-btn ${settings.maintenance_mode ? "active danger" : ""}`}
                        onClick={() => updateField("maintenance_mode", true)}>
                        <i className='bx bx-error'></i> Under Maintenance
                      </button>
                    </div>
                  </div>
                  {settings.maintenance_mode && (
                    <div className="form-group full-width">
                      <div className="warning-banner">
                        <i className='bx bx-error-circle'></i>
                        <strong>Store is currently in maintenance mode!</strong> No new orders can be placed.
                      </div>
                    </div>
                  )}
                  <div className="form-group full-width">
                    <label>Maintenance Message</label>
                    <textarea value={settings.maintenance_message}
                      onChange={e => updateField("maintenance_message", e.target.value)}
                      placeholder="Message shown to customers during maintenance"
                      rows="3" maxLength="500" />
                    <span className="char-counter">{settings.maintenance_message.length}/500</span>
                  </div>
                </div>
              </div>
            )}

            {/* Save Bar */}
            <div className="save-bar">
              <button className="btn-reset" onClick={loadData} disabled={saving}>
                <i className='bx bx-revision'></i> Reset
              </button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? <><i className='bx bx-loader-alt bx-spin'></i> Saving...</> : <><i className='bx bx-save'></i> Save Settings</>}
              </button>
            </div>
          </div>
        </div>

        {popupMessage && (
          <div className={`popup-msg ${popupType}`}>
            <i className={`bx ${popupType === "success" ? "bx-check-circle" : "bx-error-circle"}`}></i>
            {popupMessage}
          </div>
        )}
      </div>

      <style>{`
        .settings-layout {
          display: flex;
          gap: 24px;
          min-height: 500px;
        }
        .settings-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,.08);
          padding: 8px;
          height: fit-content;
          position: sticky;
          top: 80px;
        }
        .settings-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          border-radius: 6px;
          font-size: 14px;
          color: #555;
          cursor: pointer;
          text-align: left;
          transition: all .2s;
        }
        .settings-tab:hover { background: #f5f5f5; }
        .settings-tab.active {
          background: #e8f5e9;
          color: #2e7d32;
          font-weight: 600;
        }
        .settings-tab i { font-size: 20px; }

        .settings-content {
          flex: 1;
          min-width: 0;
        }
        .settings-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,.08);
          padding: 28px;
        }
        .section-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }
        .section-header > i {
          font-size: 28px;
          color: #4caf50;
          background: #e8f5e9;
          border-radius: 8px;
          padding: 10px;
        }
        .section-header h2 { margin: 0 0 4px; font-size: 20px; color: #333; }
        .section-header p { margin: 0; font-size: 14px; color: #888; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-group label {
          display: block;
          font-weight: 600;
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border .2s;
          box-sizing: border-box;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #4caf50;
        }
        .form-group.disabled { opacity: .45; pointer-events: none; }
        .form-hint {
          display: block;
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
        .char-counter {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #bbb;
          margin-top: 4px;
        }

        .toggle-row { display: flex; gap: 10px; }
        .toggle-btn {
          flex: 1;
          padding: 10px 18px;
          border: 2px solid #ddd;
          background: #fafafa;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all .2s;
        }
        .toggle-btn:hover { border-color: #bbb; }
        .toggle-btn.active.on {
          border-color: #4caf50;
          background: #e8f5e9;
          color: #2e7d32;
        }
        .toggle-btn.active.off {
          border-color: #999;
          background: #f5f5f5;
          color: #555;
        }
        .toggle-btn.active.danger {
          border-color: #f44336;
          background: #ffebee;
          color: #c62828;
        }

        .stats-banner {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .stat-pill {
          flex: 1;
          text-align: center;
          padding: 14px;
          background: #f9f9f9;
          border-radius: 8px;
          border: 1px solid #eee;
        }
        .stat-pill.success { border-color: #c8e6c9; background: #e8f5e9; }
        .stat-pill.danger  { border-color: #ffcdd2; background: #ffebee; }
        .stat-pill-label { display: block; font-size: 12px; color: #999; margin-bottom: 4px; }
        .stat-pill-value { display: block; font-size: 22px; font-weight: 700; color: #333; }
        .stat-pill.success .stat-pill-value { color: #2e7d32; }
        .stat-pill.danger  .stat-pill-value { color: #c62828; }

        .info-banner {
          margin-top: 20px;
          padding: 14px 18px;
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          border-radius: 4px;
          font-size: 14px;
          color: #1565c0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .warning-banner {
          padding: 14px 18px;
          background: #fff3e0;
          border-left: 4px solid #ff9800;
          border-radius: 4px;
          font-size: 14px;
          color: #e65100;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .save-bar {
          margin-top: 24px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .btn-reset, .btn-save {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all .2s;
        }
        .btn-reset {
          background: white;
          color: #666;
          border: 1px solid #ddd;
        }
        .btn-reset:hover:not(:disabled) { background: #f5f5f5; }
        .btn-save {
          background: #4caf50;
          color: white;
          min-width: 160px;
          justify-content: center;
        }
        .btn-save:hover:not(:disabled) { background: #43a047; }
        .btn-save:disabled, .btn-reset:disabled { opacity: .6; cursor: not-allowed; }

        .popup-msg {
          position: fixed;
          top: 80px;
          right: 20px;
          padding: 14px 22px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,.2);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          z-index: 1000;
          animation: slideIn .3s ease-out;
        }
        .popup-msg.success { background: #4caf50; color: white; }
        .popup-msg.error { background: #f44336; color: white; }
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }

        @media (max-width: 768px) {
          .settings-layout { flex-direction: column; }
          .settings-sidebar {
            width: 100%;
            display: flex;
            overflow-x: auto;
            position: static;
            gap: 4px;
          }
          .settings-tab { white-space: nowrap; min-width: fit-content; }
          .settings-tab span { display: none; }
          .settings-tab i { font-size: 22px; }
          .form-grid { grid-template-columns: 1fr; }
          .toggle-row { flex-direction: column; }
          .stats-banner { flex-direction: column; }
        }
      `}</style>
    </>
  );
}

export default AdminSettings;
