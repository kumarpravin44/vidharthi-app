import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import { orderService } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import "boxicons/css/boxicons.min.css";

function MyOrders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { getLocalizedName, t } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const showPopup = (message, type = "success") => {
    setPopupType(type);
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handleRepeatOrder = async (order) => {
    if (!order.items || order.items.length === 0) {
      showPopup(t("no_items"), "error");
      return;
    }

    setReordering(order.id);

    try {
      for (const item of order.items) {
        await addItem(item.product_id, item.quantity);
      }
      showPopup(t("added_to_cart"), "success");
      setTimeout(() => navigate("/cart"), 1500);
    } catch (error) {
      showPopup(error.message || t("error_add_cart"), "error");
    } finally {
      setReordering(null);
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      placed: "pending",
      confirmed: "confirmed",
      packed: "processing",
      out_for_delivery: "shipped",
      delivered: "delivered",
      cancelled: "cancelled"
    };
    return statusMap[status.toLowerCase()] || "pending";
  };

  if (loading) {
    return (
      <>
        <InternalHeader title={t("my_orders")} />
        <div className="content">
          <p style={{ textAlign: "center", padding: "20px" }}>
            {t("loading")}
          </p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <InternalHeader title={t("my_orders")} />

      <div className="content">
        <div className="orders-page">

          {orders.length === 0 ? (
            <div className="empty-orders">
              <i className="bx bx-package" style={{ fontSize: "64px", color: "#ccc" }}></i>
              <p>{t("no_orders")}</p>

              <button
                className="primary-btn"
                style={{ marginTop: "20px" }}
                onClick={() => navigate("/")}
              >
                {t("start_shopping")}
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div className="order-card" key={order.id}>

                <div className="order-header">
                  <div>
                    <h4>{t("order")} #{order.id.substring(0, 8)}</h4>
                    <p>{formatDate(order.created_at)}</p>
                  </div>

                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {t(order.status.toLowerCase())}
                  </span>
                </div>

                <div className="order-items">
                  {order.items?.map((item, idx) => (
                    <span key={idx}>
                      {getLocalizedName(item.product) || t("product")} × {item.quantity}
                      {idx < order.items.length - 1 && ", "}
                    </span>
                  ))}
                </div>

                <div className="order-footer">
                  <h4>{t("total")}: ₹ {order.total?.toFixed(2) || "0.00"}</h4>

                  <div className="order-footer-btns">
                    <button
                      className="repeat-order-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRepeatOrder(order);
                      }}
                      disabled={reordering === order.id}
                    >
                      {reordering === order.id ? t("adding") : t("repeat")}
                    </button>

                    <button
                      className="view-btn"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      {t("view")}
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}

        </div>
      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <i
              className={`bx ${
                popupType === "success"
                  ? "bx-check-circle success-icon"
                  : "bx-error error-icon"
              }`}
            ></i>
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}

export default MyOrders;