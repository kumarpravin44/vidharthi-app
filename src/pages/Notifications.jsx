import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import "boxicons/css/boxicons.min.css";

const NOTIFICATION_CONFIG = {
  order: { icon: "bx bx-package", color: "#4CAF50", bg: "#e8f5e9" },
  delivery: { icon: "bx bx-truck", color: "#2196F3", bg: "#e3f2fd" },
  offer: { icon: "bx bxs-offer", color: "#FF9800", bg: "#fff3e0" },
  promo: { icon: "bx bxs-discount", color: "#E91E63", bg: "#fce4ec" },
  payment: { icon: "bx bx-wallet", color: "#9C27B0", bg: "#f3e5f5" },
  refund: { icon: "bx bx-transfer-alt", color: "#00BCD4", bg: "#e0f7fa" },
  account: { icon: "bx bx-user-check", color: "#607D8B", bg: "#eceff1" },
  default: { icon: "bx bx-bell", color: "#ff7a00", bg: "#ffe8d6" },
};

function getNotifConfig(type) {
  if (!type) return NOTIFICATION_CONFIG.default;
  const key = type.toLowerCase();
  for (const k of Object.keys(NOTIFICATION_CONFIG)) {
    if (key.includes(k)) return NOTIFICATION_CONFIG[k];
  }
  return NOTIFICATION_CONFIG.default;
}

function Notifications() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, [isAuthenticated, navigate, fetchNotifications]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const groups = { Today: [], Yesterday: [], Earlier: [] };

    notifications.forEach((n) => {
      const date = new Date(n.created_at);
      if (date >= todayStart) groups.Today.push(n);
      else if (date >= yesterdayStart) groups.Yesterday.push(n);
      else groups.Earlier.push(n);
    });

    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [notifications]);

  const handleNotifClick = (notif) => {
    if (!notif.is_read) markAsRead(notif.id);
    // Navigate to relevant page based on notification type
    const type = (notif.type || "").toLowerCase();
    if (type.includes("order") && notif.reference_id) {
      navigate(`/order/${notif.reference_id}`);
    }
  };

  return (
    <>
      <InternalHeader title="Notifications" />

      <div className="content">
        {/* Header bar with count & mark all read */}
        {notifications.length > 0 && (
          <div className="notif-header-bar">
            <span className="notif-count">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : `${notifications.length} notifications`}
            </span>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllRead}>
                <i className="bx bx-check-double"></i> Mark all read
              </button>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="notif-empty">
            <div className="notif-loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <div className="notif-empty">
            <div className="notif-empty-icon-wrap">
              <i className="bx bx-bell-off notif-empty-icon"></i>
            </div>
            <h3 className="notif-empty-title">No Notifications</h3>
            <p className="notif-empty-subtitle">
              You're all caught up! We'll notify you when there's something new.
            </p>
          </div>
        )}

        {/* Grouped notification list */}
        {!loading && groupedNotifications.map(([group, items]) => (
          <div key={group} className="notif-group">
            <div className="notif-group-label">{group}</div>
            <div className="notif-list">
              {items.map((notif) => {
                const config = getNotifConfig(notif.type);
                return (
                  <div
                    key={notif.id}
                    className={`notif-item ${!notif.is_read ? "unread" : ""}`}
                    onClick={() => handleNotifClick(notif)}
                  >
                    <div
                      className="notif-icon-wrap"
                      style={{ background: config.bg }}
                    >
                      <i
                        className={`${config.icon} notif-icon`}
                        style={{ color: config.color }}
                      ></i>
                      {!notif.is_read && <span className="notif-dot"></span>}
                    </div>
                    <div className="notif-body">
                      <div className="notif-body-top">
                        <p className="notif-title">{notif.title}</p>
                        <span className="notif-time">{formatTime(notif.created_at)}</span>
                      </div>
                      <p className="notif-message">{notif.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </>
  );
}

export default Notifications;
