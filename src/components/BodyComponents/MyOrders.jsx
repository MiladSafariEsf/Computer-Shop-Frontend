import React, { useEffect, useState } from "react";
import "../../styles/MyOrders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5195/GetData/GetMyOrders", {
      method: "GET", // یا "PUT" اگر API نیاز دارد
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="Morders-container">
      {orders.length == 0 ? <><h2 className="Morders-title">هنوز خریدی نکرده اید!</h2></> :
        <>
          <h2 className="Morders-title">سفارشات</h2>
          <div className="Morders-list">
            {orders.map((order) => (
              <div key={order.id} className="Morder-card">
                <div className="Morder-header">
                  <span className="Morder-date">تاریخ: {order.createAt}</span>
                  <span
                    className={`Morder-status ${order.isDelivered == true ? "delivered" : "pending"}`}
                  >
                    {order.isDelivered == true ? "تحویل داده شده" : "تحویل داده نشده"}
                  </span>
                </div>
                <div className="Morder-details">
                  {order.details.map((detail, index) => (
                    <div key={index} className="Morder-item">
                      <span>{detail.productName}</span>
                      <span>{detail.stock} عدد</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>}
    </div>
  );
}
