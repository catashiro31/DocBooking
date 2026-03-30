import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <>
      <style>{`
        .admin-header {
          height: 80px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: flex-end; /* Align items to the right */
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-profile-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px;
          padding-left: 12px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-profile-header:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .user-info {
          text-align: right;
        }

        .user-name {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          display: block;
        }

        .user-role {
          font-size: 11px;
          font-weight: 600;
          color: #6366f1;
          background: #eef2ff;
          padding: 1px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
        }

        .logout-btn-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #fff;
          border: 1px solid #fee2e2;
          color: #ef4444;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn-header:hover {
          background: #ef4444;
          color: #fff;
          border-color: #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
      `}</style>

      <header className="admin-header">
        <div className="header-actions">
          <div className="user-profile-header" onClick={() => navigate('/profile')}>
            <div className="user-info">
              <span className="user-name">{user?.fullName || "Quản trị viên"}</span>
              <span className="user-role">ADMIN</span>
            </div>
            <div className="user-avatar" style={{ overflow: 'hidden' }}>
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerText = (user?.fullName || "A").charAt(0);
                  }}
                />
              ) : (
                (user?.fullName || "A").charAt(0)
              )}
            </div>
          </div>

          <button className="logout-btn-header" onClick={handleLogout}>
            <span>Đăng xuất</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>
    </>
  );
};

export default HeaderAdmin;