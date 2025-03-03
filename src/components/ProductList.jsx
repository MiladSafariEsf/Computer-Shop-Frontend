import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';

function ProductList({ apiUrl }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartStatus, setCartStatus] = useState({}); // ذخیره وضعیت دکمه‌ها

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(apiUrl);
                const products = response.data.map((product) => ({
                    title: product.name,
                    description: product.description,
                    price: product.price.toLocaleString(),
                    oldPrice: (product.price * 1.2).toLocaleString(),
                    imageSrc: `http://localhost:5195/GetData/GetImageByPath?filePath=${product.imageUrl.split('/').pop()}`,
                    Id: product.id
                }));
                setProducts(products);

                // مقدار اولیه وضعیت دکمه‌ها
                const initialStatus = {};
                products.forEach(product => {
                    initialStatus[product.Id] = false; // همه به false تنظیم می‌شوند
                });
                setCartStatus(initialStatus);
            } catch (err) {
                setError('خطا در دریافت اطلاعات محصولات');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (apiUrl) {
            fetchProducts();
        }
    }, [apiUrl]);

    const handleAddToCart = (productId) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        cart[productId] = (cart[productId] || 0) + 1;
        localStorage.setItem('cart', JSON.stringify(cart));

        // تغییر وضعیت دکمه به "اضافه شد"
        setCartStatus(prevStatus => ({
            ...prevStatus,
            [productId]: true
        }));
    };

    if (loading) return (
        <div className="spinner-border m-5" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
    if (error) return <p>{error}</p>;

    return (
        <div className="row container m-auto mt-3 justify-content-center">
            {products.map((product, index) => (
                <div key={index} className="justify-content-center col-lg-4 col-md-6 col-sm-12 col-12">
                    <ProductCard 
                        {...product} 
                        onAddToCart={() => handleAddToCart(product.Id)} 
                        isAdded={cartStatus[product.Id]} // ارسال وضعیت به ProductCard
                    />
                </div>
            ))}
        </div>
    );
}

export default ProductList;
