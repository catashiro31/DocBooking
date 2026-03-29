import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import PatientAppointments from "../components/PatientAppointments"
import PatientHistory from "../components/PatientHistory"
import RelativeManagement from "../components/RelativeManagement"

const PatientDashboard = () => {
    const location = useLocation()
    const navigate = useNavigate()

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
        if (tabId === 'appointments') navigate('/patient/appointments')
        if (tabId === 'history') navigate('/patient/history')
        if (tabId === 'relatives') navigate('/patient/relatives')
    }

    const { user, logout } = useAuth()

    const tabs = [
        { id: "appointments", label: "Lịch hẹn", icon: "📅" },
        { id: "history", label: "Lịch sử khám", icon: "📋" },
        { id: "relatives", label: "Hồ sơ người thân", icon: "👨‍👩‍👧‍👦" }
    ]

    const handleLogout = async () => {
        await logout()
        window.location.href = "/signin"
    }

    const renderContent = () => {
        switch (activeTab) {
            case "appointments":
                return <PatientAppointments />
            case "history":
                return <PatientHistory />
            case "relatives":
                return <RelativeManagement />
            default:
                return <PatientAppointments />
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fb' }}>
            {/* Header */}
            <header style={{
                background: 'white',
                padding: '16px 40px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ 
                            margin: 0, 
                            fontSize: '24px', 
                            background: 'linear-gradient(135deg, #5f6dfc, #a78bfa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            DocBooking
                        </h1>
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link to="/doctors" style={{ color: '#5f6dfc', textDecoration: 'none' }}>
                        Đặt lịch khám
                    </Link>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '8px 16px',
                        background: '#f3f4f6',
                        borderRadius: '8px'
                    }}>
                        <span style={{ fontWeight: '500' }}>{user?.fullName || user?.email}</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                background: '#ef4444',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '13px'
                            }}
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '30px 40px', gap: '30px' }}>
                {/* Sidebar */}
                <aside style={{
                    width: '260px',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    height: 'fit-content'
                }}>
                    <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #5f6dfc, #a78bfa)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px',
                            fontSize: '32px',
                            color: 'white'
                        }}>
                            {user?.fullName?.charAt(0) || '👤'}
                        </div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>{user?.fullName || 'Bệnh nhân'}</h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{user?.email}</p>
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
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: activeTab === tab.id ? '#5f6dfc' : 'transparent',
                                    color: activeTab === tab.id ? 'white' : '#374151',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    fontWeight: activeTab === tab.id ? '500' : '400',
                                    transition: 'all 0.2s',
                                    textAlign: 'left'
                                }}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Link
                            to="/profile"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                color: '#374151',
                                textDecoration: 'none',
                                fontSize: '15px'
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
                                color: '#374151',
                                textDecoration: 'none',
                                fontSize: '15px'
                            }}
                        >
                            <span>🔐</span>
                            <span>Đổi mật khẩu</span>
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1 }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        minHeight: '500px'
                    }}>
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default PatientDashboard
