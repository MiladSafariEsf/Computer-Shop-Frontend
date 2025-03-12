import React, { useState, useEffect } from 'react';
import NewProduct from '../Admin/NewProduct';
import '../../styles/AdminDashboard.css';
import ProductListAdmin from '../Admin/ProductListAdmin';
import OrderList from '../Admin/OrderList';
import CategoryList from '../Admin/CategoryList';
import NewCategory from '../Admin/NewCategory';

function AdminPage() {
  const [activeSection, setActiveSection] = useState('Products');
  const [activeIntoSection, setActiveIntoSection] = useState('newProduct');

  useEffect(() => {
    if (activeSection === 'Products') {
      setActiveIntoSection('productList');
    } else if (activeSection === 'orderLists') {
      setActiveIntoSection('DeliveredOrderList');
    } else if (activeSection === 'Categories') {
      setActiveIntoSection('categoryList');
    }
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'Products':
        return (
          <>
            <button className={`nav-button nav-into-button glass-button ${activeIntoSection === 'newProduct' ? 'active' : ''}`} onClick={() => setActiveIntoSection('newProduct')}>اضافه کردن محصول</button>
            <button className={`nav-button nav-into-button glass-button ${activeIntoSection === 'productList' ? 'active' : ''}`} onClick={() => setActiveIntoSection('productList')}>لیست محصولات</button>
          </>
        );
      case 'orderLists':
        return (
          <>
            <button className={`nav-button nav-into-button glass-button ${activeIntoSection === 'DeliveredOrderList' ? 'active' : ''}`} onClick={() => setActiveIntoSection('DeliveredOrderList')}>لیست سفارشات تحویل داده شده</button>
            <button className={`nav-button nav-into-button glass-button ${activeIntoSection === 'NotDeliveredOrderList' ? 'active' : ''}`} onClick={() => setActiveIntoSection('NotDeliveredOrderList')}>لیست سفارشات تحویل نداده شده</button>
          </>
        );
      case 'Categories':
        return (
          <>
            <button className={`nav-button nav-into-button glass-button ${activeIntoSection === 'addCategory' ? 'active' : ''}`} onClick={() => setActiveIntoSection('addCategory')}>اضافه کردن دسته‌بندی</button>
            <button className={`nav-button nav-into-button glass-button ${activeIntoSection === 'categoryList' ? 'active' : ''}`} onClick={() => setActiveIntoSection('categoryList')}>لیست دسته‌بندی‌ها</button>
          </>
        );
      default:
        return null;
    }
  };

  const renderIntoSection = () => {
    switch (activeIntoSection) {
      case 'newProduct':
        return <NewProduct />;
      case 'productList':
        return <ProductListAdmin />;
      case 'NotDeliveredOrderList':
        return <OrderList Delivered={false} />;
      case 'DeliveredOrderList':
        return <OrderList Delivered={true} />;
      case 'categoryList':
        return <CategoryList />;
      case 'addCategory':
        return <NewCategory />;
      default:
        return <NewProduct />;
    }
  };

  return (
    <>
      <nav className="admin-nav">
        <button className={`nav-button glass-button ${activeSection === 'Products' ? 'active' : ''}`} onClick={() => setActiveSection('Products')}>
          محصولات
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        </button>
        <button className={`nav-button glass-button ${activeSection === 'orderLists' ? 'active' : ''}`} onClick={() => setActiveSection('orderLists')}>
          لیست سفارشات
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        </button>
        <button className={`nav-button glass-button ${activeSection === 'Categories' ? 'active' : ''}`} onClick={() => setActiveSection('Categories')}>
          دسته‌بندی‌ها
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        </button>
      </nav>
      <div className="admin-page">
        <div className="background-blur"></div>
        <nav className="admin-into-nav">
          {renderSection()}
        </nav>
        <div className="section-container">
          {renderIntoSection()}
        </div>
      </div>
    </>
  );
}

export default AdminPage;