import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/LoginForm.css';

const ChangeName = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleChangeName = async (e) => {
        e.preventDefault();

        // اعتبارسنجی ورودی‌ها
        if (!(name && name.match(/^\s+$/) === null)) {
            setError('فیلد نام کاربری را به درستی پر کنید');
            return;
        }
        try {
            const response = await axios.put(
                'http://localhost:5195/Authorization/ChangeName',
                {
                    Name : name,
                },
                {
                    withCredentials: true // ارسال کوکی‌ها
                }
            );

            if (response.status === 200) {
                window.location.assign("/Home");
            }
        } catch (err) {
            setError(
                'مشکلی در تغیر نام کاربری پیش آمده است'
            );
        }
    };

    return (
        <div className="login-container glasss" style={{ width: '240px' }}>
            <h2 className="login-title">تغیر نام کاربری</h2>
            <form onSubmit={handleChangeName} className="login-form">
                <div className="form-group">
                    <label>نام کاربری جدید</label>
                    <input
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="buy-button glass-button">
                    ثبت
                </button>
            </form>
        </div>
    );
};

export default ChangeName;
