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
            // Backend trả về Page object hoặc Array tùy version, unwrap nếu cần
            const list = data?.content || data || []
            setAppointments(list)
        } catch (err) {
            setError("Không thể tải danh sách lịch hẹn")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const getStatusStyle = (status) => {
        const styles = {
            'PENDING': { background: '#fef3c7', color: '#d97706' },
            'CONFIRMED': { background: '#dbeafe', color: '#2563eb' },
            'COMPLETED': { background: '#dcfce7', color: '#16a34a' },
            'CANCELLED': { background: '#fee2e2', color: '#dc2626' },
            'NO_SHOW': { background: '#f3f4f6', color: '#6b7280' }
        }
        return styles[status] || { background: '#f3f4f6', color: '#6b7280' }
    }

    const filteredAppointments = filter === 'ALL' 
        ? appointments 
        : appointments.filter(apt => apt.bookingStatus === filter)

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>Quản lý lịch hẹn toàn hệ thống</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: filter === s ? 'none' : '1px solid #d1d5db',
                                background: filter === s ? '#5f6dfc' : 'white',
                                color: filter === s ? 'white' : '#374151',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {s === 'ALL' ? 'Tất cả' : s}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Bệnh nhân</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Bác sĩ</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Ngày/Giờ</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Cơ sở</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map(apt => (
                            <tr key={apt.appointmentId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ fontWeight: '600' }}>{apt.patientName}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.patientPhoneNumber}</div>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ fontWeight: '500' }}>BS. {apt.doctorName}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.specialtyName}</div>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <div>{apt.dateWorking}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.timeSlot}</div>
                                </td>
                                <td style={{ padding: '12px', color: '#64748b' }}>{apt.facilityName || '---'}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        ...getStatusStyle(apt.bookingStatus)
                                    }}>
                                        {apt.bookingStatus}
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
