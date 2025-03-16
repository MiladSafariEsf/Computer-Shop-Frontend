import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/LoginForm.css';

const RegisterForm = () => {
  const [Number, setNumber] = useState('');
  const [UserName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [Address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    // اعتبارسنجی ورودی‌ها
    if (Number.trim() === '') {
      setError('فیلد شماره نمی‌تواند خالی باشد.');
      return;
    }
    if (!/^\d{11}$/.test(Number)) {
      setError('شماره موبایل باید فقط شامل اعداد و ۱۱ رقم باشد.');
      return;
    }
    if (UserName.trim() === '') {
      setError('فیلد نام کاربری نمی‌تواند خالی باشد.');
      return;
    }
    if (password.trim() === '') {
      setError('فیلد رمز عبور نمی‌تواند خالی باشد.');
      return;
    }
    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }
    if (Address == "") {
      setError('فیلد آدرس نمی‌تواند خالی باشد. ');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5195/Authorization/Register',
        {
          Number: Number,
          UserName: UserName,
          Password: password,
          Address: Address
        },
        {
          withCredentials: true // ارسال کوکی‌ها
        }
      );

      if (response.status === 200) {
        login();
        navigate('/Home');
      }
    } catch (err) {
      setError(
        'شماره موبایل وارد شده قبلاً ثبت شده است. لطفاً وارد حساب خود شوید.'
      );
    }
  };

  return (
    <div className="login-container glasss" style={{ width: '240px' }}>
      <h2 className="login-title">ثبت‌نام</h2>
      <form onSubmit={handleRegister} className="login-form">
        <div className="form-group">
          <label>شماره</label>
          <input
            type="text"
            className="form-input"
            value={Number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>نام کاربری</label>
          <input
            type="text"
            className="form-input"
            value={UserName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>آدرس منزل</label>
          <input
            type="text"
            className="form-input"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>رمز عبور</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="buy-button glass-button">
          ثبت‌نام
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
