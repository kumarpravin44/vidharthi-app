import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { adminService } from "../../services/adminService";
import Loader from "../../components/Loader";
import { useLanguage } from "../../context/LanguageContext";
import "boxicons/css/boxicons.min.css";

function AdminUsers() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      showPopup(t("failed_load_users"));
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 2000);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      showPopup(`User ${currentStatus ? t("user_deactivated") : t("user_activated")} successfully`);
      loadUsers();
    } catch (error) {
      showPopup(t("failed_update_user_status"));
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loader text={t("loading_users")} />;
  }

  return (
    <>
      <AdminHeader />
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>{t("users_management")}</h1>
            <p>{t("manage_users_accounts")}</p>
          </div>
          <div className="search-box">
            <i className='bx bx-search'></i>
            <input
              type="text"
              placeholder={t("search_by_name_phone_email")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t("user_id")}</th>
                <th>{t("name")}</th>
                <th>{t("phone")}</th>
                <th>{t("email")}</th>
                <th>{t("joined_date")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    {searchTerm ? t("no_users_match_search") : t("no_users_found")}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td><strong>#{user.id}</strong></td>
                    <td>{user.full_name || 'N/A'}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.created_at ? formatDate(user.created_at) : 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${user.is_active ? 'green' : 'red'}`}>
                        {user.is_active ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td>
                      {!user.is_admin &&
                      <button
                        className={`toggle-btn ${user.is_active ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                      >
                        {user.is_active ? t("deactivate") : t("activate")}
                      </button>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>{t("total_users")} <strong>{filteredUsers.length}</strong></p>
          <p>{t("active_users")} <strong>{filteredUsers.filter(u => u.is_active).length}</strong></p>
        </div>
      </div>

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

export default AdminUsers;
