import React from "react";
import { Routes, Route } from "react-router-dom";

import HeaderAdmin from "../components/HeaderAdmin";
import Sidebar from "../components/SidebarAdmin";
import Dashboard from "../components/Dashboard";
import Appointments from "../components/Appointments";
import DoctorsListAdmin from "../components/DoctorsListAdmin";

import "../styles/Admin.css";

const Admin = () => {
  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <Sidebar />

      <div className="admin-main">
        
        {/* Header */}
        <HeaderAdmin />

        {/* Content */}
        <div className="admin-content">
          <Routes>
            <Route path="/board" element={<Dashboard />} />
            <Route path="/appointment" element={<Appointments />} />
            <Route path="/doctors" element={<DoctorsListAdmin />} />
          </Routes>
        </div>

      </div>
    </div>
  );
};

export default Admin;