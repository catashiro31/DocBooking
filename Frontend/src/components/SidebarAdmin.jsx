import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/SidebarAdmin.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/admin/board" className="item">
        <span>🏠</span>
        <p>Dashboard</p>
      </NavLink>

      <NavLink to="/admin/appointment" className="item">
        <span>📅</span>
        <p>Appointments</p>
      </NavLink>

      <NavLink to="/admin/doctors" className="item">
        <span>👨‍⚕️</span>
        <p>Doctors List</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;