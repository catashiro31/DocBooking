import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { doctorService } from "../services/doctorService"
import DoctorAppointments from "../components/DoctorAppointments"
import DoctorScheduleManager from "../components/DoctorScheduleManager"
import DoctorOverdueAppointments from "../components/DoctorOverdueAppointments"
import DoctorReviews from "../components/DoctorReviews"

const DoctorDashboard = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const getTabFromUrl = () => {
        const path = location.pathname
        if (path.includes("schedule")) return "schedule"
        if (path.includes("overdue")) return "overdue"
        if (path.includes("reviews")) return "reviews"
        return "appointments"
    }

    const [activeTab, setActiveTab] = useState(getTabFromUrl())
    
    useEffect(() => {
        setActiveTab(getTabFromUrl())
    }, [location.pathname])

    const handleTabClick = (tabId) => {
        setActiveTab(tabId)
        if (tabId === 'appointments') navigate('/doctor/appointments')
        if (tabId === 'schedule') navigate('/doctor/schedules')
        if (tabId === 'overdue') navigate('/doctor/overdue')
        if (tabId === 'reviews') navigate('/doctor/reviews')
    }

    const [profile, setProfile] = useState(null)
    const [overdueCount, setOverdueCount] = useState(0)
    const { user, logout } = useAuth()

    const tabs = [
        { id: "appointments", label: "Lịch hẹn", icon: "📅" },
        { id: "schedule", label: "Lịch làm việc", icon: "🗓️" },
        { id: "overdue", label: "Quá hạn", icon: "⚠️", badge: overdueCount },
        { id: "reviews", label: "Đánh giá", icon: "⭐" }
    ]

    useEffect(() => {
        fetchProfile()
        fetchOverdueCount()
    }, [])

    const fetchProfile = async () => {
        try {
            const data = await doctorService.getMyProfile()
            setProfile(data)
        } catch (err) {
            console.error("Error fetching profile:", err)
        }
    }

    const fetchOverdueCount = async () => {
        try {
            const data = await doctorService.getOverdueAppointments()
            setOverdueCount(Array.isArray(data) ? data.length : 0)
        } catch (err) {
            console.error("Error fetching overdue count:", err)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate("/signin")
    }

    const renderContent = () => {
        const isApproved = profile?.verificationStatus === 'APPROVED' || user?.verificationStatus === 'APPROVED'

        if (!isApproved) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: '400px', textAlign: 'center', padding: '40px'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                        {profile?.verificationStatus === 'PENDING' ? '⏳' : '✨'}
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
                        {profile?.verificationStatus === 'PENDING' 
                            ? 'Hồ sơ của bạn đang được duyệt' 
                            : 'Chào mừng bạn đến với DocBooking!'}
                    </h2>
                    <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                        {profile?.verificationStatus === 'PENDING'
                            ? 'Ban quản trị đang xem xét hồ sơ năng lực của bạn. Vui lòng quay lại sau khi nhận được thông báo phê duyệt.'
                            : 'Để bắt đầu nhận lịch hẹn từ bệnh nhân, bạn cần hoàn thiện hồ sơ chuyên môn và thông tin xác thực.'}
                    </p>
                    {profile?.verificationStatus !== 'PENDING' && (
                        <button
                            onClick={() => navigate('/doctor/profile')}
                            style={{
                                padding: '12px 32px', borderRadius: '12px', background: '#5f6dfc',
                                color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(95,109,252,0.3)'
                            }}
                        >
                            Bắt đầu hoàn thiện hồ sơ
                        </button>
                    )}
                </div>
            )
        }

        switch (activeTab) {
            case "appointments":
                return <DoctorAppointments />
            case "schedule":
                return <DoctorScheduleManager />
            case "overdue":
                return <DoctorOverdueAppointments />
            case "reviews":
                return <DoctorReviews />
            default:
                return <DoctorAppointments />
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
                    <span style={{ 
                        padding: '4px 12px', 
                        background: '#dbeafe', 
                        color: '#2563eb', 
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '500'
                    }}>
                        Bác sĩ
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '8px 16px',
                        background: '#f3f4f6',
                        borderRadius: '8px'
                    }}>
                        <span style={{ fontWeight: '500' }}>BS. {profile?.fullName || user?.fullName || user?.email}</span>
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
                    width: '280px',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    height: 'fit-content'
                }}>
                    {/* Profile Card */}
                    <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: profile?.avatarUrl 
                                ? `url(${profile.avatarUrl}) center/cover`
                                : 'linear-gradient(135deg, #5f6dfc, #a78bfa)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px',
                            fontSize: '36px',
                            color: 'white'
                        }}>
                            {!profile?.avatarUrl && (profile?.fullName?.charAt(0) || '👨‍⚕️')}
                        </div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>
                            BS. {profile?.fullName || user?.fullName || 'Bác sĩ'}
                        </h3>
                        <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '14px' }}>
                            {profile?.specialtyName || 'Chuyên khoa'}
                        </p>
                        {profile?.facilityName && (
                            <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px' }}>
                                📍 {profile.facilityName}
                            </p>
                        )}
                        
                        {profile?.verificationStatus === 'PENDING' && (
                            <div style={{
                                marginTop: '12px',
                                padding: '8px 12px',
                                background: '#fef3c7',
                                borderRadius: '8px',
                                fontSize: '13px',
                                color: '#92400e'
                            }}>
                                ⏳ Đang chờ phê duyệt hồ sơ
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(profile?.verificationStatus === 'APPROVED' || user?.verificationStatus === 'APPROVED') ? (
                            tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
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
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span>{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </span>
                                    {tab.badge > 0 && (
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            background: activeTab === tab.id ? 'white' : '#ef4444',
                                            color: activeTab === tab.id ? '#5f6dfc' : 'white',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div style={{
                                padding: '16px',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px dashed #cbd5e1',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 10px' }}>
                                    Tính năng quản lý sẽ mở khi hồ sơ được phê duyệt.
                                </p>
                                <button
                                    onClick={() => navigate('/doctor/profile')}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#5f6dfc',
                                        color: 'white',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {profile?.verificationStatus === 'PENDING' ? 'Xem hồ sơ' : 'Hoàn thiện hồ sơ'}
                                </button>
                            </div>
                        )}
                    </nav>

                    <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Link
                            to="/doctor/profile"
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
                            <span>👤</span>
                            <span>Hồ sơ chuyên môn</span>
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

export default DoctorDashboard
