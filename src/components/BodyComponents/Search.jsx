import React, { useState, useEffect } from 'react';
import ProductList from '../ProductList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [category, setCategory] = useState('');
    const [apiUrl, setApiUrl] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [categories, setCategories] = useState([]); // ذخیره دسته‌بندی‌ها

    useEffect(() => {
        // دریافت لیست دسته‌بندی‌ها از API
        fetch('http://localhost:5195/GetData/GetAllCategory')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleSearch = () => {
        if (searchTerm && searchTerm.match(/^\s+$/) === null) {
            let newApiUrl = `http://localhost:5195/GetData/SearchProduct?search=${searchTerm}`;
            setApiUrl(newApiUrl);
        }
    };

    const handleAdvancedSearch = (e) => {
        e.preventDefault();
        let advancedApiUrl = `http://localhost:5195/GetData/AdvancedSearchProduct?`;

        if (searchTerm) advancedApiUrl += `search=${searchTerm}&`;
        if (minPrice) advancedApiUrl += `minPrice=${minPrice}&`;
        if (maxPrice) advancedApiUrl += `maxPrice=${maxPrice}&`;
        if (category) advancedApiUrl += `category=${category}&`;
        
        setApiUrl(advancedApiUrl.slice(0, -1)); // حذف & اضافی انتهای URL
    };

    return (
        <>
            <div className="search-div">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="جستجو"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {/* <i className="fa-solid fa-magnifying-glass" onClick={handleSearch} style={{ cursor: 'pointer' }}></i> */}
                    <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} onClick={handleSearch} style={{ cursor: 'pointer' }} />
                </div>
                <button className="buy-button glass-button mt-2" onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? 'بستن جستجوی پیشرفته' : 'جستجوی پیشرفته'}
                </button>
            </div>

            {showAdvanced && (
                <div className="vasat d-flex justify-content-center">
                    <div className="bar-wrapper advanced-search d-flex flex-column container align-items-center">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <p className="mb-0 advanced-search-title">جستجوی پیشرفته</p>
                        </div>
                        <form className="advanced-search w-100 d-flex flex-column align-items-center" onSubmit={handleAdvancedSearch}>
                            <div className="d-flex inputs-wrapper w-100 flex-column flex-lg-row align-items-center">
                                <div className="price-range w-100 d-flex justify-content-around flex-column flex-md-row align-items-center">
                                    <p className="mb-0">محدوده قیمت:</p>
                                    <div className="min d-flex flex-column flex-md-row align-items-center">
                                        <label htmlFor="min-price">کمینه قیمت:</label>
                                        <input
                                            className="Ainput form-control"
                                            type="number"
                                            placeholder="از"
                                            id='min-price'
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="max d-flex flex-column flex-md-row align-items-center">
                                        <label htmlFor="max-price">بیشینه قیمت:</label>
                                        <input
                                            className="Ainput form-control"
                                            type="number"
                                            placeholder="تا"
                                            id='max-price'
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="order-by d-flex w-50 flex-column align-items-center">
                                    <label className="mb-1" htmlFor="category-dropdown">انتخاب دسته‌بندی</label>
                                    <select
                                        className="form-select Aselect"
                                        id="category-dropdown"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">انتخاب کنید</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end w-100">
                                <button className="buy-button glass-button mt-2" type="submit">اعمال</button>
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
