import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import "boxicons/css/boxicons.min.css";

function Notifications() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { notifications, loading, markAsRead, markAllRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, [isAuthenticated, navigate, fetchNotifications]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <>
      <InternalHeader title="Notifications" />

      <div className="content">
        {notifications.length > 0 && (
          <div className="notif-header-bar">
            <span className="notif-count">{notifications.length} notifications</span>
            <button className="mark-all-btn" onClick={markAllRead}>
              Mark all as read
            </button>
          </div>
        )}

        {loading && (
          <div className="notif-empty">
            <p>Loading...</p>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="notif-empty">
            <i className="bx bx-bell-off notif-empty-icon"></i>
            <p>No notifications yet</p>
          </div>
        )}

        <div className="notif-list">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notif-item ${!notif.is_read ? "unread" : ""}`}
              onClick={() => !notif.is_read && markAsRead(notif.id)}
            >
              <div className="notif-icon-wrap">
                <i className="bx bx-bell notif-icon"></i>
                {!notif.is_read && <span className="notif-dot"></span>}
              </div>
              <div className="notif-body">
                <p className="notif-title">{notif.title}</p>
                <p className="notif-message">{notif.message}</p>
                <span className="notif-time">{formatDate(notif.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </>
  );
}

export default Notifications;
