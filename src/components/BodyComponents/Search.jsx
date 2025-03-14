import React, { useState } from 'react';
import ProductList from '../ProductList';
import Footer from '../Footer';

function Search() {
    const [searchTerm, setSearchTerm] = useState(''); // ذخیره مقدار جستجو
    const [minPrice, setMinPrice] = useState(''); // حداقل قیمت
    const [maxPrice, setMaxPrice] = useState(''); // حداکثر قیمت
    const [category, setCategory] = useState(''); // دسته‌بندی
    const [apiUrl, setApiUrl] = useState(''); // ذخیره URL مربوط به جستجو
    const [showAdvanced, setShowAdvanced] = useState(false); // نمایش یا مخفی کردن جستجوی پیشرفته

    // مدیریت تغییر مقدار ورودی‌ها
    const handleInputChange = (event) => setSearchTerm(event.target.value);
    const handleMinPriceChange = (event) => setMinPrice(event.target.value);
    const handleMaxPriceChange = (event) => setMaxPrice(event.target.value);
    const handleCategoryChange = (event) => setCategory(event.target.value);

    // مدیریت کلیک روی دکمه جستجو
    const handleSearch = () => {
        let newApiUrl = `http://localhost:5195/GetData/SearchProduct?search=${searchTerm}`;
        if (minPrice) newApiUrl += `&minPrice=${minPrice}`;
        if (maxPrice) newApiUrl += `&maxPrice=${maxPrice}`;
        if (category) newApiUrl += `&category=${category}`;
        setApiUrl(newApiUrl);
    };

    // مدیریت فشردن کلید Enter
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
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <i
                        className="fa-solid fa-magnifying-glass"
                        onClick={handleSearch}
                        style={{ cursor: 'pointer' }}
                    ></i>
                </div>
                <button className="buy-button glass-button mt-2" onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? 'بستن جستجوی پیشرفته' : 'جستجوی پیشرفته'}
                </button>
            </div>

            {/* دکمه نمایش/مخفی کردن جستجوی پیشرفته */}


            {/* بخش جستجوی پیشرفته*/}
            {showAdvanced && (
                <div className="vasat d-flex justify-content-center">
                    <div className="bar-wrapper advanced-search d-flex  flex-column container align-items-center">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <p className="mb-0 advanced-search-title">جستجوی پیشرفته</p>
                        </div>
                        <form action="" className="advanced-search w-100 d-flex justify-content-between flex-column align-items-center">
                            <div className="d-flex inputs-wrapper justify-content-between w-100 flex-column flex-lg-row align-items-center ">
                                <div className="justify-content-start">
                                    <div
                                        className="price-range w-100 d-flex justify-content-start flex-column flex-md-row align-items-center ">
                                        <p className="mb-0">محدوده قیمت:</p>
                                        <div className="min d-flex justify-content-between flex-column flex-md-row align-items-center ">
                                            <label for="min-price">کمینه قیمت:</label>
                                            <input className="Ainput form-control" type="number" placeholder="از" name="min-price"/>
                                        </div>
                                        <div className="max d-flex justify-content-between flex-column flex-md-row align-items-center">
                                            <label for="max-price">بیشینه قیمت:</label>
                                            <input className="Ainput form-control" type="number" placeholder="تا" name="max-price"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-by d-flex w-50 flex-column justify-content-between flex-row align-items-center">
                                    <label className="mb-1" for="category-dropdown">انتخاب دسته بندی</label>
                                    <select className="form-select Aselect" name="" id="category-dropdown">
                                        <option value="">انتخاب کنید</option>
                                        <option value="">کتگوری یک</option>
                                        <option value="">کتگوری دو</option>
                                    </select>

                                </div>
                            </div>
                            <div className="d-flex justify-content-end w-100">
                                <button className="buy-button glass-button mt-2 justify-self-end" type="submit">اعمال</button>
                            </div>
                        </form>

                    </div>

                </div>

            )}

            <br />
            {apiUrl && <ProductList apiUrl={apiUrl} />}
        </>
    );
}

export default Search;
