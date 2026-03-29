import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        .logout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(95,109,252,0.4) !important; }
      `}</style>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 36px', height: '68px', background: '#ffffff',
        borderBottom: '1px solid #e8eaf0', boxShadow: '0 2px 12px rgba(95,109,252,0.07)',
        fontFamily: "'Nunito', sans-serif", position: 'sticky', top: 0, zIndex: 100
      }}>

        {/* Left */}
        <Logo size="normal" onClick={() => navigate('/admin/board')} />

        {/* Center */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <span style={{
            padding: '7px 22px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #eef0ff, #e8e3ff)',
            color: '#5f6dfc', fontSize: '14px', fontWeight: 700,
            fontFamily: "'Nunito', sans-serif", letterSpacing: '0.5px',
            border: '1.5px solid #c7ccff'
          }}>
            Quản trị viên
          </span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            className="logout-btn"
            onClick={handleLogout}
            style={{
              padding: '9px 24px', border: 'none', borderRadius: '24px',
              background: 'linear-gradient(135deg, #5f6dfc, #a78bfa)',
              color: 'white', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
              fontWeight: 700, fontSize: '14px', letterSpacing: '0.3px',
              boxShadow: '0 4px 14px rgba(95,109,252,0.3)', transition: 'all 0.25s ease'
            }}
          >
            Đăng xuất
          </button>
        </div>

      </div>
    </>
  );
};

export default HeaderAdmin;