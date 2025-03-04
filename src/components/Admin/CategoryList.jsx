import React, { useState, useEffect } from 'react';

function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
  
    useEffect(() => {
        const fetchCategoryCount = async () => {
            try {
                const response = await fetch('http://localhost:5195/GetData/GetCategoryCount', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const count = await response.json();
                    setTotalPages(Math.ceil(count / 10));  // محاسبه تعداد صفحات بر اساس تعداد کل
                }
            } catch (error) {
                console.error('Error fetching category count:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch(`http://localhost:5195/GetData/GetCategoryByPageNumber?PageNumber=${pageNumber}`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchCategoryCount();  // تعداد دسته‌بندی‌ها را دریافت کنید
        fetchCategories();     // دسته‌بندی‌ها را دریافت کنید
    }, [pageNumber]);  // وابسته به تغییرات صفحه

    const nextPage = () => {
        if (pageNumber * 10 < totalPages * 10) setPageNumber(pageNumber + 1);
    };

    const prevPage = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };

    return (
        <div className="category-list glass-effect">
            <h2>لیست دسته‌بندی‌ها</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category.Id} className="list-item">
                        <div className="category-details">
                            <p>نام دسته‌بندی: {category.categoryName}</p>
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

export default CategoryList;
