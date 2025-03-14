import React, { useState, useEffect } from 'react';

function BannerListAdmin() {
    const [banners, setBanners] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [editingBanner, setEditingBanner] = useState(null);
    const [editFormData, setEditFormData] = useState({ banerName: '', image: null });
    const [successMessage, setSuccessMessage] = useState("");
    const [IsActive, setIsActive] = useState(true)
    useEffect(() => {
        const fetchBannerCount = async () => {
            try {
                const response = await fetch('http://localhost:5195/GetData/GetBannerCount', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const count = await response.json();
                    setTotalPages(Math.ceil(count / 10));
                }
            } catch (error) {
                console.error('Error fetching banner count:', error);
            }
        };
        fetchBannerCount();
    }, []);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch(`http://localhost:5195/GetData/GetAllBannersAdmin?PageNumber=${pageNumber}`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setBanners(data);
                } else {
                    console.error('Failed to fetch banners');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchBanners();
    }, [pageNumber]);

    const HandleActiveChange = () => {
        if (IsActive) {
            setIsActive(false)
        }
        else {
            setIsActive(true)
        }
    }

    const handleDelete = async (bannerId) => {
        try {
            const response = await fetch(`http://localhost:5195/DeleteData/DeleteBannerById?BannerId=${bannerId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                setBanners(banners.filter((banner) => banner.id !== bannerId));
                setSuccessMessage("بنر با موفقیت حذف شد!");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setSuccessMessage("خطایی در حذف بنر رخ داد");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('مشکلی در ارتباط با سرور رخ داد.');
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handleEditClick = (banner) => {
        setEditingBanner(banner.id);
        setIsActive(banner.isActive)
        setEditFormData({ banerName: banner.banerName, image: null });
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
        formData.append("BannerName", editFormData.banerName);
        formData.append("IsActive", IsActive.toString());
        if (editFormData.image) {
            formData.append("Image", editFormData.image);
        }

        try {
            const response = await fetch(`http://localhost:5195/EditData/UpdateBanner?BannerId=${editingBanner}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });

            // گرفتن پاسخ به صورت JSON
            const responseData = await response.json();

            if (response.ok) {
                setBanners(banners.map((banner) =>
                    banner.id === editingBanner ? { ...banner, banerName: editFormData.banerName, isActive: IsActive, banerImageUrl: responseData.url } : banner
                ));
                setEditingBanner(null);
                setSuccessMessage("بنر با موفقیت ویرایش شد!");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setSuccessMessage('خطایی در ویرایش بنر رخ داد');
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage("مشکلی در ارتباط با سرور رخ داد.");
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    return (
        <div className="banner-list glass-effect">
            {successMessage && <p className="success-message">{successMessage}</p>}
            <h2>لیست بنرها</h2>
            <ul className="banner-list-container">
                {banners.map((banner) => (
                    <li key={banner.id} className="list-item">
                        {editingBanner === banner.id ? (
                            <form className="edit-form" onSubmit={handleEditSubmit} encType="multipart/form-data">
                                <label>نام بنر:
                                    <input type="text" name="banerName" className="edit-input glass-input" value={editFormData.banerName} onChange={handleEditChange} />
                                </label>
                                <label>تصویر بنر:
                                    <input type="file" name="image" className="input-field glass-input file-input" accept="image/*" onChange={handleEditChange} />
                                </label>
                                <div className="form-group">
                                    <button type="button" onClick={HandleActiveChange} className="glass-button add-pro-btn mt-2">{IsActive ? <>غیر فعال کردن بنر</> : <>فعال کردن بنر</>}</button>
                                </div>
                                <button type="submit" className="edit-delete-button glass-button">ذخیره</button>
                                <button type="button" className="edit-delete-button glass-button" onClick={() => setEditingBanner(null)}>لغو</button>
                            </form>
                        ) : (
                            <div className="banner-details">
                                <p>نام: {banner.banerName}</p>
                                <p>وضعیت: {banner.isActive ? <>فعال</> : <>غیر فعال</>}</p>
                                <img
                                    src={`http://localhost:5195/GetData/GetBanerImageByPath?filePath=${banner.banerImageUrl.split('/').pop()}`}
                                    alt={banner.banerName}
                                    className="banner-image"
                                />

                                <div className="banner-actions">
                                    <button className="edit-delete-button glass-button" onClick={() => handleEditClick(banner)}>ویرایش</button>
                                    <button className="edit-delete-button glass-button" onClick={() => handleDelete(banner.id)}>حذف</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default BannerListAdmin;
