import React from "react";
import { NavLink } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { path: "/admin/board", icon: "📊", label: "Bảng điều khiển", section: "Tổng quan" },
  { path: "/admin/users", icon: "👥", label: "Quản lý người dùng", section: "Hệ thống" },
  { path: "/admin/pending-doctors", icon: "⏳", label: "Phê duyệt bác sĩ", section: "Hệ thống" },
  { path: "/admin/appointment", icon: "📅", label: "Quản lý lịch hẹn", section: "Hệ thống" },
  { path: "/admin/specialties", icon: "⚕️", label: "Quản lý chuyên khoa", section: "Dữ liệu" },
  { path: "/admin/facilities", icon: "🏥", label: "Quản lý cơ sở y tế", section: "Dữ liệu" },
  { path: "/admin/reviews", icon: "⭐", label: "Quản lý đánh giá", section: "Dữ liệu" },
  { path: "/profile", icon: "👤", label: "Hồ sơ cá nhân", section: "Tài khoản" },
];

const Sidebar = () => {
  const sections = [...new Set(SIDEBAR_ITEMS.map(item => item.section))];

  return (
    <>
      <style>{`
        .admin-sidebar {
          width: 280px;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .sidebar-header {
          padding: 32px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-logo {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
        }

        .sidebar-logo-text {
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.02em;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0 16px 32px;
        }

        .sidebar-nav::-webkit-scrollbar { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }

        .sidebar-section-title {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 24px 12px 8px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          margin: 2px 0;
          border-radius: 12px;
          text-decoration: none;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-link:hover {
          background: #f8fafc;
          color: #1e293b;
          transform: translateX(4px);
        }

        .sidebar-link.active {
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 600;
        }

        .sidebar-icon {
          font-size: 18px;
          width: 24px;
          display: flex;
          justify-content: center;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid #f1f5f9;
        }

        .admin-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          background: #f1f5f9;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          gap: 6px;
        }
      `}</style>

      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="sidebar-logo-text">DocBooking</span>
        </div>

        <div className="sidebar-nav">
          {sections.map(section => (
            <div key={section}>
              <div className="sidebar-section-title">{section}</div>
              {SIDEBAR_ITEMS.filter(item => item.section === section).map(item => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="admin-badge">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
            Hệ thống Quản trị
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;