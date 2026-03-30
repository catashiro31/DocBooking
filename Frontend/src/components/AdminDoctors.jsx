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
            toast.success("Đã phê duyệt bác sĩ thành công")
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
            toast.success("Đã từ chối hồ sơ bác sĩ")
            setRejectModal({ show: false, doctor: null, reason: "" })
            setDoctors(prev => prev.filter(d => d.doctorId !== rejectModal.doctor.doctorId))
            setDetailModal({ show: false, data: null, loading: false })
        } catch (err) {
            toast.error(err.response?.data || "Không thể từ chối")
        }
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Đang tải danh sách chờ duyệt...</div>
    }

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

                .doctor-pending-card {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 24px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    gap: 24px;
                    margin-bottom: 20px;
                }
                .doctor-pending-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
                    border-color: #6366f1;
                }

                .avatar-wrapper {
                    width: 100px;
                    height: 100px;
                    border-radius: 16px;
                    flex-shrink: 0;
                    overflow: hidden;
                    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                }

                .doctor-main-info {
                    flex: 1;
                }

                .info-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    background: #f8fafc;
                    border: 1px solid #f1f5f9;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #64748b;
                    font-weight: 500;
                    margin: 4px 8px 4px 0;
                }

                .action-group {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                }

                .btn-primary-custom {
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-primary-custom:hover {
                    background: #4f46e5;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }

                .btn-secondary-custom {
                    background: #ffffff;
                    color: #1e293b;
                    border: 1px solid #e2e8f0;
                    padding: 10px 24px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary-custom:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                .modal-overlay-custom {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(8px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1001;
                    padding: 20px;
                }
                .modal-content-custom {
                    background: #ffffff;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 40px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }

                .detail-section-title {
                    font-size: 12px;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 16px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .verify-image-card {
                    background: #f8fafc;
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                }
                .verify-image-card img {
                    width: 100%;
                    border-radius: 12px;
                    display: block;
                    cursor: zoom-in;
                }
            `}</style>

            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Phê duyệt hồ sơ</h2>
                    <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#64748b' }}>Kiểm duyệt và xác minh danh tính bác sĩ trước khi cho phép hoạt động</p>
                </div>
                <div style={{ background: '#eef2ff', padding: '8px 16px', borderRadius: '12px', color: '#6366f1', fontWeight: 800, fontSize: '14px' }}>
                    {doctors.length} hồ sơ đang chờ
                </div>
            </div>

            {doctors.length === 0 ? (
                <div className="doctor-pending-card" style={{ justifyContent: 'center', padding: '80px', textAlign: 'center', flexDirection: 'column' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>⭐</div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Hệ thống đã sạch hồ sơ!</h3>
                    <p style={{ color: '#64748b', margin: '8px 0 0' }}>Không còn bác sĩ nào đang chờ bạn phê duyệt vào lúc này.</p>
                </div>
            ) : (
                <div className="doctors-list">
                    {doctors.map(doctor => (
                        <div key={doctor.doctorId} className="doctor-pending-card">
                            <div className="avatar-wrapper">
                                {doctor.avatarUrl ? <img src={doctor.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👨‍⚕️'}
                            </div>

                            <div className="doctor-main-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
                                            BS. {doctor.user?.fullName || doctor.fullName}
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            <span className="info-chip">📧 {doctor.user?.email || doctor.email}</span>
                                            <span className="info-chip">📱 {doctor.user?.phoneNumber || doctor.phoneNumber}</span>
                                            <span className="info-chip">🏥 {doctor.specialtyName || doctor.specialty?.specialtyName}</span>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn-secondary-custom" 
                                        style={{ padding: '8px 16px', background: '#f8fafc', borderColor: '#6366f1', color: '#6366f1' }}
                                        onClick={() => handleViewDetail(doctor.doctorId)}
                                    >
                                        Hồ sơ chi tiết
                                    </button>
                                </div>

                                <div className="action-group">
                                    <button className="btn-primary-custom" onClick={() => handleApprove(doctor.doctorId)}>
                                        Duyệt hồ sơ nhanh
                                    </button>
                                    <button 
                                        className="btn-secondary-custom" 
                                        style={{ color: '#ef4444', borderColor: '#fee2e2' }}
                                        onClick={() => setRejectModal({ show: true, doctor, reason: "" })}
                                    >
                                        Từ chối
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {detailModal.show && (
                <div className="modal-overlay-custom" onClick={() => setDetailModal({ show: false, data: null, loading: false })}>
                    <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
                        {detailModal.loading ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Đang nạp dữ liệu hồ sơ chi tiết...</div>
                        ) : detailModal.data && (
                            <>
                                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Hồ sơ chuyên môn chi tiết</h2>
                                    <button onClick={() => setDetailModal({ show: false, data: null, loading: false })} style={{ border: 'none', background: 'none', fontSize: '32px', cursor: 'pointer', color: '#94a3b8' }}>×</button>
                                </header>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
                                    {/* Column 1 */}
                                    <div>
                                        <div className="detail-section-title">Thông tin nhân sự</div>
                                        <div style={{ marginBottom: '24px' }}>
                                            <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Họ và tên:</strong> {detailModal.data.user?.fullName}</p>
                                            <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Email chuyên môn:</strong> {detailModal.data.user?.email}</p>
                                            <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Điện thoại:</strong> {detailModal.data.user?.phoneNumber || 'N/A'}</p>
                                        </div>

                                        <div className="detail-section-title">Năng lực & Kinh nghiệm</div>
                                        <div style={{ marginBottom: '24px' }}>
                                            <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Học hàm / Học vị:</strong> {detailModal.data.degree}</p>
                                            <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Thâm niên công tác:</strong> {detailModal.data.experienceYears} năm</p>
                                            <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Giá khám niêm yết:</strong> {Number(detailModal.data.price).toLocaleString('vi-VN')} VNĐ/lượt</p>
                                            <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Chuyên khoa:</strong> {detailModal.data.specialty?.specialtyName}</p>
                                            <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Cơ sở trực thuộc:</strong> {detailModal.data.facility?.facilityName}</p>
                                        </div>

                                        <div className="detail-section-title">Lời giới thiệu</div>
                                        <div style={{ 
                                            background: '#f8fafc', padding: '20px', borderRadius: '16px', 
                                            fontSize: '14px', color: '#475569', lineHeight: 1.6, border: '1px solid #f1f5f9'
                                        }}>
                                            {detailModal.data.bio || "Không có nội dung giới thiệu."}
                                        </div>
                                    </div>

                                    {/* Column 2 */}
                                    <div>
                                        <div className="detail-section-title">Tài liệu pháp lý xác minh</div>
                                        
                                        <div className="verify-image-card">
                                            <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Ảnh Thẻ Căn Cước / Hộ chiếu:</p>
                                            <img src={detailModal.data.idCardUrl} alt="CCCD" />
                                        </div>

                                        <div className="verify-image-card">
                                            <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Giấy phép / Chứng chỉ hành nghề:</p>
                                            <img src={detailModal.data.certificateUrl} alt="Chứng chỉ" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ 
                                    marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #f1f5f9', 
                                    display: 'flex', justifyContent: 'flex-end', gap: '16px' 
                                }}>
                                    <button 
                                        className="btn-primary-custom" 
                                        style={{ padding: '14px 40px' }}
                                        onClick={() => handleApprove(detailModal.data.doctorId)}
                                    >
                                        Phê duyệt hồ sơ này
                                    </button>
                                    <button 
                                        className="btn-secondary-custom" 
                                        style={{ padding: '14px 40px', color: '#ef4444', borderColor: '#fee2e2' }}
                                        onClick={() => {
                                            const doc = detailModal.data;
                                            setRejectModal({ show: true, doctor: { doctorId: doc.doctorId, fullName: doc.user?.fullName }, reason: "" });
                                        }}
                                    >
                                        Từ chối hồ sơ
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal.show && (
                <div className="modal-overlay-custom" style={{ zIndex: 1002 }} onClick={() => setRejectModal({ show: false, doctor: null, reason: "" })}>
                    <div className="modal-content-custom" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>Lý do từ chối hồ sơ</h3>
                        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
                            Thông báo từ chối sẽ được gửi đến <strong>BS. {rejectModal.doctor?.fullName}</strong>. Vui lòng nêu rõ lý do để bác sĩ có thể cập nhật lại hồ sơ.
                        </p>

                        <div style={{ marginBottom: '24px' }}>
                            <textarea
                                value={rejectModal.reason}
                                onChange={e => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Ví dụ: Chứng chỉ hành nghề đã hết hạn, Ảnh CCCD bị mờ..."
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0',
                                    minHeight: '120px', fontSize: '14px', boxSizing: 'border-box', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button className="btn-secondary-custom" style={{ flex: 1 }} onClick={() => setRejectModal({ show: false, doctor: null, reason: "" })}>Quay lại</button>
                            <button className="btn-primary-custom" style={{ flex: 1.5, background: '#ef4444' }} onClick={handleReject}>Gửi thông báo từ chối</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDoctors
