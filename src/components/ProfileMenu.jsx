import React, { useContext, useEffect, useState, useRef } from "react";
import "../styles/ProfileMenu.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({ username: '', number: '' , isAdmin: null});

  const menuRef = useRef(null); // برای ردیابی کلیک خارج از منو

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          'http://localhost:5195/Authorization/GetUserData',
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          setUserData({
            username: response.data.username,
            number: response.data.number,
            isAdmin: response.data.isAdmin
          });
          login();
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    })();
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
        logout();
      }
    } catch (err) { }
  };

  // تابع برای مدیریت کلیک بیرون از منو
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-menu">
      {isAuthenticated ? (
        <div className="menu-container" ref={menuRef}>
          <button
            className="profile-button"
            onClick={() => setIsOpen(!isOpen)}
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
              <a onClick={handleLogout} className="ProfileMenu-btn">
                <i className="fa-solid fa-right-from-bracket"></i>{" "}
                <span style={{ cursor: "pointer" }}>خروج از حساب کاربری </span>
              </a>
              {userData.isAdmin && <Link to="/AdminDashboard" aria-label="پنل ادمین" className="ProfileMenu-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-gear" viewBox="0 0 16 16"><path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" /></svg>{" "}
                <span style={{ cursor: "pointer" }}>ورود به پنل ادمین</span>
              </Link>}
              
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
