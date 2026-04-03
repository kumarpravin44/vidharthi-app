import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useLanguage } from "../context/LanguageContext";
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
  const { t } = useLanguage();

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
    if (diff < 60) return t("just_now");
    if (diff < 3600) return `${Math.floor(diff / 60)} ${t("min_ago")}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}${t("h_ago")}`;
    if (diff < 172800) return t("yesterday");
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const groups = { [t("today")]: [], [t("yesterday")]: [], [t("earlier")]: [] };

    notifications.forEach((n) => {
      const date = new Date(n.created_at);
      if (date >= todayStart) groups[t("today")].push(n);
      else if (date >= yesterdayStart) groups[t("yesterday")].push(n);
      else groups[t("earlier")].push(n);
    });

    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [notifications, t]);

  const handleNotifClick = (notif) => {
    if (!notif.is_read) markAsRead(notif.id);
    // Navigate to order detail if notification has an order_id
    if (notif.order_id) {
      navigate(`/order/${notif.order_id}`);
    }
  };

  return (
    <>
      <InternalHeader title={t("notifications")} />

      <div className="content">
        {/* Header bar with count & mark all read */}
        {notifications.length > 0 && (
          <div className="notif-header-bar">
            <span className="notif-count">
              {unreadCount > 0
                ? `${unreadCount} ${t("unread")}`
                : `${notifications.length} ${t("notifications_count")}`}
            </span>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllRead}>
                <i className="bx bx-check-double"></i> {t("mark_all_read")}
              </button>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="notif-empty">
            <div className="notif-loading-spinner"></div>
            <p>{t("loading_notifications")}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <div className="notif-empty">
            <div className="notif-empty-icon-wrap">
              <i className="bx bx-bell-off notif-empty-icon"></i>
            </div>
            <h3 className="notif-empty-title">{t("no_notifications")}</h3>
            <p className="notif-empty-subtitle">
              {t("no_notifications_subtitle")}
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
                    className={`notif-item ${!notif.is_read ? "unread" : ""} ${notif.order_id ? "clickable" : ""}`}
                    onClick={() => handleNotifClick(notif)}
                    style={notif.order_id ? { cursor: "pointer" } : {}}
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
                      <p className="notif-message">{notif.body}</p>
                      {notif.order_id && (
                        <span className="notif-order-link">
                          <i className="bx bx-link-external"></i> {t("view_order")}
                        </span>
                      )}
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
