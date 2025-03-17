import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerProtectedRoute = ({ children }) => {
    const [isOwner, setIsOwner] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkOwner = async () => {
            try {
                const response = await fetch('http://localhost:5195/Authorization/IsOwner', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (response.status == 200) {
                    setIsOwner(true);  // دسترسی مجاز
                } else {
                    setIsOwner(false);  // دسترسی غیرمجاز
                }
            } catch (error) {
                console.error('خطا در بررسی دسترسی:', error);
                setIsOwner(false);
            }
        };

        checkOwner();
    }, []);

    if (isOwner === null) {
        return <p>در حال بررسی دسترسی...</p>;  // حالت بارگذاری
    }

    if (isOwner === false) {
        navigate('/login');  // هدایت به صفحه ورود یا خطای دسترسی
        return null;
    }

    return children;  // اگر کاربر مالک باشد، محتوا را نمایش می‌دهد
};

export default OwnerProtectedRoute;
