import { useState, useEffect } from "react"
import { adminService } from "../services/adminService"
import { toast } from 'react-toastify'

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [filter, setFilter] = useState("ALL")

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const data = await adminService.getAppointments()
            const list = data?.content || data || []
            setAppointments(Array.isArray(list) ? list : [])
        } catch (err) {
            setError("Không thể tải danh sách lịch hẹn")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const getStatusStyle = (status) => {
        const styles = {
            'PENDING': { background: '#fff7ed', color: '#ea580c', border: '#ffedd5', label: 'Chờ duyệt' },
            'CONFIRMED': { background: '#eff6ff', color: '#2563eb', border: '#dbeafe', label: 'Đã xác nhận' },
            'COMPLETED': { background: '#f0fdf4', color: '#16a34a', border: '#dcfce7', label: 'Hoàn thành' },
            'CANCELLED': { background: '#fef2f2', color: '#dc2626', border: '#fee2e2', label: 'Đã hủy' },
            'NO_SHOW': { background: '#f8fafc', color: '#64748b', border: '#f1f5f9', label: 'Vắng mặt' }
        }
        return styles[status] || { background: '#f8fafc', color: '#64748b', border: '#f1f5f9', label: status }
    }

    const filteredAppointments = filter === 'ALL' 
        ? appointments 
        : appointments.filter(apt => apt.bookingStatus === filter)

    const SkeletonRow = () => (
        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '24px' }}><div className="skeleton-box" style={{ width: '140px' }} /></td>
            <td style={{ padding: '24px' }}><div className="skeleton-box" style={{ width: '160px' }} /></td>
            <td style={{ padding: '24px' }}><div className="skeleton-box" style={{ width: '120px' }} /></td>
            <td style={{ padding: '24px' }}><div className="skeleton-box" style={{ width: '180px' }} /></td>
            <td style={{ padding: '24px' }}><div className="skeleton-box" style={{ width: '100px', borderRadius: '12px' }} /></td>
        </tr>
    )

    return (
        <div className="admin-view-transition">
            <style>{`
                .admin-view-transition {
                    animation: slideUp 0.4s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .filter-tab {
                    padding: 8px 16px;
                    border-radius: 10px;
                    border: 1px solid transparent;
                    background: transparent;
                    color: #64748b;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .filter-tab:hover {
                    color: #1e293b;
                    background: #f1f5f9;
                }
                .filter-tab.active {
                    background: #ffffff;
                    color: #4f46e5;
                    border-color: #e2e8f0;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .data-card {
                    background: #ffffff;
                    border-radius: 24px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
                    overflow: hidden;
                }

                .premium-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .premium-table th {
                    padding: 16px 24px;
                    background: #f8fafc;
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    border-bottom: 1px solid #f1f5f9;
                }
                .premium-table td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    font-size: 14px;
                }
                .premium-table tr:last-child td {
                    border-bottom: none;
                }
                .premium-table tr:hover {
                    background: #fafbfc;
                }

                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 12px;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 700;
                    border: 1px solid;
                }

                .skeleton-box {
                    height: 18px;
                    background: #f1f5f9;
                    border-radius: 4px;
                    position: relative;
                    overflow: hidden;
                }
                .skeleton-box::after {
                    content: "";
                    position: absolute;
                    top: 0; right: 0; bottom: 0; left: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Lịch hẹn hệ thống</h2>
                    <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#64748b' }}>Quản lý và giám sát tất cả các lượt đăng ký khám bệnh toàn sàn</p>
                </div>
                
                <div style={{ display: 'flex', background: '#f1f5f9', padding: '6px', borderRadius: '14px', gap: '4px' }}>
                    {[
                        { id: 'ALL', label: 'Tất cả' },
                        { id: 'PENDING', label: 'Chờ duyệt' },
                        { id: 'CONFIRMED', label: 'Xác nhận' },
                        { id: 'COMPLETED', label: 'Hoàn thành' },
                        { id: 'CANCELLED', label: 'Đã hủy' },
                        { id: 'NO_SHOW', label: 'Vắng mặt' }
                    ].map(s => (
                        <button
                            key={s.id}
                            onClick={() => setFilter(s.id)}
                            className={`filter-tab ${filter === s.id ? 'active' : ''}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="data-card">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Bệnh nhân</th>
                            <th>Bác sĩ chuyên khoa</th>
                            <th>Thời gian khám</th>
                            <th>Cơ sở y tế</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array(6).fill(0).map((_, i) => <SkeletonRow key={i} />)
                        ) : filteredAppointments.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '80px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📅</div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>Không có lịch hẹn nào thỏa mãn bộ lọc</div>
                                </td>
                            </tr>
                        ) : filteredAppointments.map(apt => (
                            <tr key={apt.appointmentId}>
                                <td>
                                    <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{apt.patientName}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                        {apt.patientPhone || 'N/A'}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>BS. {apt.doctorName}</div>
                                    <div style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 700 }}>{apt.specialtyName}</div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>{apt.dateWorking}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.timeSlot}</div>
                                </td>
                                <td style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                                    {apt.facilityName || '---'}
                                </td>
                                <td>
                                    <span 
                                        className="status-pill"
                                        style={{
                                            background: getStatusStyle(apt.bookingStatus).background,
                                            color: getStatusStyle(apt.bookingStatus).color,
                                            borderColor: getStatusStyle(apt.bookingStatus).border
                                        }}
                                    >
                                        {getStatusStyle(apt.bookingStatus).label}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminAppointments
