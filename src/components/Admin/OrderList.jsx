import React, { useState, useEffect } from 'react';

function OrderList(Params) {
    const [orders, setOrders] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');

    // وضعیت برای مدیریت باز یا بسته بودن جزئیات سفارش
    const [openOrderId, setOpenOrderId] = useState(null);

    useEffect(() => {
        const fetchOrderCount = async () => {
            try {
                let response;
                if (Params.Delivered) {
                    response = await fetch('http://localhost:5195/GetData/GetDeliveredOrderCount', {
                        credentials: 'include',
                    });
                }
                else {
                    response = await fetch('http://localhost:5195/GetData/GetOrderCount', {
                        credentials: 'include',
                    });
                }

                if (response.ok) {
                    const count = await response.json();
                    {count > 0 && setTotalPages(Math.ceil(count / 10))}; // تعداد صفحات را محاسبه کنید
                }
            } catch (error) {
                console.error('Error fetching order count:', error);
            }
        };

        const fetchOrders = async () => {
            try {
                let response;
                if (Params.Delivered) {
                    response = await fetch(`http://localhost:5195/GetData/GetAllDeliveredOrder?PageNumber=${pageNumber}`, {
                        credentials: 'include',
                    });
                }
                else {
                    response = await fetch(`http://localhost:5195/GetData/GetAllOrder?PageNumber=${pageNumber}`, {
                        credentials: 'include',
                    });
                }
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
    }, [pageNumber, Params.Delivered]);

    const nextPage = () => {
        if (pageNumber * 10 < totalPages * 10) setPageNumber(pageNumber + 1);
    };

    const prevPage = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };

    const handleDelivery = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5195/EditData/DeliverOrder?OrderId=${orderId}`, {
                method: 'Put',
                credentials: 'include',
            });
            if (response.ok) {
                setOrders((orders) => orders.filter(order => order.id !== orderId));
                // alert('سفارش با موفقیت تحویل داده شد!');
                setSuccessMessage('سفارش با موفقیت تحویل داده شد!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                // alert('خطایی در تحویل سفارش رخ داد');
                setSuccessMessage('خطایی در تحویل سفارش رخ داد');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            // alert('مشکلی در ارتباط با سرور رخ داد.');
            setSuccessMessage('مشکلی در ارتباط با سرور رخ داد.');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const toggleDetails = (orderId) => {
        setOpenOrderId(openOrderId === orderId ? null : orderId);
    };

    return (
        <div className="order-list glass-effect">
            <h2>لیست سفارشات</h2>
            <p>{successMessage}</p>
            <ul>
                {orders.map((order) => (
                    <li key={order.id} className="list-item">
                        <div className="order-summary">
                            <p>نام کاربر: {order.userName}</p> {/* نام کاربر */}
                            <p>شماره کاربر: {order.userNumber}</p> {/* شماره کاربر */}
                            <p>آدرس کاربر: {order.address}</p> {/* شماره کاربر */}

                            <p>مجموع قیمت: {order.totalPrice}</p> {/* مجموع قیمت سفارش */}
                            <p>تعداد محصولات: {order.details.length}</p> {/* تعداد محصولات */}
                            <p>تاریخ سفارش: {order.createAt} </p>
                            <span
                                className="delivery-toggle"
                                onClick={!Params.Delivered ? () => handleDelivery(order.id) : undefined}
                            >
                                {Params.Delivered ? 'تحویل شده' : 'تحویل'}
                            </span>

                            <button className='details-button' onClick={() => toggleDetails(order.id)}>
                                {openOrderId === order.id ? 'پنهان کردن جزئیات' : 'نمایش جزئیات'}
                            </button>
                        </div>

                        {/* جزئیات سفارش */}
                        {openOrderId === order.id && (
                            <div style={{backgroundColor: "#fff1",paddingTop: "25px"}} className="order-details">
                                <h4>جزئیات سفارش</h4>
                                <ul>
                                    {order.details.map((item) => (
                                        <li key={item.id}>
                                            <p>نام محصول: {item.productName}</p>
                                            <p>تعداد: {item.stock}</p>
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
