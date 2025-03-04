import React, { useState, useEffect } from 'react';
import NewProduct from '../Admin/NewProduct';
import '../../styles/AdminDashboard.css';
import ProductListAdmin from '../Admin/ProductListAdmin';
import OrderList from '../Admin/OrderList';
import CategoryList from '../Admin/CategoryList';
import NewCategory from '../Admin/NewCategory';

function AdminPage() {
  const [activeSection, setActiveSection] = useState('newProduct');

  const renderSection = () => {
    switch (activeSection) {
      case 'newProduct':
        return <NewProduct />;
      case 'productList':
        return <ProductListAdmin />;
      case 'orderList':
        return <OrderList />;
      case 'categoryList':
        return <CategoryList />;
      case 'addCategory':
        return <NewCategory />;
      default:
        return <NewProduct />;
    }
  };

  return (
    <div className="admin-page">
      <div className="background-blur"></div>
      <nav className="admin-nav">
        <button className={`nav-button glass-button ${activeSection === 'newProduct' ? 'active' : ''}`} onClick={() => setActiveSection('newProduct')}>محصول جدید</button>
        <button className={`nav-button glass-button ${activeSection === 'productList' ? 'active' : ''}`} onClick={() => setActiveSection('productList')}>لیست محصولات</button>
        <button className={`nav-button glass-button ${activeSection === 'orderList' ? 'active' : ''}`} onClick={() => setActiveSection('orderList')}> لیست سفارشات تحویل نداده شده</button>
        <button className={`nav-button glass-button ${activeSection === 'orderList' ? 'active' : ''}`} onClick={() => setActiveSection('orderList')}> لیست سفارشات تحویل داده شده</button>
        <button className={`nav-button glass-button ${activeSection === 'addCategory' ? 'active' : ''}`} onClick={() => setActiveSection('addCategory')}>اضافه کردن دسته بندی</button>
        <button className={`nav-button glass-button ${activeSection === 'categoryList' ? 'active' : ''}`} onClick={() => setActiveSection('categoryList')}>لیست دسته بندی ها</button>
      </nav>
      <div className="section-container">
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminPage