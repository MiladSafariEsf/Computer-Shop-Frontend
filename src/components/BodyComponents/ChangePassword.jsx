import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginForm.css';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRPassword, setRNewPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // اعتبارسنجی ورودی‌ها
        if (oldPassword.trim() === '') {
            setError('فیلد رمز عبور قبلی نمی‌تواند خالی باشد.');
            return;
        }
        else if (oldPassword.length < 8) {
            setError('رمز عبور قبلی حداقل ۸ کاراکتر دارد.');
            return;
        }

        else if (newPassword.trim() === '') {
            setError('فیلد رمز عبور جدید نمی‌تواند خالی باشد.');
            return;
        }
        else if (newPassword.length < 8) {
            setError('رمز عبور جدید حداقل ۸ کاراکتر دارد.');
            return;
        }

        else if (newRPassword.trim() === '') {
            setError('فیلد تکرار رمز عبور جدید نمی‌تواند خالی باشد.');
            return;
        }
        else if (newRPassword.length < 8) {
            setError('فیلد تکرار رمز عبور جدید باید حداقل ۸ کاراکتر داشته باشد.');
            return;
        }


        try {
            const response = await axios.put(
                'http://localhost:5195/Authorization/ChangePassword',
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                },
                {
                    withCredentials: true // ارسال کوکی‌ها
                }
            );

            if (response.status === 200) {
                navigate('/Home');
            }
        } catch (err) {
            setError(
                'مشکلی در تغیر رمز عبور پیش آمده است'
            );
        }
    };

    return (
        <div className="login-container glasss" style={{ width: '240px' }}>
            <h2 className="login-title">تغیر رمز عبور</h2>
            <form onSubmit={handleChangePassword} className="login-form">
                <div className="form-group">
                    <label>رمز عبور قبلی</label>
                    <input
                        type="password"
                        className="form-input"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>رمز عبور جدید</label>
                    <input
                        type="password"
                        className="form-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>تکرار رمز عبور جدید</label>
                    <input
                        type="password"
                        className="form-input"
                        value={newRPassword}
                        onChange={(e) => setRNewPassword(e.target.value)}
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

export default ChangePassword;
