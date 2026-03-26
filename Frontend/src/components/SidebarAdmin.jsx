import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        .sidebar-item:hover:not(.active) { background: #f5f6ff !important; color: #5f6dfc !important; transform: translateX(3px); }
        .sidebar-item.active { background: linear-gradient(135deg, #eef0ff, #e8e3ff) !important; color: #5f6dfc !important; box-shadow: 0 3px 12px rgba(95,109,252,0.13) !important; }
      `}</style>

      <div style={{
        width: '220px', minHeight: '100vh', background: '#ffffff',
        borderRight: '1px solid #e8eaf0', paddingTop: '28px',
        fontFamily: "'Nunito', sans-serif", boxShadow: '2px 0 12px rgba(95,109,252,0.05)'
      }}>

        <NavLink
          to="/admin/board"
          className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '13px 22px', margin: '4px 12px', borderRadius: '12px',
            textDecoration: 'none', color: '#4a5568', fontSize: '15px',
            fontWeight: 600, transition: 'all 0.22s ease'
          }}
        >
          <span style={{ fontSize: '19px', lineHeight: 1 }}>🏠</span>
          <p style={{ margin: 0 }}>Bảng điều khiển</p>
        </NavLink>

        <NavLink
          to="/admin/appointment"
          className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '13px 22px', margin: '4px 12px', borderRadius: '12px',
            textDecoration: 'none', color: '#4a5568', fontSize: '15px',
            fontWeight: 600, transition: 'all 0.22s ease'
          }}
        >
          <span style={{ fontSize: '19px', lineHeight: 1 }}>📅</span>
          <p style={{ margin: 0 }}>Lịch hẹn</p>
        </NavLink>

        <NavLink
          to="/admin/doctors"
          className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '13px 22px', margin: '4px 12px', borderRadius: '12px',
            textDecoration: 'none', color: '#4a5568', fontSize: '15px',
            fontWeight: 600, transition: 'all 0.22s ease'
          }}
        >
          <span style={{ fontSize: '19px', lineHeight: 1 }}>👨‍⚕️</span>
          <p style={{ margin: 0 }}>Danh sách bác sĩ</p>
        </NavLink>

      </div>
    </>
  );
};

export default Sidebar;