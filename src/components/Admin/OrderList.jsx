import React, { useState, useEffect } from 'react';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // وضعیت برای مدیریت باز یا بسته بودن جزئیات سفارش
    const [openOrderId, setOpenOrderId] = useState(null);

    useEffect(() => {
        const fetchOrderCount = async () => {
            try {
                const response = await fetch('http://localhost:5195/GetData/GetOrderCount', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const count = await response.json();
                    setTotalPages(Math.ceil(count / 10)); // تعداد صفحات را محاسبه کنید
                }
            } catch (error) {
                console.error('Error fetching order count:', error);
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:5195/GetData/GetAllOrder?PageNumber=${pageNumber}`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data); // داده‌های جدید را درون state قرار می‌دهیم
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
            const response = await fetch(`http://localhost:5195/EditData/DeliverOrder?OrderId=${orderId}`, {
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

    const toggleDetails = (orderId) => {
        setOpenOrderId(openOrderId === orderId ? null : orderId);
    };

    return (
        <div className="order-list glass-effect">
            <h2>لیست سفارشات</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id} className="list-item">
                        <div className="order-summary">
                            <p>نام کاربر: {order.user.userName}</p> {/* نام کاربر */}
                            <p>شماره کاربر: {order.user.number}</p> {/* شماره کاربر */}
                            <p>مجموع قیمت: {order.totalPrice}</p> {/* مجموع قیمت سفارش */}
                            <p>تعداد محصولات: {order.orderDetails.length}</p> {/* تعداد محصولات */}
                            <span className="delivery-toggle" onClick={() => handleDelivery(order.id)}>
                                {order.isDelivered ? 'تحویل شده' : 'تحویل'}
                            </span>
                            <button className='details-button' onClick={() => toggleDetails(order.id)}>
                                {openOrderId === order.id ? 'پنهان کردن جزئیات' : 'نمایش جزئیات'}
                            </button>
                        </div>

                        {/* جزئیات سفارش */}
                        {openOrderId === order.id && (
                            <div className="order-details">
                                <h4>جزئیات سفارش</h4>
                                <ul>
                                    {order.orderDetails.map((item) => (
                                        <li key={item.id}>
                                            <p>شناسه محصول: {item.productId}</p>
                                            <p>تعداد: {item.quantity}</p>
                                            <p>قیمت واحد: {item.unitPrice}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div className="pagination-controls">
                <button onClick={prevPage} disabled={pageNumber === 1} className="glass-button after-before-buttons">
                    قبلی
                </button>
                <span style={{ display: "flex", margin: "5px", alignItems: "center" }}>
                    صفحه {pageNumber} از {totalPages}
                </span>
                <button onClick={nextPage} disabled={pageNumber >= totalPages} className="glass-button after-before-buttons">
                    بعدی
                </button>
            </div>
        </div>
    );
}

export default OrderList;
