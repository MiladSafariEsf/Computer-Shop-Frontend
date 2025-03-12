import React, { useState, useEffect } from 'react';

function NewProduct() {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: null, CategoriesId: '' , stock : null});
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // دریافت دسته‌بندی‌ها از API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5195/GetData/GetAllCategory');
        if (response.ok) {
          const data = await response.json();
          setCategories(data); // فرض بر این است که داده‌های دسته‌بندی‌ها آرایه‌ای از اشیاء با {id, name} است.
        } else {
          alert('خطا در دریافت دسته‌بندی‌ها');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('خطا در دریافت دسته‌بندی‌ها');
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('Name', formData.name);
    form.append('Price', formData.price);
    form.append('Description', formData.description);
    form.append('Image', formData.image);
    form.append('CategoriesId', formData.CategoriesId); // اضافه کردن دسته‌بندی به داده‌ها
    form.append('stock', formData.stock); // اضافه کردن دسته‌بندی به داده‌ها

    try {
      const response = await fetch('http://localhost:5195/AddData/AddProduct', {
        method: 'POST',
        credentials: 'include',
        body: form,
      });

      if (response.ok) {
        setSuccessMessage('محصول با موفقیت اضافه شد!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setFormData({ name: '', price: '', description: '', image: null, CategoriesId: '' ,stock: null});
      } else {
        alert('خطایی رخ داده است');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در ارسال درخواست');
    }
  };

  return (
    <div className="new-product glass-effect">
      <h2>محصول جدید</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            نام محصول:
            <input type="text" name="name" className="input-field glass-input" value={formData.name} onChange={handleInputChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            قیمت:
            <input type="number" name="price" className="input-field glass-input" value={formData.price} onChange={handleInputChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            توضیحات:
            <input type="text" name="description" className="input-field glass-input" value={formData.description} onChange={handleInputChange} />
          </label>
          <label>
            موجودی:
            <input type="text" name="stock" className="input-field glass-input" value={formData.stock} onChange={handleInputChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            دسته‌بندی:
            <select name="CategoriesId" style={{background : "#fff", color : "#000"}} className="input-field glass-input" value={formData.Id} onChange={handleInputChange}>
              <option selected>انتخاب کنید</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label className="file-input-label">
            تصویر محصول:
            <input type="file" name="image" className="input-field glass-input file-input" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
        <div className="form-group">
          <button type="submit" className="glass-button add-pro-btn">افزودن محصول</button>
        </div>
      </form>
    </div>
  );
}

export default NewProduct;
