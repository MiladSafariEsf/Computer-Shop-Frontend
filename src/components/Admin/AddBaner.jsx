import React, { useState } from 'react';

function NewBanner() {
  const [formData, setFormData] = useState({ name: '', image: null });
  const [Message, setMessage] = useState('');
  const [IsActive , setIsActive] = useState(true)

  const HandleActiveChange = () => {
    if (IsActive) {
        setIsActive(false)
    }
    else {
        setIsActive(true)
    }
  }

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
    form.append('Image', formData.image);
    form.append("IsActive", IsActive)

    try {
      const response = await fetch('http://localhost:5195/AddData/AddBaner', {
        method: 'POST',
        credentials: 'include',
        body: form,
      });

      if (response.ok) {
        setMessage('بنر با موفقیت اضافه شد!');
        setTimeout(() => setMessage(''), 3000);
        setFormData({...formData , name: ''});
      } else {
        setMessage('خطایی رخ داده است');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('خطایی رخ داده است');
      setTimeout(() => setMessage(''), 3000);
      
    }
  };

  return (
    <div className="new-banner glass-effect">
      <h2>بنر جدید</h2>
      {Message && <div className="success-message">{Message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            نام بنر:
            <input autoComplete='off' type="text" name="name" className="input-field glass-input" value={formData.name} onChange={handleInputChange} />
          </label>
        </div>
        <div className="form-group">
          <label className="file-input-label">
            تصویر بنر:
            <input type="file" name="image" className="input-field glass-input file-input" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
        <div className="form-group">
          <button type="button" onClick={HandleActiveChange} className="glass-button add-pro-btn">{IsActive ? <>غیر فعال کردن بنر</> : <>فعال کردن بنر</>}</button>
        </div>
        <div className="form-group">
          <button type="submit" className="glass-button add-pro-btn">افزودن بنر</button>
        </div>
      </form>
    </div>
  );
}

export default NewBanner;