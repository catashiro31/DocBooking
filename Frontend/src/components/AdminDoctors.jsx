import { useState, useEffect } from "react"
import { adminService } from "../services/adminService"
import { toast } from 'react-toastify'

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [detailModal, setDetailModal] = useState({ show: false, data: null, loading: false })
    const [rejectModal, setRejectModal] = useState({ show: false, doctor: null, reason: "" })

    useEffect(() => {
        fetchPendingDoctors()
    }, [])

    const handleViewDetail = async (doctorId) => {
        try {
            setDetailModal({ show: true, data: null, loading: true })
            const data = await adminService.getDoctorDetail(doctorId)
            setDetailModal({ show: true, data, loading: false })
        } catch (err) {
            toast.error("Không thể tải chi tiết hồ sơ")
            setDetailModal({ show: false, data: null, loading: false })
        }
    }

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
            setDetailModal({ show: false, data: null, loading: false })
        } catch (err) {
            toast.error(err.response?.data || "Không thể phê duyệt")
        }
    }

    const handleReject = async () => {
        if (!rejectModal.doctor) return

        try {
            await adminService.rejectDoctor(rejectModal.doctor.doctorId, rejectModal.reason)
            setRejectModal({ show: false, doctor: null, reason: "" })
            setDoctors(prev => prev.filter(d => d.doctorId !== rejectModal.doctor.doctorId))
            setDetailModal({ show: false, data: null, loading: false })
        } catch (err) {
            toast.error(err.response?.data || "Không thể từ chối")
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ margin: '0 0 8px', fontSize: '18px' }}>
                                        BS. {doctor.user?.fullName || doctor.fullName || "Đang cập nhật..."}
                                    </h4>
                                    <button
                                        onClick={() => handleViewDetail(doctor.doctorId)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #5f6dfc',
                                            background: '#f5f6ff',
                                            color: '#5f6dfc',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        📄 Xem hồ sơ
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                                    <span>📧 {doctor.user?.email || doctor.email || "N/A"}</span>
                                    {(doctor.user?.phoneNumber || doctor.phoneNumber) && <span>📱 {doctor.user?.phoneNumber || doctor.phoneNumber}</span>}
                                    {(doctor.specialty?.specialtyName || doctor.specialtyName) && <span>🏥 {doctor.specialty?.specialtyName || doctor.specialtyName}</span>}
                                    {(doctor.facility?.facilityName || doctor.facilityName) && <span>📍 {doctor.facility?.facilityName || doctor.facilityName}</span>}
                                </div>

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
                                        ✓ Duyệt nhanh
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

            {/* Detail Modal */}
            {detailModal.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001, padding: '20px'
                }} onClick={() => setDetailModal({ show: false, data: null, loading: false })}>
                    <div style={{
                        background: 'white', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '30px'
                    }} onClick={e => e.stopPropagation()}>
                        {detailModal.loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải chi tiết...</div>
                        ) : detailModal.data && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                                    <h2 style={{ margin: 0, fontSize: '22px' }}>Chi tiết Hồ sơ Bác sĩ</h2>
                                    <button onClick={() => setDetailModal({ show: false, data: null, loading: false })} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    {/* Left: Info */}
                                    <div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{ margin: '0 0 10px', color: '#374151', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Thông tin cá nhân</h4>
                                            <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Họ tên:</strong> {detailModal.data?.user?.fullName}</p>
                                            <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Email:</strong> {detailModal.data?.user?.email}</p>
                                            <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>SĐT:</strong> {detailModal.data?.user?.phoneNumber || 'Không có'}</p>
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{ margin: '0 0 10px', color: '#374151', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Chuyên môn & Công tác</h4>
                                            <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Bằng cấp:</strong> {detailModal.data.degree}</p>
                                            <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Kinh nghiệm:</strong> {detailModal.data.experienceYears} năm</p>
                                            <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Giá khám:</strong> {Number(detailModal.data.price).toLocaleString('vi-VN')} VNĐ</p>
                                            <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Chuyên khoa:</strong> {detailModal.data.specialty?.specialtyName}</p>
                                            <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Cơ sở:</strong> {detailModal.data.facility?.facilityName}</p>
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{ margin: '0 0 10px', color: '#374151', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Tiểu sử</h4>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: 1.6, background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                                                {detailModal.data.bio}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Documents */}
                                    <div>
                                        <h4 style={{ margin: '0 0 10px', color: '#374151', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Tài liệu xác minh</h4>

                                        <div style={{ marginBottom: '20px' }}>
                                            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600 }}>Ảnh CCCD / Hộ chiếu:</p>
                                            <img
                                                src={detailModal.data.idCardUrl}
                                                alt="CCCD"
                                                style={{ width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'block' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600 }}>Chứng chỉ hành nghề:</p>
                                            <img
                                                src={detailModal.data.certificateUrl}
                                                alt="Chứng chỉ"
                                                style={{ width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'block' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button
                                        onClick={() => handleApprove(detailModal.data.doctorId)}
                                        style={{ padding: '12px 30px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        ✓ Phê duyệt hồ sơ
                                    </button>
                                    <button
                                        onClick={() => {
                                            const doc = detailModal.data;
                                            setRejectModal({ show: true, doctor: { doctorId: doc.doctorId, fullName: doc?.user?.fullName || doc.doctorId }, reason: "" });
                                        }}
                                        style={{ padding: '12px 30px', borderRadius: '8px', border: '1px solid #ef4444', background: 'white', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        ✗ Từ chối
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

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
