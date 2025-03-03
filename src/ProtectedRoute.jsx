import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('http://localhost:5195/Authorization/IsAdmin', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (response.ok) {
                    setIsAdmin(true);  // دسترسی مجاز
                } else {
                    setIsAdmin(false);  // دسترسی غیرمجاز
                }
            } catch (error) {
                console.error('خطا در بررسی دسترسی:', error);
                setIsAdmin(false);
            }
        };

        checkAdmin();
    }, []);

    if (isAdmin === null) {
        return <p>در حال بررسی دسترسی...</p>;  // حالت بارگذاری
    }

    if (isAdmin === false) {
        navigate('/login');  // هدایت به صفحه ورود یا خطای دسترسی
        return null;
    }

    return children;  // اگر کاربر ادمین باشد، محتوا را نمایش می‌دهد
};

export default ProtectedRoute;
