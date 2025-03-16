import React, { useState, useEffect } from 'react';

function CategoryListAdmin() {
  const [categories, setCategories] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({ categoryName: '' });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCategoryCount = async () => {
      try {
        const response = await fetch('http://localhost:5195/GetData/GetCategoryCount', {
          credentials: 'include',
        });
        if (response.ok) {
          const count = await response.json();
          setTotalPages(Math.ceil(count / 10));
        }
      } catch (error) {
        console.error('Error fetching category count:', error);
      }
    };

    fetchCategoryCount();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:5195/GetData/GetAllCategory?PageNumber=${pageNumber}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCategories();
  }, [pageNumber]);

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5195/DeleteData/DeleteCategoryById?CategoryId=${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== categoryId));
        setSuccessMessage("دسته‌بندی با موفقیت حذف شد!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setSuccessMessage("خطایی در حذف دسته‌بندی رخ داد");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage("مشکلی در ارتباط با سرور رخ داد.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category.id);
    setEditFormData({ categoryName: category.categoryName });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryName", editFormData.categoryName);

    try {
      const response = await fetch(`http://localhost:5195/EditData/UpdateCategory?CategoryId=${editingCategory}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",  
        },
        body: JSON.stringify({ categoryName: editFormData.categoryName }), 
      });

      if (response.ok) {
        setCategories(categories.map((category) =>
          category.id === editingCategory ? { ...category, ...editFormData } : category
        ));
        setEditingCategory(null);
        setSuccessMessage("دسته‌بندی با موفقیت ویرایش شد!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setSuccessMessage('خطایی در ویرایش دسته‌بندی رخ داد');
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage("مشکلی در ارتباط با سرور رخ داد.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const nextPage = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  const prevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  return (
    <div className="product-list glass-effect">
      {successMessage && <p className="success-message">{successMessage}</p>}
      <h2>لیست دسته‌بندی‌ها</h2>
      <ul className="product-list-container">
        {categories.map((category) => (
          <li key={category.id} className="list-item">
            {editingCategory === category.id ? (
              <form className="edit-form" onSubmit={handleEditSubmit}>
                <label className="file-input-label" style={{ margin: "3px" }}>
                  نام دسته‌بندی :
                  <input type="text" name="categoryName" className="edit-input glass-input" value={editFormData.categoryName} onChange={handleEditChange} />
                </label>
                <br/>
                <button type="submit" className="edit-delete-button glass-button">ذخیره</button>
                <button type="button" className="edit-delete-button glass-button" onClick={() => setEditingCategory(null)}>لغو</button>
              </form>
            ) : (
              <div className="product-details">
                <p>نام: {category.categoryName}</p>
                <div className="product-actions">
                  <button className="edit-delete-button glass-button" onClick={() => handleEditClick(category)}>ویرایش</button>
                  <button className="edit-delete-button glass-button" onClick={() => handleDelete(category.id)}>حذف</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={pageNumber === 1} className="glass-button after-before-buttons">قبلی</button>
        <span className="page-indicator" style={{display: "flex", margin: "5px", alignItems: "center"}}>صفحه {pageNumber} از {totalPages}</span>
        <button onClick={nextPage} disabled={pageNumber >= totalPages} className="glass-button after-before-buttons">بعدی</button>
      </div>
    </div>
  );
}

export default CategoryListAdmin;