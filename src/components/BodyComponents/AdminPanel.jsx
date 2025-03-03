import React, { useState, useEffect } from 'react';
import NewProduct from '../Admin/NewProduct';
import '../../styles/AdminDashboard.css';
import ProductListAdmin from '../Admin/ProductListAdmin';
import OrderList from '../Admin/OrderList';

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
        <button className={`nav-button glass-button ${activeSection === 'orderList' ? 'active' : ''}`} onClick={() => setActiveSection('orderList')}>لیست سفارشات</button>
      </nav>
      <div className="section-container">
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminPage