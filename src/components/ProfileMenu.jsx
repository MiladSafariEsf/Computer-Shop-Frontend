import React, { useContext, useEffect, useState } from "react";
import "../styles/ProfileMenu.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  // State برای ذخیره اطلاعات کاربر
  const [userData, setUserData] = useState({ username: '', number: '' });

  useEffect(() => {  
    (async () => {
      try {
        const response = await axios.post(
          'http://localhost:5195/Authorization/GetUserData',
          {},
          { withCredentials: true }
        );
  
        if (response.status === 200) {
          // ذخیره اطلاعات کاربر در state
          setUserData({
            username: response.data.username,
            number: response.data.number
          });
  
          login(); // بعد از دریافت موفق اطلاعات، کاربر را احراز هویت کنید
        } else {
          logout();
        }
  
      } catch (err) {
        logout();
      }
    })(); // اجرای تابع خود اجرایی
  }, [isAuthenticated]);
  
  // تابع برای خروج از سیستم
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5195/Authorization/Logout',
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("کاربر با موفقیت خارج شد.");
        logout(); // خروج کاربر از حالت احراز هویت
      }
    } catch (err) {
    }
  };

  return (
    <div className="profile-menu">
      {isAuthenticated ? (
        <div className="menu-container">
          <button
            className="profile-button"
            onClick={toggleMenu}
            aria-label="پروفایل"
          >
            <i className="fa-solid fa-user"></i>
          </button>
          {isOpen && (
            <div className="dropdown glass">
              <div className="user-info">
                <span>{userData.username}</span>
                <span className="user-status">{userData.number}</span>
              </div>
              <hr />
              <a
                onClick={handleLogout}
                className="logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>{" "}
                <span>خروج از حساب کاربری</span>
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="auth-links">
          <Link to="/Register" aria-label="ثبت‌نام" className="auth-button">
            ثبت‌نام
          </Link>
          <Link to="/Login" aria-label="ورود" className="auth-button">
            ورود
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
