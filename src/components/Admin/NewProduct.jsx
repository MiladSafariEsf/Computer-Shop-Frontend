import React, { useState, useEffect } from 'react';

function NewProduct() {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '', CategoriesId: '', stock: '' });
  const [categories, setCategories] = useState([]);
  const [Message, setMessage] = useState('');

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
        setMessage('محصول با موفقیت اضافه شد!');
        setTimeout(() => setMessage(''), 3000);
        setFormData({ ...formData, name: '', price: '', description: '', stock: '' });
      } else {
        setMessage('خطایی رخ داده است');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('خطا در ارسال درخواست');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="new-product glass-effect">
      <h2>محصول جدید</h2>
      {Message && <div className="success-message">{Message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            نام محصول:
            <input autoComplete='off' type="text" name="name" className="input-field glass-input" value={formData.name} onChange={handleInputChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            قیمت:
            <input autoComplete='off' type="number" name="price" className="input-field glass-input" value={formData.price} onChange={handleInputChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            توضیحات:
            <input autoComplete='off' type="text" name="description" className="input-field glass-input" value={formData.description} onChange={handleInputChange} />
          </label>
          <label>
            موجودی:
            <input autoComplete='off' type="number" name="stock" className="input-field glass-input" value={formData.stock} onChange={handleInputChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            دسته‌بندی:
            <select name="CategoriesId" style={{ background: "#fff", color: "#000" }} className="input-field glass-input" value={formData.Id} onChange={handleInputChange}>
              <option>انتخاب کنید</option>
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
