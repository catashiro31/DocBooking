import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const PatientDashboard = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const getTabFromUrl = () => {
        const path = location.pathname
        if (path.includes("history")) return "history"
        if (path.includes("relatives")) return "relatives"
        return "appointments"
    }

    const [activeTab, setActiveTab] = useState(getTabFromUrl())
    
    useEffect(() => {
        setActiveTab(getTabFromUrl())
    }, [location.pathname])

    const handleTabClick = (tabId) => {
        setActiveTab(tabId)
        navigate(`/patient/${tabId}`)
    }

    const tabs = [
        { id: "appointments", label: "Lịch hẹn", icon: "📅" },
        { id: "history", label: "Lịch sử khám", icon: "📋" },
        { id: "relatives", label: "Hồ sơ người thân", icon: "👨‍👩‍👧‍👦" }
    ]

    const handleLogout = async () => {
        await logout()
        window.location.href = "/signin"
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header className="glass" style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '12px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ 
                            margin: 0, 
                            fontSize: '24px', 
                            fontWeight: 900,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.03em'
                        }}>
                            DocBooking
                        </h1>
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Link to="/doctors" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                        🏥 Tìm bác sĩ
                    </Link>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '6px 16px',
                        background: 'rgba(99, 102, 241, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(99, 102, 241, 0.1)'
                    }}>
                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>{user?.fullName || user?.email}</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#ef4444',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '700',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', maxWidth: '1440px', margin: '0 auto', padding: '32px 40px', gap: '32px' }}>
                {/* Sidebar */}
                <aside className="reveal" style={{
                    width: '280px',
                    flexShrink: 0
                }}>
                    <div className="premium-card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '24px',
                                background: user?.avatarUrl 
                                    ? `url(${user.avatarUrl}) center/cover` 
                                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                fontSize: '28px',
                                color: 'white',
                                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                                overflow: 'hidden'
                            }}>
                                {!user?.avatarUrl && (user?.fullName?.charAt(0) || '👤')}
                            </div>
                            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800 }}>{user?.fullName || 'Bệnh nhân'}</h3>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: 500 }}>{user?.email}</p>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: activeTab === tab.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                                        color: activeTab === tab.id ? 'white' : '#475569',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: activeTab === tab.id ? '700' : '600',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        textAlign: 'left',
                                        boxShadow: activeTab === tab.id ? '0 8px 15px rgba(99, 102, 241, 0.25)' : 'none'
                                    }}
                                >
                                    <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>

                        <div style={{ margin: '24px 0', height: '1px', background: '#f1f5f9' }} />

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Link
                                to="/profile"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    color: '#64748b',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'color 0.2s'
                                }}
                            >
                                <span>⚙️</span>
                                <span>Cài đặt tài khoản</span>
                            </Link>
                            <Link
                                to="/change-password"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    color: '#64748b',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'color 0.2s'
                                }}
                            >
                                <span>🔐</span>
                                <span>Đổi mật khẩu</span>
                            </Link>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="reveal-delayed" style={{ flex: 1 }}>
                    <div className="premium-card" style={{ padding: '32px', minHeight: '600px' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default PatientDashboard
