import { useState, useEffect } from "react"
import { patientService, unwrapPage } from "../services/patientService"
import { toast } from 'react-toastify'

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [cancellingId, setCancellingId] = useState(null)

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const data = await patientService.getMyAppointments(0, 100)
            const list = unwrapPage(data)
            const active = list.filter(apt => ['PENDING', 'CONFIRMED'].includes(apt.bookingStatus))
            setAppointments(active)
        } catch (err) {
            setError("Không thể tải danh sách lịch hẹn")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (appointmentId) => {
        if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return

        setCancellingId(appointmentId)
        try {
            await patientService.cancelAppointment(appointmentId)
            setAppointments(prev => prev.filter(apt => apt.appointmentId !== appointmentId))
        } catch (err) {
            toast.error(err.response?.data || "Không thể hủy lịch hẹn")
        } finally {
            setCancellingId(null)
        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return { background: '#fef3c7', color: '#d97706' }
            case 'CONFIRMED':
                return { background: '#dbeafe', color: '#2563eb' }
            default:
                return { background: '#f3f4f6', color: '#6b7280' }
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xác nhận'
            case 'CONFIRMED': return 'Đã xác nhận'
            default: return status
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
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>Bạn chưa có lịch hẹn nào</p>
                <a href="/doctors" style={{ color: '#5f6dfc' }}>Đặt lịch khám ngay</a>
            </div>
        )
    }

    return (
        <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Lịch hẹn của bạn</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {appointments.map(apt => (
                    <div 
                        key={apt.appointmentId}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontWeight: '600', fontSize: '16px' }}>
                                    BS. {apt.doctorName}
                                </span>
                                <span 
                                    style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        ...getStatusStyle(apt.bookingStatus)
                                    }}
                                >
                                    {getStatusText(apt.bookingStatus)}
                                </span>
                            </div>
                            
                            <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div>📅 {apt.dateWorking} - {apt.timeSlot}</div>
                                <div>📍 {apt.facilityName || 'Chưa xác định'}</div>
                                {apt.reason && <div>📝 Lý do: {apt.reason}</div>}
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={() => handleCancel(apt.appointmentId)}
                                disabled={cancellingId === apt.appointmentId}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ef4444',
                                    background: 'white',
                                    color: '#ef4444',
                                    cursor: cancellingId === apt.appointmentId ? 'not-allowed' : 'pointer',
                                    opacity: cancellingId === apt.appointmentId ? 0.5 : 1,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => {
                                    if (cancellingId !== apt.appointmentId) {
                                        e.target.style.background = '#ef4444'
                                        e.target.style.color = 'white'
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.target.style.background = 'white'
                                    e.target.style.color = '#ef4444'
                                }}
                            >
                                {cancellingId === apt.appointmentId ? 'Đang hủy...' : 'Hủy lịch'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PatientAppointments
