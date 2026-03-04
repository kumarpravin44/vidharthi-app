import InternalHeader from "../components/InternalHeader";
import BottomNav from "../components/BottomNav";
import "boxicons/css/boxicons.min.css";

function MyOrders() {

  const orders = [
    {
      id: "ORD12345",
      date: "10 March 2026",
      status: "Delivered",
      total: 250,
      items: ["Tata Salt", "Basmati Rice"]
    },
    {
      id: "ORD67890",
      date: "8 March 2026",
      status: "Pending",
      total: 120,
      items: ["Soft Drinks"]
    },
    {
      id: "ORD54321",
      date: "5 March 2026",
      status: "Cancelled",
      total: 90,
      items: ["Dry Fruits"]
    }
  ];

  return (
    <>
      <InternalHeader title="My Orders" />
      <div className="content" >

      <div className="orders-page">

        {orders.length === 0 ? (
          <div className="empty-orders">
            <i className='bx bx-package'></i>
            <p>No orders found</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div className="order-card" key={index}>

              <div className="order-header">
                <div>
                  <h4>{order.id}</h4>
                  <p>{order.date}</p>
                </div>

                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.join(", ")}
              </div>

              <div className="order-footer">
                <h4>Total: ₹ {order.total}</h4>
                <button className="view-btn">
                  View Details
                </button>
              </div>

            </div>
          ))
        )}

      </div>
      </div>

      <BottomNav />
    </>
  );
}

export default MyOrders;