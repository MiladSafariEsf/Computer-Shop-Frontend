import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/ProductDetail.css"; // ایمپورت فایل استایل

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (!id) {
      console.error("ID محصول وجود ندارد!");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5195/GetData/GetAllDataOfProductById?Id=${id}`
        );

        if (!response.data || !response.data.id) {
          throw new Error("محصول پیدا نشد!");
        }

        setProduct(response.data);
      } catch (err) {
        setError(err.message || "خطا در دریافت اطلاعات محصول");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ارسال نظر
  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;

    try {
      const reviewData = {
        productId: id,
        comment: newReview,
        rating: newRating,
      };

      await axios.post(
        `http://localhost:5195/GetData/AddReviewForProduct/${id}`,
        reviewData
      );

      setProduct((prev) => ({
        ...prev,
        reviews: [
          ...prev.reviews,
          { ...reviewData, id: Date.now().toString(), createAt: new Date() },
        ],
      }));

      setNewReview("");
      setNewRating(5);
    } catch (error) {
      console.error("خطا در ارسال نظر:", error);
    }
  };

  if (loading) return <div className="Dloading">در حال بارگذاری...</div>;
  if (error) return <div className="Derror-message">{error}</div>;

  return (
    <div className="Dproduct-container">
      {/* بخش اصلی محصول */}
      <div className="Dproduct-main-section">
        {/* سمت چپ - تصویر */}
        <div className="Dproduct-image-wrapper">
          <img
            src={product.imageUrl ? `http://localhost:5195/GetData/GetImageByPath?filePath=${product.imageUrl.split('/').pop()}` : "/placeholder.jpg"}
            alt={product.name || "محصول"}
            className="Dproduct-image"
          />
        </div>
  
        {/* سمت راست - اطلاعات */}
        <div className="Dproduct-info">
          <h1 className="Dproduct-title">{product.name}</h1>
          <p className="Dproduct-price">{product.price.toLocaleString()} تومان</p>
          <p className={`Dproduct-stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
            {product.stock > 0 ? `موجودی: ${product.stock} عدد` : "ناموجود"}
          </p>
        </div>
      </div>
  
      {/* بخش توضیحات */}
      <div className="Ddescription-box">
        <h2>توضیحات محصول</h2>
        <p>{product.description}</p>
      </div>
  
      {/* بخش نظرات */}
      <div className="Dreviews-section">
        <h2>نظرات کاربران ({product.reviews?.length || 0})</h2>
        
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <div key={review.id} className="Dreview-card">
              <p>{review.comment}</p>
              <div className="Dreview-meta">
                <span>⭐ {review.rating}/5</span>
                <span>{new Date(review.createAt).toLocaleDateString("fa-IR")}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="Dno-reviews">هنوز نظری ثبت نشده است.</p>
        )}
  
        {/* فرم ارسال نظر */}
        <div className="Dreview-form">
          <input
            type="text"
            placeholder="نظر خود را بنویسید..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <select 
            value={newRating} 
            onChange={(e) => setNewRating(Number(e.target.value))}
          >
            <option value={5}>⭐ ۵</option>
            <option value={4}>⭐ ۴</option>
            <option value={3}>⭐ ۳</option>
            <option value={2}>⭐ ۲</option>
            <option value={1}>⭐ ۱</option>
          </select>
          <button onClick={handleReviewSubmit}>ثبت نظر</button>
        </div>
      </div>
    </div>
  )};

export default ProductDetail;
