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
            // Filter both PENDING and CONFIRMED
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
            toast.success("Đã hủy lịch hẹn thành công")
            setAppointments(prev => prev.filter(apt => apt.appointmentId !== appointmentId))
        } catch (err) {
            toast.error(err.response?.data || "Không thể hủy lịch hẹn")
        } finally {
            setCancellingId(null)
        }
    }

    const getStatusStyles = (status) => {
        switch (status) {
            case 'PENDING':
                return { 
                    bg: 'rgba(245, 158, 11, 0.1)', 
                    color: '#d97706', 
                    border: 'rgba(245, 158, 11, 0.2)',
                    text: 'Chờ xác nhận'
                }
            case 'CONFIRMED':
                return { 
                    bg: 'rgba(16, 185, 129, 0.1)', 
                    color: '#059669', 
                    border: 'rgba(16, 185, 129, 0.2)',
                    text: 'Đã xác nhận'
                }
            default:
                return { 
                    bg: '#f1f5f9', 
                    color: '#64748b', 
                    border: '#e2e8f0',
                    text: status 
                }
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton" style={{ height: '120px', width: '100%', borderRadius: '16px' }} />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="reveal" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <h3 style={{ color: '#ef4444', margin: '0 0 8px' }}>Lỗi tải dữ liệu</h3>
                <p style={{ color: '#64748b' }}>{error}</p>
                <button 
                    onClick={fetchAppointments}
                    style={{ marginTop: '16px', color: '#6366f1', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                >
                    Thử lại
                </button>
            </div>
        )
    }

    if (appointments.length === 0) {
        return (
            <div className="reveal" style={{ textAlign: 'center', padding: '80px 40px', color: '#64748b' }}>
                <div style={{ 
                    width: '80px', height: '80px', borderRadius: '50%', 
                    background: '#f1f5f9', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' 
                }}>
                    📅
                </div>
                <h3 style={{ color: '#1e293b', margin: '0 0 8px', fontSize: '20px', fontWeight: 800 }}>Bạn chưa có lịch hẹn nào</h3>
                <p style={{ margin: '0 0 24px', maxWidth: '300px', marginInline: 'auto' }}>
                    Bắt đầu chăm sóc sức khỏe của bạn bằng cách đặt lịch khám với các bác sĩ hàng đầu.
                </p>
                <a 
                    href="/doctors" 
                    style={{ 
                        display: 'inline-block',
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                    }}
                >
                    Đặt lịch ngay
                </a>
            </div>
        )
    }

    return (
        <div className="reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Lịch hẹn sắp tới</h2>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Tất cả ({appointments.length})</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {appointments.map(apt => {
                    const status = getStatusStyles(apt.bookingStatus);
                    return (
                        <div 
                            key={apt.appointmentId}
                            className="premium-card"
                            style={{
                                padding: '24px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderLeft: `4px solid ${status.color}`
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1e293b' }}>
                                        BS. {apt.doctorName}
                                    </h3>
                                    <span 
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            background: status.bg,
                                            color: status.color,
                                            border: `1px solid ${status.border}`
                                        }}
                                    >
                                        {status.text}
                                    </span>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 24px', color: '#475569', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ opacity: 0.7 }}>📅</span>
                                        <span style={{ fontWeight: '600' }}>{apt.dateWorking}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ opacity: 0.7 }}>⏰</span>
                                        <span style={{ fontWeight: '600' }}>{apt.timeSlot}</span>
                                    </div>
                                    <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ opacity: 0.7 }}>📍</span>
                                        <span style={{ color: '#64748b' }}>{apt.facilityName || 'Cơ sở chưa xác định'}</span>
                                    </div>
                                    {apt.reason && (
                                        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', marginTop: '4px' }}>
                                            <span style={{ opacity: 0.7 }}>📝</span>
                                            <span style={{ fontSize: '13px', lineHeight: 1.5 }}>{apt.reason}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ paddingLeft: '24px' }}>
                                <button
                                    onClick={() => handleCancel(apt.appointmentId)}
                                    disabled={cancellingId === apt.appointmentId}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid #fee2e2',
                                        background: '#fff',
                                        color: '#ef4444',
                                        cursor: cancellingId === apt.appointmentId ? 'not-allowed' : 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseEnter={e => {
                                        if (cancellingId !== apt.appointmentId) {
                                            e.currentTarget.style.background = '#fef2f2'
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = '#fff'
                                    }}
                                >
                                    {cancellingId === apt.appointmentId ? (
                                        <>⌛ Đang hủy...</>
                                    ) : (
                                        <>✗ Hủy lịch</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PatientAppointments
