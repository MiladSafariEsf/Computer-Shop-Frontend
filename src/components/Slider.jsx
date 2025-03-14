import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Slider() {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        // دریافت تعداد اسلایدرها از API اول
        axios.get('http://localhost:5195/GetData/GetBannerCount') // اینجا آدرس API تعداد اسلایدر را بگذار
            .then(response => {
                const count = response.data.count; // فرض بر این که API مقدار count را برمی‌گرداند

                // دریافت اطلاعات اسلایدرها از API دوم
                return axios.get('http://localhost:5195/GetData/GetAllBanners'); // اینجا آدرس API اسلایدرها را بگذار
            })
            .then(response => {
                setSlides(response.data); // فرض بر این که API آرایه‌ای از اسلایدها را برمی‌گرداند
            })
            .catch(error => {
                console.error('خطا در دریافت اطلاعات اسلایدر:', error);
            });
    }, []);

    useEffect(() => {
        if (slides.length > 0) {
            new window.bootstrap.Carousel(document.getElementById('carouselExampleInterval'), {
                interval: 5000,
                ride: 'carousel'
            });
        }
    }, []);

    return (
        <>
        {slides.length === 0 ? <></> : <section className="slider mt-3">
            <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {slides.map((slide, index) => (
                        <div key={index} style={{border: "none"}} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="5000">
                            <img
                                style={{ borderRadius: '20px', paddingLeft: '5px', paddingRight: '5px' }}
                                src={`http://localhost:5195/GetData/GetBanerImageByPath?filePath=${slide.banerImageUrl ? slide.banerImageUrl.split('/').pop() : ''}`}
                                className="d-block w-100"
                                alt={slide.altText || `Slide ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </section>}
        </>
    );
}

export default Slider;
