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
  const [cartStatus, setCartStatus] = useState(); // ذخیره وضعیت دکمه‌ها
  const [ReviewCount, setReviewCount] = useState()
  const [Rate, setRate] = useState()


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
          `http://localhost:5195/GetData/GetAllDataOfProductById?Id=${id}`,
          {
            withCredentials: true, // ارسال کوکی‌ها همراه درخواست
          }
        );


        if (!response.data || !response.data.id) {
          throw new Error("محصول پیدا نشد!");
        }

        setProduct(response.data);
        setRate(response.data.averageRate);
        setReviewCount(response.data.reviewCount)
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
        productId: id, // این مقدار باید Guid باشد
        comment: newReview,
        rating: newRating,
      };

      var res = await axios.post(
        `http://localhost:5195/AddData/AddReview`,
        reviewData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // ارسال کوکی‌ها همراه درخواست
        }
      );
      setRate(((ReviewCount * Rate) + newRating) / (ReviewCount + 1))
      setReviewCount(ReviewCount + 1);
      setProduct((prev) => ({
        ...prev,
        reviews: [

          { ...reviewData, id: res.data.id, date: "همین الان", userName: product.userName, isOwner: true },
          ...prev.reviews,
        ],
      }));

      setNewReview("");
      setNewRating(5);
    } catch (error) {
      console.error("خطا در ارسال نظر:", error);
    }
  };

  // هندل انتخاب ستاره‌ها
  const handleStarClick = (index) => {
    setNewRating(index + 1);
  };
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5195/DeleteData/DeleteReviewById?ReviewId=${reviewId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // ارسال کوکی‌ها همراه درخواست
        }
      );

      if (response.status === 200) {
        setProduct((prev) => ({
          ...prev,
          reviews: prev.reviews.filter((review) => review.id !== reviewId),
        }));
      }
    } catch (error) {
      console.error("خطا در حذف دیدگاه:", error);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[product.id] = (cart[product.id] || 0) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));

    // تغییر وضعیت دکمه به "اضافه شد"
    setCartStatus(true);
  };
  if (loading) return <div className="Dloading">در حال بارگذاری...</div>;
  if (error) return <div className="Derror-message">{error}</div>;

  return (
    <div className="text-right review-container">
      {/* بخش اصلی محصول */}
      <div className="container">
        <div className="review-container GContainer">
          <div className="row align-items-center mb-4 ">
            <div className="col-12 col-lg-4 text-center">
              <img
                src={product.imageUrl ? `http://localhost:5195/GetData/GetImageByPath?filePath=${product.imageUrl.split('/').pop()}` : "/placeholder.jpg"}
                alt={product.name || "محصول"}
                className="review-image w-100 mb-3 mb-lg-0"
              />
            </div>
            <div className="col-12 col-lg-8">
              <h1 className="mb-3 mt-3">{product.name}</h1>
              <div className="mb3">
                <span className="h4 me-2">{product.price} تومان</span>
                {/* <span className=""><s>$399.99</s></span> */}
              </div>
              <div className="mb3">
                {(() => {
                  const roundedRate = Math.round(Rate * 2) / 2; // رند به نزدیک‌ترین 0.5
                  const fullStars = Math.floor(roundedRate);
                  const hasHalfStar = roundedRate % 1 !== 0;
                  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                  return (
                    <>
                      {/* ستاره‌های پر */}
                      {Array.from({ length: fullStars }).map((_, index) => (
                        <i key={index} className="bi bi-star-fill text-warning"></i>
                      ))}

                      {/* ستاره‌ی نیمه‌پر در صورت نیاز */}
                      {hasHalfStar && <i className="bi bi-star-half text-warning"></i>}

                      {/* ستاره‌های خالی */}
                      {Array.from({ length: emptyStars }).map((_, index) => (
                        <i key={index + 10} className="bi bi-star text-warning"></i>
                      ))}

                      <span className="ms-2">{Rate.toFixed(1)} ({ReviewCount} نظر)</span>
                    </>
                  );
                })()}
              </div>


              <p className="mb-4" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                {product.description}
              </p>
              <button
                className="D-Buttons glass-button"
                onClick={() => {
                  handleAddToCart();
                }}
                disabled={cartStatus}
              >
                {cartStatus ? 'اضافه شد' : 'اضافه به سبد خرید'}
              </button>
            </div>
          </div>

          {/* ثبت نظر */}
          {product.userName != null ? (
            <div className="mb-4">
              <h3 className="h5 mb-3">ثبت دیدگاه</h3>
              <div className="d-flex align-items-center mb-3">
                <div className="rating">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`fas fa-star ${index < newRating ? "active-rating-star" : "rating-star"}`}
                      onClick={() => handleStarClick(index)}
                      style={{ cursor: "pointer" }}
                    ></i>
                  ))}
                </div>
              </div>
              <textarea
                className="form-control mb-3 commnet-textbox"
                rows="5"
                placeholder="دیدگاه خود را بنویسید..."
                value={newReview}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setNewReview(e.target.value);
                  }
                }}
              ></textarea>
              <p className="text-mutede">{newReview.length}/200</p>
              <button className="D-Buttons glass-button" onClick={handleReviewSubmit}>ثبت</button>
            </div>
          ) : (
            <div>
              <p dir='rtl' className='alertToLogin'>برای ثبت نظر خود ابتدا باید وارد حساب کاربری خود شوید.</p>
            </div>
          )}



          {/* نظرات کاربران */}
          <h3 className="h5 font-weight-bold mb-4">دیدگاه کاربران</h3>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review.id} className="people-review mb-4">
                <div className="d-flex flex-column align-items-start mb-2">
                  <div className="ml-2 UserND"><span>{review.userName || "کاربر ناشناس"}</span><span>{review.date}</span></div>
                  <div className="rating">
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className={`fas fa-star ${index < review.rating ? "active-rating-star" : "rating-star"}`}
                      ></i>
                    ))}
                  </div>
                </div>
                <p style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>{review.comment}</p>
                {review.isOwner && <button onClick={() => handleDeleteReview(review.id)} className="D-Buttons glass-button" >حذف دیدگاه</button>}
              </div>
            ))
          ) : (
            <p>هنوز نظری ثبت نشده است.</p>
          )}
        </div>
      </div>
    </div >
  );
};

export default ProductDetail;