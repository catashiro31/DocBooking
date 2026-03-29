import React from "react";
import { NavLink } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { path: "/admin/board", icon: "🏠", label: "Bảng điều khiển" },
  { path: "/admin/users", icon: "👥", label: "Quản lý người dùng" },
  { path: "/admin/pending-doctors", icon: "⏳", label: "Phê duyệt bác sĩ" },
  { path: "/admin/doctors", icon: "👨‍⚕️", label: "Tất cả bác sĩ" },
  { path: "/admin/appointment", icon: "📅", label: "Quản lý lịch hẹn" },
  { path: "/admin/specialties", icon: "⚕️", label: "Quản lý chuyên khoa" },
  { path: "/admin/facilities", icon: "🏥", label: "Quản lý cơ sở y tế" },
  { path: "/admin/reviews", icon: "⭐", label: "Quản lý đánh giá" },
];

const Sidebar = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        .sidebar-item:hover:not(.active) { background: #f5f6ff !important; color: #5f6dfc !important; transform: translateX(3px); }
        .sidebar-item.active { background: linear-gradient(135deg, #eef0ff, #e8e3ff) !important; color: #5f6dfc !important; box-shadow: 0 3px 12px rgba(95,109,252,0.13) !important; }
      `}</style>

      <div style={{
        width: '240px', minHeight: '100vh', background: '#ffffff',
        borderRight: '1px solid #e8eaf0', paddingTop: '28px',
        fontFamily: "'Nunito', sans-serif", boxShadow: '2px 0 12px rgba(95,109,252,0.05)'
      }}>

        {SIDEBAR_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '13px 22px', margin: '4px 12px', borderRadius: '12px',
                textDecoration: 'none', color: '#4a5568', fontSize: '15px',
                fontWeight: 600, transition: 'all 0.22s ease'
              }}
            >
              <span style={{ fontSize: '19px', lineHeight: 1 }}>{item.icon}</span>
              <p style={{ margin: 0 }}>{item.label}</p>
            </NavLink>
        ))}

      </div>
    </>
  );
};

export default Sidebar;