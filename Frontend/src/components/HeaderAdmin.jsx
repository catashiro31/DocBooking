import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HeaderAdmin.css";
import logo from "../images/logoAdmin.png";

const HeaderAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 👉 xoá thông tin đăng nhập
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    // 👉 chuyển về login
    navigate("/login");
  };

  return (
    <div className="header-admin">

      <div className="header-left">
        <img src={logo} alt="logo" className="logo" />
      </div>

      <div className="header-center">
        <span className="admin-badge">Admin</span>
      </div>

      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </div>
  );
};

export default HeaderAdmin;