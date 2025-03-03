import React, { useState, useEffect } from 'react';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
  
useEffect(() => {
    const fetchOrderCount = async () => {
    try {
        const response = await fetch('http://localhost:5195/Data/GetOrderCount', {
        credentials: 'include',
        });
        if (response.ok) {
        const count = await response.json();
        setTotalPages(Math.ceil(count / 10));
        }
    } catch (error) {
        console.error('Error fetching order count:', error);
    }
    };

    const fetchOrders = async () => {
    try {
        const response = await fetch(`http://localhost:5195/Data/GetAllOrder?PageNumber=${pageNumber}`, {
        credentials: 'include',
        });
        if (response.ok) {
        const data = await response.json();
        setOrders(data);
        } else {
        console.error('Failed to fetch orders');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    };

    fetchOrderCount();
    fetchOrders();
}, [pageNumber]);

const nextPage = () => {
    if (pageNumber * 10 < totalPages * 10) setPageNumber(pageNumber + 1);
};

const prevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
};

const handleDelivery = async (orderId) => {
    try {
    const response = await fetch(`http://localhost:5195/Data/DeliverOrder?OrderId=${orderId}`, {
        method: 'Delete',
        credentials: 'include',
    });
    if (response.ok) {
        setOrders((orders) => orders.filter(order => order.id !== orderId));
        alert('سفارش با موفقیت تحویل داده شد!');
    } else {
        alert('خطایی در تحویل سفارش رخ داد');
    }
    } catch (error) {
    console.error('Error:', error);
    alert('مشکلی در ارتباط با سرور رخ داد.');
    }
};

  
  
return (
    <div className="order-list glass-effect">
    <h2>لیست سفارشات</h2>
    <ul>
        {orders.map((order) => (
        <li key={order.id} className="list-item">
            <div className="order-details">
            <p>نام کاربر: {order.userName}</p>
            <p>شماره کاربر: {order.userNumber}</p>
            <p>نام محصول: {order.productName}</p>
            <p>تعداد: {order.productNumber}</p>
            <span className="delivery-toggle" onClick={() => handleDelivery(order.id)}>تحویل</span>
            </div>
        </li>
        ))}
    </ul>
    <div className="pagination-controls">
        <button onClick={prevPage} disabled={pageNumber === 1} className="glass-button after-before-buttons">قبلی</button>
        <span style={{ display: "flex", margin: "5px", alignItems: "center" }}>صفحه {pageNumber} از {totalPages}</span>
        <button onClick={nextPage} disabled={pageNumber >= totalPages} className="glass-button after-before-buttons">بعدی</button>
    </div>
    </div>
);
}
export default OrderList
