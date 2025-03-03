import React, { useState, useEffect } from 'react';

function ProductListAdmin() {
  const [products, setProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', price: '', description: '' });
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await fetch('http://localhost:5195/Data/GetProductCount', {
          credentials: 'include',
        });
        if (response.ok) {
          const count = await response.json();
          setTotalPages(Math.ceil(count / 10));
        }
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    };

    fetchProductCount();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5195/Data/GetAllProduct?PageNumber=${pageNumber}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProducts();
  }, [pageNumber]);

  const toggleDetails = (productId) => {
    setExpandedProducts((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5195/Data/DeleteProduct?ProductId=${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
        setSuccessMessage("'محصول با موفقیت حذف شد!'"); // نمایش پیام
        setTimeout(() => setSuccessMessage(""),3000); // حذف پیام بعد از 2 ثانیه
      } else {
        setSuccessMessage("'خطایی در حذف محصول رخ داد'"); // نمایش پیام
        setTimeout(() => setSuccessMessage(""),3000); // حذف پیام بعد از 2 ثانیه
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('مشکلی در ارتباط با سرور رخ داد.'); // نمایش پیام
      setTimeout(() => setSuccessMessage(""),3000); // حذف پیام بعد از 2 ثانیه
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setEditFormData({ name: product.name, price: product.price, description: product.description });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditFormData({ ...editFormData, image: files[0] });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editFormData.name);
    formData.append("price", editFormData.price);
    formData.append("description", editFormData.description);
    if (editFormData.image) {
      formData.append("image", editFormData.image);
    }

    try {
      const response = await fetch(`http://localhost:5195/Data/UpdateProduct?ProductId=${editingProduct}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        setProducts(products.map((product) =>
          product.id === editingProduct ? { ...product, ...editFormData } : product
        ));
        setEditingProduct(null);
        setSuccessMessage("محصول با موفقیت ویرایش شد!"); // نمایش پیام
        setTimeout(() => setSuccessMessage(""),3000); // حذف پیام بعد از 2 ثانیه
      } else {
        setSuccessMessage('خطایی در ویرایش محصول رخ داد'); // نمایش پیام
        setTimeout(() => setSuccessMessage(""),3000); // حذف پیام بعد از 2 ثانیه
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage("'مشکلی در ارتباط با سرور رخ داد.'"); // نمایش پیام
      setTimeout(() => setSuccessMessage(""),3000); // حذف پیام بعد از 2 ثانیه
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
      <h2>لیست محصولات</h2>
      <ul className="product-list-container">
        {products.map((product) => (
          <li key={product.id} className="list-item">
            {editingProduct === product.id ? (
              <form className="edit-form" onSubmit={handleEditSubmit} encType="multipart/form-data">
                <label className="file-input-label" style={{ margin: "3px" }}>
                  نام محصول :
                  <input type="text" name="name" className="edit-input glass-input" value={editFormData.name} onChange={handleEditChange} />
                </label>
                <label className="file-input-label" style={{ margin: "3px" }}>
                  قیمت محصول :
                  <input type="number" name="price" className="edit-input glass-input" value={editFormData.price} onChange={handleEditChange} />
                </label>
                <label className="file-input-label" style={{ margin: "3px" }}>
                  توضیحات :
                  <input type="text" name="description" className="edit-input glass-input" value={editFormData.description} onChange={handleEditChange} />
                </label>
                <label className="file-input-label" style={{ margin: "3px" }}>
                  تصویر محصول:
                  <input type="file" name="image" className="input-field glass-input file-input" accept="image/*"
                    style={{ backgroundColor: "transparent" }} onChange={handleEditChange} />
                </label>
                <br/>
                <button type="submit" className="edit-delete-button glass-button">ذخیره</button>
                <button type="button" className="edit-delete-button glass-button" onClick={() => setEditingProduct(null)}>لغو</button>
              </form>
            ) : (
              <div className="product-details">
                <p>نام: {product.name}</p>
                <p>قیمت: {product.price}</p>
                <span className="details-toggle" onClick={() => toggleDetails(product.id)}>توضیحات بیشتر</span>
                {expandedProducts[product.id] && <p className="description-admin">{product.description}</p>}
                <div className="product-actions">
                  <button className="edit-delete-button glass-button" onClick={() => handleEditClick(product)}>ویرایش</button>
                  <button className="edit-delete-button glass-button" onClick={() => handleDelete(product.id)}>حذف</button>
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
export default ProductListAdmin