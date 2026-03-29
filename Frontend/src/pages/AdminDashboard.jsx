import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AdminStats from "../components/AdminStats"
import AdminUsers from "../components/AdminUsers"
import AdminDoctors from "../components/AdminDoctors"
import AdminSpecialties from "../components/AdminSpecialties"
import AdminFacilities from "../components/AdminFacilities"
import AdminReviews from "../components/AdminReviews"

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("stats")
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const tabs = [
        { id: "stats", label: "Tổng quan", icon: "📊" },
        { id: "users", label: "Người dùng", icon: "👥" },
        { id: "doctors", label: "Phê duyệt BS", icon: "👨‍⚕️" },
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
            case "stats":
                return <AdminStats />
            case "users":
                return <AdminUsers />
            case "doctors":
                return <AdminDoctors />
            case "reviews":
                return <AdminReviews />
            case "specialties":
                return <AdminSpecialties />
            case "facilities":
                return <AdminFacilities />
            default:
                return <AdminStats />
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
                        background: '#fef3c7', 
                        color: '#d97706', 
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '500'
                    }}>
                        Admin
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
                    width: '240px',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    height: 'fit-content'
                }}>
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px',
                            fontSize: '28px'
                        }}>
                            👑
                        </div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>Quản trị viên</h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{user?.email}</p>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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
                                    fontSize: '14px',
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

export default AdminDashboard
