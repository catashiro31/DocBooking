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
            setStats(data)
        } catch (err) {
            console.error("Error fetching stats:", err)
            setStats({
                totalUsers: 0,
                totalDoctors: 0,
                totalPatients: 0,
                totalAppointments: 0,
                pendingDoctors: 0,
                todayAppointments: 0
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    const statCards = [
        { label: 'Tổng người dùng', value: stats?.totalUsers || 0, icon: '👥', color: '#5f6dfc' },
        { label: 'Bác sĩ', value: stats?.totalDoctors || 0, icon: '👨‍⚕️', color: '#10b981' },
        { label: 'Bệnh nhân', value: stats?.totalPatients || 0, icon: '🏥', color: '#f59e0b' },
        { label: 'Tổng lịch hẹn', value: stats?.totalAppointments || 0, icon: '📅', color: '#8b5cf6' },
        { label: 'Chờ duyệt', value: stats?.pendingDoctors || 0, icon: '⏳', color: '#ef4444' },
        { label: 'Hôm nay', value: stats?.todayAppointments || 0, icon: '📊', color: '#06b6d4' }
    ]

    return (
        <div>
            <h3 style={{ margin: '0 0 24px', color: '#333' }}>Tổng quan hệ thống</h3>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                gap: '16px',
                marginBottom: '32px'
            }}>
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #e5e7eb'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '14px' }}>{card.label}</p>
                                <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: card.color }}>
                                    {card.value.toLocaleString()}
                                </p>
                            </div>
                            <span style={{ fontSize: '32px' }}>{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ 
                background: 'linear-gradient(135deg, #5f6dfc, #a78bfa)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white'
            }}>
                <h4 style={{ margin: '0 0 16px' }}>Hoạt động gần đây</h4>
                <p style={{ margin: 0, opacity: 0.9 }}>
                    Hệ thống đang hoạt động bình thường. Có {stats?.pendingDoctors || 0} bác sĩ đang chờ phê duyệt.
                </p>
            </div>
        </div>
    )
}

export default AdminStats
