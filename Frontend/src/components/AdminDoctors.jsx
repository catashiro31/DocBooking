import { useState, useEffect } from "react"
import { adminService } from "../services/adminService"

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [rejectModal, setRejectModal] = useState({ show: false, doctor: null, reason: "" })

    useEffect(() => {
        fetchPendingDoctors()
    }, [])

    const fetchPendingDoctors = async () => {
        try {
            setLoading(true)
            const data = await adminService.getPendingDoctors()
            setDoctors(Array.isArray(data) ? data : [])
        } catch (err) {
            setError("Không thể tải danh sách bác sĩ chờ duyệt")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (doctorId) => {
        if (!window.confirm("Phê duyệt bác sĩ này?")) return

        try {
            await adminService.approveDoctor(doctorId)
            setDoctors(prev => prev.filter(d => d.doctorId !== doctorId))
        } catch (err) {
            alert(err.response?.data || "Không thể phê duyệt")
        }
    }

    const handleReject = async () => {
        if (!rejectModal.doctor) return

        try {
            await adminService.rejectDoctor(rejectModal.doctor.doctorId, rejectModal.reason)
            setRejectModal({ show: false, doctor: null, reason: "" })
            setDoctors(prev => prev.filter(d => d.doctorId !== rejectModal.doctor.doctorId))
        } catch (err) {
            alert(err.response?.data || "Không thể từ chối")
        }
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    if (error) {
        return <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>{error}</div>
    }

    if (doctors.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>Không có bác sĩ nào chờ duyệt</p>
                <p style={{ fontSize: '14px' }}>Tất cả hồ sơ đã được xử lý</p>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px', color: '#333' }}>Phê duyệt bác sĩ</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    Có {doctors.length} bác sĩ đang chờ phê duyệt hồ sơ
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {doctors.map(doctor => (
                    <div
                        key={doctor.doctorId}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #e5e7eb'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {/* Avatar */}
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '12px',
                                background: doctor.avatarUrl 
                                    ? `url(${doctor.avatarUrl}) center/cover`
                                    : 'linear-gradient(135deg, #5f6dfc, #a78bfa)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '28px',
                                flexShrink: 0
                            }}>
                                {!doctor.avatarUrl && '👨‍⚕️'}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 8px', fontSize: '18px' }}>
                                    BS. {doctor.fullName}
                                </h4>
                                
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                                    <span>📧 {doctor.email}</span>
                                    {doctor.phoneNumber && <span>📱 {doctor.phoneNumber}</span>}
                                    {doctor.specialtyName && <span>🏥 {doctor.specialtyName}</span>}
                                    {doctor.facilityName && <span>📍 {doctor.facilityName}</span>}
                                </div>

                                {doctor.bio && (
                                    <p style={{ margin: '0 0 12px', color: '#4b5563', fontSize: '14px', lineHeight: 1.5 }}>
                                        {doctor.bio}
                                    </p>
                                )}

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleApprove(doctor.doctorId)}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: '#10b981',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        ✓ Phê duyệt
                                    </button>
                                    <button
                                        onClick={() => setRejectModal({ show: true, doctor, reason: "" })}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: '8px',
                                            border: '1px solid #ef4444',
                                            background: 'white',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        ✗ Từ chối
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reject Modal */}
            {rejectModal.show && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setRejectModal({ show: false, doctor: null, reason: "" })}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            maxWidth: '400px',
                            width: '90%'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 16px' }}>Từ chối hồ sơ</h3>
                        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                            Từ chối hồ sơ của: <strong>BS. {rejectModal.doctor?.fullName}</strong>
                        </p>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Lý do từ chối
                            </label>
                            <textarea
                                value={rejectModal.reason}
                                onChange={e => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Nhập lý do từ chối (không bắt buộc)..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    minHeight: '80px',
                                    resize: 'vertical',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setRejectModal({ show: false, doctor: null, reason: "" })}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReject}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#ef4444',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDoctors
