import React, { useContext, useState, useEffect } from 'react';
import "../../styles/ShoppingCart.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
function ShoppingCart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState({});
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [Successmessage, setSuccessMessage] = useState('');
    const [message, setMessage] = useState('')
    const { isAuthenticated } = useContext(AuthContext);
    let [rendered, setRendered] = useState(false)
    // بارگذاری سبد خرید از LocalStorage
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || {};
        setCart(storedCart);

    }, []);

    // بارگذاری اطلاعات محصولات
    useEffect(() => {  
        if ((Object.keys(cart)).length > 0 && rendered == false) {
            setRendered("true")
            loadProducts();
        }
    }, [cart]);

    const loadProducts = async () => {
        setLoading(true);
        const productIds = Object.keys(cart);
        const fetchedProducts = {};

        for (const productId of productIds) {
            if (!products[productId]) {
                const product = await fetchProductById(productId);
                if (product) {
                    fetchedProducts[productId] = product;
                }
            }
        }

        setProducts(prevProducts => ({
            ...prevProducts,
            ...fetchedProducts
        }));
        setLoading(false);
    };

    const fetchProductById = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5195/GetData/GetProductById?id=${productId}`);
            if (!response.ok) {
                localStorage.clear();
                throw new Error(`محصول با شناسه ${productId} یافت نشد.`);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err.message);
            setError(err.message);
            return null;
        }
    };
    const updateCart = (productId, newQuantity) => {
        const updatedCart = { ...cart };
        if (newQuantity <= 0) {
            delete updatedCart[productId];
        }
        else if (newQuantity > products[productId].stock) {
            setMessage(`محصول ${products[productId].name} بیشتر از این مقدار در انبار ندارد`);
            setTimeout(() => setMessage(""), 3000);
            return;
        }
        else {
            updatedCart[productId] = newQuantity;
        }
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        let total = 0;
        for (const productId in cart) {
            const product = products[productId];
            if (product) {
                total += product.price * cart[productId];
            }
        }
        return total;
    };

    const handleRemoveProduct = (productId) => updateCart(productId, 0);
    const handleIncreaseQuantity = (productId) => updateCart(productId, (cart[productId] || 0) + 1);
    const handleDecreaseQuantity = (productId) => updateCart(productId, (cart[productId] || 0) - 1);



    const sendOrderToAPI = async () => {
        const orders = Object.entries(cart).map(([productId, Quantity]) => ({
            ProductId: productId,
            Quantity: Quantity,
        }));

        try {
            const response = await fetch('http://localhost:5195/AddData/AddOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orders),
                credentials: 'include'
            });

            const resultText = await response.text(); // تغییر برای دریافت متن به‌جای JSON

            if (!response.ok) {
                throw new Error(`خطا در ثبت سفارش: ${resultText}`);
            }

            console.log('سفارش با موفقیت ثبت شد:', resultText);
            setCart({});
            localStorage.removeItem('cart');
            setSuccessMessage("خرید با موفقیت انجام شد!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            navigate('/login');
            console.error('خطا:', error.message);
            setError('خطا در ثبت سفارش.');
        }
    };
    const navigateToLogin = () => {
        navigate("/login");
    }
    const navigateToRegister = () => {
        navigate("/Register")
    }



    if (Object.keys(cart).length === 0) {
        return (<>
            {Successmessage && <div className="alert alert-success" role="alert">{Successmessage}</div>}
            <p style={{ color: '#fff' }} className="text-center mt-4">سبد خرید شما خالی است!</p>
        </>
        );
    }

    if (loading) {
        return <p style={{ color: '#fff' }} className="text-center mt-4">در حال بارگذاری...</p>;
    }

    if (error) {
        return <p style={{ color: '#f00' }} className="text-center mt-4">{error}</p>;
    }

    const total = calculateTotal();

    return (
        <div className="container mt-4 glass-container">

            <h2 style={{ color: '#fff' }} className="text-center">سبد خرید</h2>
            <p style={{ color: '#fff' }} className="text-center">{message}</p>
            <div className="cart-cards-container">
                {Object.keys(cart).map((productId) => {
                    const product = products[productId];
                    if (!product) return null;

                    return (
                        <div key={productId} className="cart-card">
                            <h5>{product.name}</h5>
                            <p>قیمت: {product.price} تومان</p>
                            <p>تعداد: {cart[productId]}</p>
                            <div className="actions">
                                <button
                                    className="btn shc-btn btn-success btn-sm mx-1"
                                    onClick={() => handleIncreaseQuantity(productId)}
                                >
                                    {/* <i className="fa-solid fa-plus"></i> */}
                                    <FontAwesomeIcon className="icon" icon={faPlus} />
                                </button>
                                <button
                                    className="btn shc-btn btn-warning btn-sm mx-1"
                                    onClick={() => handleDecreaseQuantity(productId)}
                                >
                                    {/* <i className="fa-solid fa-minus"></i> */}
                                    <FontAwesomeIcon className="icon" icon={faMinus} />
                                </button>
                                <button
                                    className="btn shc-btn btn-danger btn-sm mx-1"
                                    onClick={() => handleRemoveProduct(productId)}
                                >
                                    {/* <i className="fa-solid fa-trash-can"></i> */}
                                    <FontAwesomeIcon className="icon" icon={faTrashCan} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="total">
                <h3 style={{ color: '#fff' }}>هزینه کل: {total} تومان</h3>
                {!isAuthenticated && (<p dir='rtl' className='alertToLogin'>برای پرداخت ابتدا باید وارد حساب کاربری خود شوید.</p>)}

                <div className="Shc-Buttons-Div">
                    {isAuthenticated ? (

                        <button className="btn shc-btn mt-3" onClick={sendOrderToAPI}>
                            پرداخت
                        </button>
                    ) : (
                        <>

                            <button className="btn shc-btn mt-3" onClick={navigateToLogin}>
                                ورود
                            </button>
                            <button className="btn shc-btn mt-3" onClick={navigateToRegister}>
                                ثبت‌نام
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;
