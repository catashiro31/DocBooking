import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AdminStats from "../components/AdminStats"
import AdminUsers from "../components/AdminUsers"
import AdminDoctors from "../components/AdminDoctors"
import AdminSpecialties from "../components/AdminSpecialties"
import AdminFacilities from "../components/AdminFacilities"
import AdminReviews from "../components/AdminReviews"
import AdminAppointments from "../components/AdminAppointments"
import Logo from "../components/Logo"

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("stats")
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const tabs = [
        { id: "stats", label: "Tổng quan", icon: "📊" },
        { id: "users", label: "Người dùng", icon: "👥" },
        { id: "doctors", label: "Bác sĩ", icon: "👨‍⚕️" },
        { id: "appointments", label: "Lịch hẹn", icon: "📅" },
        { id: "reviews", label: "Đánh giá", icon: "⭐" },
        { id: "specialties", label: "Chuyên khoa", icon: "🏥" },
        { id: "facilities", label: "Cơ sở y tế", icon: "🏢" }
    ]

    const handleLogout = async () => {
        await logout()
        navigate("/signin")
    }

    const renderContent = () => {
        switch (activeTab) {
            case "stats": return <AdminStats />
            case "users": return <AdminUsers />
            case "doctors": return <AdminDoctors />
            case "appointments": return <AdminAppointments />
            case "reviews": return <AdminReviews />
            case "specialties": return <AdminSpecialties />
            case "facilities": return <AdminFacilities />
            default: return <AdminStats />
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
            <style>{`
                .admin-sidebar-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 12px;
                    background: transparent;
                    color: #475569;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                .admin-sidebar-btn:hover { background: #f1f5f9; color: #6366f1; }
                .admin-sidebar-btn.active { background: #6366f1; color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
            `}</style>

            {/* Header */}
            <header style={{
                background: 'white',
                padding: '16px 40px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                sticky: 'top',
                zIndex: 100
            }}>
                <Logo onClick={() => navigate('/')} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Hệ thống quản trị</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Phiên bản 2.0 Premium</div>
                    </div>
                    <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', 
                        background: user?.avatarUrl ? `url(${user.avatarUrl}) center/cover` : '#f1f5f9',
                        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', border: '2px solid #f1f5f9'
                    }}>
                        {!user?.avatarUrl && '👑'}
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                    >
                        Đăng xuất
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, padding: '32px 40px', gap: '32px', maxWidth: '1600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                {/* Sidebar */}
                <aside style={{ width: '280px', flexShrink: 0 }}>
                    <div style={{ 
                        background: 'white', 
                        borderRadius: '24px', 
                        padding: '32px 24px', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ 
                                width: '80px', height: '80px', borderRadius: '24px', 
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
                                margin: '0 auto 16px', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', fontSize: '32px', color: 'white',
                                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                overflow: 'hidden'
                            }}>
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                         onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '👑' }} />
                                ) : "👑"}
                            </div>
                            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Quản trị viên</h3>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>{user?.email}</p>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`admin-sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <main style={{ flex: 1, minWidth: 0 }}>
                    {renderContent()}
                </main>
            </div>
        </div>
    )
}

export default AdminDashboard
