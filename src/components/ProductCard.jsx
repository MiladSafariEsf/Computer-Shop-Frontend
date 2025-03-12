import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ title, description, price, oldPrice, imageSrc, Id, onAddToCart, isAdded }) {
    const navigate = useNavigate();

    return (
        <div style={{cursor : "default"}} className="product-card glass m-1 mt-3" onClick={() => navigate(`/ProductDetail/${Id}`)}>
            <div className="card-header">
                <img src={imageSrc} alt="تصویر محصول" className="product-image" />
            </div>
            <div className="card-body">
                <h2 className="product-title">{title}</h2>
                <p className="product-description">
                    {description.length > 15 ? description.slice(0, 15) + "..." : description}
                </p>

                <div className="price-container">
                    <span className="price">{price} تومان</span>
                    {/* <span className="old-price">{oldPrice} تومان</span> */}
                </div>
                <button
                    className="buy-button glass-button"
                    onClick={(e) => {
                        e.stopPropagation(); // جلوگیری از باز شدن صفحه جزئیات هنگام کلیک روی دکمه
                        onAddToCart();
                    }}
                    disabled={isAdded}
                >
                    {isAdded ? 'اضافه شد' : 'اضافه به سبد خرید'}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
