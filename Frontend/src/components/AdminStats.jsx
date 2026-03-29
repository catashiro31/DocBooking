import { useState, useEffect } from "react"
import { adminService } from "../services/adminService"

const AdminStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const data = await adminService.getStats()
            setStats({
                totalUsers: data.totalUsers ?? 0,
                totalDoctors: data.totalDoctors ?? 0,
                totalPatients: data.totalPatients ?? 0,
                totalAppointments: data.totalAppointments ?? 0,
                totalReviews: data.totalReviews ?? 0,
                pendingDoctors: data.pendingDoctors ?? 0,
                todayAppointments: data.todayAppointments ?? 0
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    const mainCards = [
        { label: 'Tổng Bác sĩ', value: stats?.totalDoctors || 0, icon: '👨‍⚕️', color: '#10b981' },
        { label: 'Tổng Lịch hẹn', value: stats?.totalAppointments || 0, icon: '📅', color: '#6366f1' },
        { label: 'Tổng Đánh giá', value: stats?.totalReviews || 0, icon: '⭐', color: '#f59e0b' },
    ]

    const secondaryStats = [
        { label: 'Người dùng', value: stats?.totalUsers || 0, icon: '👥' },
        { label: 'Bệnh nhân', value: stats?.totalPatients || 0, icon: '🏥' },
        { label: 'Bác sĩ chờ duyệt', value: stats?.pendingDoctors || 0, icon: '⏳', color: '#ef4444' },
        { label: 'Hẹn khám hôm nay', value: stats?.todayAppointments || 0, icon: '📊' }
    ]

    return (
        <div>
            <h3 style={{ margin: '0 0 24px', color: '#333', fontSize: '20px', fontWeight: '800' }}>Tổng quan hệ thống</h3>

            {/* Hàng 3 mục chính */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '20px',
                marginBottom: '32px'
            }}>
                {mainCards.map((card, index) => (
                    <div
                        key={index}
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid #eef2ff',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: card.color }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</p>
                                <p style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>
                                    {card.value.toLocaleString()}
                                </p>
                            </div>
                            <span style={{ fontSize: '40px' }}>{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Các chỉ số phụ */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '16px',
                marginBottom: '32px'
            }}>
                {secondaryStats.map((card, index) => (
                    <div
                        key={index}
                        style={{
                            background: '#f8fafc',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>{card.icon}</span>
                        <div>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>{card.label}</p>
                            <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: card.color || '#334155' }}>
                                {card.value.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ 
                background: 'linear-gradient(135deg, #1e293b, #334155)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}>
                <h4 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#fbbf24' }}>⚡</span> Thông báo nhanh
                </h4>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '14px', lineHeight: '1.6' }}>
                    Hiện có <strong style={{color: '#fbbf24'}}>{stats?.pendingDoctors || 0} bác sĩ</strong> đang chờ được phê duyệt hồ sơ. 
                    Vui lòng kiểm tra mục "Phê duyệt BS" để xử lý kịp thời.
                </p>
            </div>
        </div>
    )
}

export default AdminStats
