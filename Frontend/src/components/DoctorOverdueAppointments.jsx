import { useState, useEffect } from "react"
import { doctorService } from "../services/doctorService"
import { toast } from 'react-toastify'

const DoctorOverdueAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchOverdueAppointments()
    }, [])

    const fetchOverdueAppointments = async () => {
        try {
            setLoading(true)
            const data = await doctorService.getOverdueAppointments()
            setAppointments(Array.isArray(data) ? data : [])
        } catch (err) {
            setError("Không thể tải danh sách lịch quá hạn")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (appointmentId, status) => {
        const confirmMsg = status === 'COMPLETED' 
            ? 'Đánh dấu đã hoàn thành khám?' 
            : 'Đánh dấu bệnh nhân không đến?'
        
        if (!window.confirm(confirmMsg)) return

        try {
            await doctorService.updateAppointmentStatus(appointmentId, status)
            setAppointments(prev => prev.filter(apt => apt.appointmentId !== appointmentId))
        } catch (err) {
            toast.error(err.response?.data || "Không thể cập nhật trạng thái")
        }
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    if (error) {
        return <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>{error}</div>
    }

    if (appointments.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>Không có lịch hẹn quá hạn</p>
                <p style={{ fontSize: '14px' }}>Tất cả các lịch hẹn đã được xử lý</p>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px', color: '#333' }}>Lịch hẹn quá hạn</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    Các lịch hẹn CONFIRMED đã qua ngày nhưng chưa được xử lý. Vui lòng cập nhật trạng thái.
                </p>
            </div>

            <div style={{ 
                background: '#fef3c7', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                <span style={{ color: '#92400e', fontSize: '14px' }}>
                    Có <strong>{appointments.length}</strong> lịch hẹn cần xử lý
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appointments.map(apt => (
                    <div
                        key={apt.appointmentId}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '2px solid #fbbf24'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}>
                                        {apt.patientName}
                                    </span>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        background: '#fef3c7',
                                        color: '#d97706'
                                    }}>
                                        Quá hạn
                                    </span>
                                </div>

                                <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                    <span>📅 {apt.dateWorking}</span>
                                    <span>⏰ {apt.timeSlot}</span>
                                    {apt.patientPhoneNumber && <span>📱 {apt.patientPhoneNumber}</span>}
                                </div>

                                {apt.reason && (
                                    <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f9fafb', borderRadius: '6px', fontSize: '14px' }}>
                                        <strong>Lý do khám:</strong> {apt.reason}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleUpdateStatus(apt.appointmentId, 'COMPLETED')}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#10b981',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Đã khám
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(apt.appointmentId, 'NO_SHOW')}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        border: '1px solid #6b7280',
                                        background: 'white',
                                        color: '#6b7280',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Không đến
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DoctorOverdueAppointments
