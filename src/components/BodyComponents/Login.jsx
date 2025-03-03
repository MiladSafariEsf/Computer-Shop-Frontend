import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/LoginForm.css';
import ReCAPTCHA from "react-google-recaptcha";
const LoginForm = () => {
  const [Number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
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
    if (password.trim() === '') {
      setError('فیلد رمز عبور نمی‌تواند خالی باشد.');
      return;
    }
    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5195/Authorization/Login',
        {
          Number: Number,
          Password: password
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
      setError(' شماره مبایل یا رمز عبور اشتباه است.');
    }
  };
  //capcha
  //   const [captchaValue, setCaptchaValue] = useState(null);
  //   const [message, setMessage] = useState("");

  //   const handleCaptcha = (value) => {
  //     setCaptchaValue(value);
  //     console.log("کد کپچا:", value);
  //   };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
      
  //     if (!captchaValue) {
  //       setMessage("لطفاً تأیید کنید که ربات نیستید!");
  //       return;
  //     }

  //   setMessage("ورود موفقیت‌آمیز بود ✅");
  //   // در اینجا می‌توانی درخواست ورود را به API بفرستی
  // };
  return (
    <div className="login-container glasss" style={{ width: '240px' }}>
      <h2 className="login-title">ورود</h2>
      <form onSubmit={handleLogin} className="login-form">
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
          ورود
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
