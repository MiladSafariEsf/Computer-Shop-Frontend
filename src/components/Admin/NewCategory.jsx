import React, { useState } from 'react';

function NewCategory() {
  const [formData, setFormData] = useState({ categoryName: '' });
  const [successMessage, setSuccessMessage] = useState('');

  // مدیریت تغییرات ورودی
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ارسال داده‌ها به سرور
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const categoryData = { CategoryName: formData.categoryName };

    try {
      const response = await fetch('http://localhost:5195/AddData/AddCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
        credentials: 'include',
      });

      if (response.ok) {
        setSuccessMessage('دسته‌بندی جدید با موفقیت اضافه شد!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setFormData({ categoryName: '' }); // پس از ارسال فرم، فیلدها را پاک کنید
      } else {
        alert('خطا در ارسال درخواست');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در ارسال درخواست');
    }
  };

  return (
    <div className="new-category glass-effect">
      <h2>دسته‌بندی جدید</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            نام دسته‌بندی:
            <input
              type="text"
              name="categoryName"
              className="input-field glass-input"
              value={formData.categoryName}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="form-group">
          <button type="submit" className="glass-button add-pro-btn">
            افزودن دسته‌بندی
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewCategory;
