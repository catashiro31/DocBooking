import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { useState, useRef, useEffect } from 'react';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.hdr {
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  font-family: 'Inter', -apple-system, sans-serif;
  transition: all 0.3s ease;
  height: 80px;
  display: flex;
  align-items: center;
}

.hdr.scrolled {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  height: 72px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.hdr-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ===== Logo ===== */
.hdr-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
  flex-shrink: 0;
}

.hdr-logo-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  transition: transform 0.3s ease;
}
.hdr-logo:hover .hdr-logo-icon { transform: rotate(-5deg) scale(1.05); }

.hdr-logo-text {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
}

/* ===== Nav links ===== */
.hdr-nav-wrap {
  display: flex;
  align-items: center;
  flex: 1;
}

.hdr-nav {
  display: flex;
  list-style: none;
  gap: 8px;
  margin: 0 auto;
  padding: 0;
}

.hdr-nav a {
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  padding: 10px 18px;
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.hdr-nav a:hover { color: #6366f1; background: rgba(99, 102, 241, 0.05); }
.hdr-nav a.active { color: #6366f1; background: rgba(99, 102, 241, 0.08); }

/* ===== Auth buttons ===== */
.hdr-auth { display: flex; gap: 12px; align-items: center; }

.hdr-btn-login {
  padding: 10px 20px;
  border-radius: 12px;
  background: transparent;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-family: inherit;
}
.hdr-btn-login:hover { color: #6366f1; background: rgba(99, 102, 241, 0.05); }

.hdr-btn-register {
  padding: 10px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(99,102,241,0.25);
}
.hdr-btn-register:hover { box-shadow: 0 8px 20px rgba(99,102,241,0.4); transform: translateY(-2px); }

/* ===== User menu ===== */
.hdr-user { position: relative; }

.hdr-user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border: 1.5px solid #e5e7eb;
  border-radius: 30px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.hdr-user-btn:hover { border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(99,102,241,0.1); }

.hdr-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  overflow: hidden;
}
.hdr-avatar-gradient { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.hdr-avatar img { width: 100%; height: 100%; object-fit: cover; }

.hdr-user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.hdr-user-name {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hdr-user-role {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
}

.hdr-chevron { color: #9ca3af; transition: transform 0.2s; }
.hdr-chevron.open { transform: rotate(180deg); }

/* ===== Dropdown ===== */
.hdr-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border: 1px solid #f0f0f5;
  overflow: hidden;
  z-index: 300;
  animation: hdrDropIn 0.2s ease;
}

@keyframes hdrDropIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.hdr-dd-header {
  padding: 16px;
  background: #fafbfe;
  border-bottom: 1px solid #f0f0f5;
  display: flex;
  align-items: center;
  gap: 12px;
}

.hdr-dd-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  overflow: hidden;
}

.hdr-dd-name { font-size: 14px; font-weight: 600; color: #1f2937; }
.hdr-dd-email { font-size: 12px; color: #9ca3af; margin-top: 2px; word-break: break-all; }

.hdr-dd-section { padding: 6px 8px; }

.hdr-dd-label {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 6px 8px 4px;
}

.hdr-dd-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  font-family: inherit;
  text-align: left;
  box-sizing: border-box;
}
.hdr-dd-item:hover { background: #f5f3ff; color: #6366f1; }

.hdr-dd-item-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 15px;
}

.hdr-dd-divider { height: 1px; background: #f0f0f5; margin: 2px 8px; }

.hdr-dd-item.logout { color: #ef4444; }
.hdr-dd-item.logout:hover { background: #fef2f2; color: #dc2626; }

/* ===== Mobile ===== */
.hdr-mobile-toggle { display: none; background: none; border: none; cursor: pointer; padding: 4px; }
.hdr-hamburger { display: flex; flex-direction: column; gap: 5px; }
.hdr-hamburger span { display: block; width: 22px; height: 2px; background: #374151; border-radius: 2px; transition: 0.3s; }
.hdr-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hdr-hamburger.open span:nth-child(2) { opacity: 0; }
.hdr-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.hdr-overlay { display: none; }

@media (max-width: 1024px) {
  .hdr-container { padding: 0 28px; }
  .hdr-nav { gap: 8px; }
  .hdr-nav a { padding: 6px 10px; font-size: 13px; }
  .hdr-auth { gap: 6px; }
  .hdr-btn-login, .hdr-btn-register { padding: 8px 12px; font-size: 12px; }
}

@media (max-width: 900px) {
  .hdr-container { padding: 0 20px; }
  .hdr-mobile-toggle { display: block; z-index: 202; }
  .hdr-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; opacity: 0; visibility: hidden; transition: 0.3s; }
  .hdr-overlay.show { opacity: 1; visibility: visible; }
  .hdr-nav-wrap {
    position: fixed; top: 0; right: -300px; width: 280px; height: 100vh;
    background: #fff; z-index: 201; padding: 72px 20px 24px;
    display: flex; flex-direction: column; gap: 12px;
    transition: right 0.3s; overflow-y: auto;
  }
  .hdr-nav-wrap.show { right: 0; }
  .hdr-nav { flex-direction: column; gap: 4px; margin: 0; }
  .hdr-nav a { font-size: 15px; padding: 12px 14px; }
  .hdr-auth { flex-direction: column; gap: 8px; width: 100%; }
  .hdr-btn-login, .hdr-btn-register { width: 100%; text-align: center; }
  .hdr-user { width: 100%; }
  .hdr-user-btn { width: 100%; justify-content: center; }
  .hdr-dropdown { width: 100%; left: 0; right: 0; }
}
`;

// Role labels
const ROLE_LABELS = {
  PATIENT: 'Bệnh nhân',
  DOCTOR: 'Bác sĩ',
  ADMIN: 'Quản trị viên'
};

// Patient menu items
const PATIENT_MENU = [
  { icon: '📅', label: 'Lịch hẹn của tôi', path: '/patient/appointments', bg: '#eef2ff' },
  { icon: '📋', label: 'Lịch sử khám bệnh', path: '/patient/history', bg: '#f0fdf4' },
  { icon: '👨‍👩‍👧', label: 'Hồ sơ người thân', path: '/patient/relatives', bg: '#fff7ed' },
  { icon: '🏥', label: 'Cơ sở y tế', path: '/facilities', bg: '#fef2f2' },
  { icon: '👨‍⚕️', label: 'Tìm bác sĩ', path: '/doctors', bg: '#f5f3ff' },
];

// Doctor menu items
const DOCTOR_MENU = [
  { icon: '📅', label: 'Lịch hẹn bệnh nhân', path: '/doctor/appointments', bg: '#eef2ff' },
  { icon: '🗓️', label: 'Lịch làm việc', path: '/doctor/schedules', bg: '#f0fdf4' },
  { icon: '📝', label: 'Trả kết quả khám', path: '/doctor/results', bg: '#fff7ed' },
  { icon: '👤', label: 'Hồ sơ bác sĩ', path: '/doctor/profile', bg: '#f5f3ff' },
];

const DOCTOR_PENDING_MENU = [
  { icon: '⏳', label: 'Hồ sơ đang duyệt', path: '/doctor/profile', bg: '#fffbeb' },
];

const DOCTOR_UNVERIFIED_MENU = [
  { icon: '✨', label: 'Hoàn thiện hồ sơ', path: '/doctor/profile', bg: '#fef2f2' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const ddRef = useRef(null);

  // Scroll listener for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDdOpen(false);
    setMobileOpen(false);
    navigate('/signin');
  };

  const handleNav = (path) => {
    setDdOpen(false);
    setMobileOpen(false);
    navigate(path);
  };

  const getInitial = () => {
    return (user?.fullName || user?.email || '?').charAt(0).toUpperCase();
  };

  const isLoggedIn = isAuthenticated();
  
  let roleMenu = PATIENT_MENU;
  if (user?.role === 'DOCTOR') {
    if (user?.verificationStatus === 'APPROVED') {
      roleMenu = DOCTOR_MENU;
    } else if (user?.verificationStatus === 'PENDING') {
      roleMenu = DOCTOR_PENDING_MENU;
    } else {
      roleMenu = DOCTOR_UNVERIFIED_MENU;
    }
  }

  return (
    <>
      <style>{css}</style>
      <header className={`hdr ${scrolled ? 'scrolled' : ''}`}>
        <div className="hdr-container">
          {/* Logo */}
          <Logo onClick={() => navigate('/')} />


          {/* Mobile toggle */}
          <button className="hdr-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            <div className={`hdr-hamburger ${mobileOpen ? 'open' : ''}`}>
              <span /><span /><span />
            </div>
          </button>

          {/* Overlay */}
          <div className={`hdr-overlay ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)} />

          {/* Nav wrap */}
          <div className={`hdr-nav-wrap ${mobileOpen ? 'show' : ''}`}>
            {/* Nav links */}
            <ul className="hdr-nav">
              <li><NavLink to="/" end onClick={() => setMobileOpen(false)}>Trang chủ</NavLink></li>
              <li><NavLink to="/doctors" onClick={() => setMobileOpen(false)}>Bác sĩ</NavLink></li>
              <li><NavLink to="/about" onClick={() => setMobileOpen(false)}>Về chúng tôi</NavLink></li>
              <li><NavLink to="/contact" onClick={() => setMobileOpen(false)}>Liên hệ</NavLink></li>
            </ul>

            {/* Auth area */}
            {isLoggedIn ? (
              <div className="hdr-user" ref={ddRef}>
                <button className="hdr-user-btn" onClick={() => setDdOpen(!ddOpen)}>
                  <div className={`hdr-avatar ${!user?.avatarUrl ? 'hdr-avatar-gradient' : ''}`}>
                    {user?.avatarUrl
                      ? <img src={user.avatarUrl} alt="" />
                      : getInitial()
                    }
                  </div>
                  <div className="hdr-user-info">
                    <span className="hdr-user-name">{user?.fullName || 'Người dùng'}</span>
                    <span className="hdr-user-role">{ROLE_LABELS[user?.role] || user?.role}</span>
                  </div>
                  <svg className={`hdr-chevron ${ddOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown */}
                {ddOpen && (
                  <div className="hdr-dropdown">
                    {/* User header */}
                    <div className="hdr-dd-header">
                      <div className={`hdr-dd-avatar ${!user?.avatarUrl ? 'hdr-avatar-gradient' : ''}`}>
                        {user?.avatarUrl
                          ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : getInitial()
                        }
                      </div>
                      <div>
                        <div className="hdr-dd-name">{user?.fullName || 'Người dùng'}</div>
                        <div className="hdr-dd-email">{user?.email}</div>
                      </div>
                    </div>

                    {/* Role-specific menu */}
                    {user?.role !== 'ADMIN' && (
                      <div className="hdr-dd-section">
                        <div className="hdr-dd-label">
                          {user?.role === 'DOCTOR' ? 'Quản lý' : 'Dịch vụ'}
                        </div>
                        {roleMenu.map(item => (
                          <button
                            key={item.path}
                            className="hdr-dd-item"
                            onClick={() => handleNav(item.path)}
                          >
                            <div className="hdr-dd-item-icon" style={{ background: item.bg }}>
                              {item.icon}
                            </div>
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Admin shortcut */}
                    {user?.role === 'ADMIN' && (
                      <div className="hdr-dd-section">
                        <div className="hdr-dd-label">Quản trị</div>
                        <button className="hdr-dd-item" onClick={() => handleNav('/admin/board')}>
                          <div className="hdr-dd-item-icon" style={{ background: '#eef2ff' }}>📊</div>
                          Bảng điều khiển
                        </button>
                      </div>
                    )}

                    <div className="hdr-dd-divider" />

                    {/* Account section */}
                    <div className="hdr-dd-section">
                      <div className="hdr-dd-label">Tài khoản</div>
                      <button className="hdr-dd-item" onClick={() => handleNav('/profile')}>
                        <div className="hdr-dd-item-icon" style={{ background: '#f0f9ff' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        Thông tin cá nhân
                      </button>
                      <button className="hdr-dd-item" onClick={() => handleNav('/change-password')}>
                        <div className="hdr-dd-item-icon" style={{ background: '#fef3c7' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                        Đổi mật khẩu
                      </button>
                    </div>

                    <div className="hdr-dd-divider" />

                    {/* Logout */}
                    <div className="hdr-dd-section" style={{ paddingBottom: 8 }}>
                      <button className="hdr-dd-item logout" onClick={handleLogout}>
                        <div className="hdr-dd-item-icon" style={{ background: '#fef2f2' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                        </div>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hdr-auth">
                <NavLink to="/signin" className="hdr-btn-login">Đăng nhập</NavLink>
                <NavLink to="/register" className="hdr-btn-register">Tạo tài khoản</NavLink>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
