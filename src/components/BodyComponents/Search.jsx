import React, { useState } from 'react';
import ProductList from '../ProductList';
import Footer from '../Footer';

function Search() {
    const [searchTerm, setSearchTerm] = useState(''); // ذخیره مقدار جستجو
    const [apiUrl, setApiUrl] = useState(''); // ذخیره URL مربوط به جستجو

    // مدیریت تغییر مقدار ورودی جستجو
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // مدیریت کلیک روی دکمه جستجو
    const handleSearch = () => {
        // ساخت URL برای جستجو
        const newApiUrl = `http://localhost:5195/GetData/SearchProduct?search=${searchTerm}`;
        setApiUrl(newApiUrl); // تنظیم URL برای ProductList
    };

    // مدیریت رویداد فشردن کلید Enter
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <div className="search-div">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="جستجو"
                        value={searchTerm}
                        onChange={handleInputChange} // بروزرسانی مقدار جستجو
                        onKeyPress={handleKeyPress} // جستجو با فشردن کلید Enter
                    />
                    <i
                        className="fa-solid fa-magnifying-glass"
                        onClick={handleSearch} // جستجو با کلیک روی آیکون
                        style={{ cursor: 'pointer' }}
                    ></i>
                </div>
            </div>
            <br />
            {/* اگر URL تنظیم شده باشد، ProductList را با URL مربوطه نمایش بده */}
            {apiUrl && <ProductList apiUrl={apiUrl} />}
        </>
    );
}

export default Search;
