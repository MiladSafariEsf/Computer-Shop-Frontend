import React, { useState, useEffect } from "react";
import "../../styles/OwnerPanel.css";
import axios from "axios";


const UserList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [message, setMessage] = useState("");
    const [apiUrl, setApiUrl] = useState("http://localhost:5195/GetData/GetAllUser");
    const [apiParams, setApiParams] = useState({ PageNumber: 1 })

    const fetchData = async () => {
        try {
            const response = await axios.get(apiUrl, { params: { ...apiParams, PageNumber: page }, withCredentials: true });
            setUsers(response.data.users);
            { response.data.count > 0 && setTotalPages(Math.ceil(response.data.count / 10)) };
        } catch (error) {
            setMessage("مشکلی در ارتباط با سرور رخ داد");
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, apiUrl, apiParams]);

    const HandelSearch = async () => {
        try {
            setPage(1);
            if (search == "") {
                setApiUrl("http://localhost:5195/GetData/GetAllUser");
                setApiParams({ PageNumber: page });
            }
            else {
                setApiUrl("http://localhost:5195/GetData/SearchUsers");
                setApiParams({ Search: search });
            }
        } catch (error) {
            setMessage("جست و جو به مشکل برخورد")
            setTimeout(() => {
                setMessage('')
            }, 3000);
        }
    }
    const toggleAdmin = async (Number) => {
        try {
            var r = await axios.put("http://localhost:5195/Authorization/TuggleAdmin", null, { params: { Number: Number }, withCredentials: true });

            setUsers((prevUsers) =>
                prevUsers.map((users) =>
                    users.number === Number ? { ...users, role: users.role === "Admin" ? "User" : "Admin" } : users
                )
            );
        } catch (error) {
            setMessage("تغیر رول به مشکل برخورد")
            setTimeout(() => {
                setMessage('')
            }, 3000);
        }

    };

    return (
        <div className="Ouser-management-container mt-4">
            <h2 className="text-white">لیست کاربران</h2>
            {message != "" && <p className="text-white">{message}</p>}
            <input
                type="text"
                placeholder="جستجو..."
                value={search}
                className="Osearch-box"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && HandelSearch()}
            />
            <div className="Ouser-table">
                {users.map((user) => (
                    <div key={user.id} className="Ouser-card m-3">
                        <p className="Op">نام: {user.userName}</p>
                        <p className="Op">شماره: {user.number}</p>
                        <p className="Op">وضعیت: {user.role == "Admin" ? "ادمین" : "کاربر"}</p>
                        <button className="Otoggle-btn" onClick={() => toggleAdmin(user.number)}>
                            {user.role == "Admin" ? "تنزل به کاربر" : "ارتقا به ادمین"}
                        </button>
                    </div>
                ))}
            </div>
            <div className="Opagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    قبلی
                </button>
                <span>
                    {page} از {totalPages}
                </span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                    بعدی
                </button>
            </div>
        </div>
    );
};

export default UserList;
