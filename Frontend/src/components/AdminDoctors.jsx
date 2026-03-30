import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { adminService } from "../services/adminService"
import { toast } from 'react-toastify'

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [viewMode, setViewMode] = useState("all") // Default to ALL to avoid confusion
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [detailModal, setDetailModal] = useState({ show: false, data: null, loading: false })
    const [rejectModal, setRejectModal] = useState({ show: false, doctor: null, reason: "" })

    useEffect(() => {
        setPage(0)
        fetchData(0)
    }, [viewMode])

    useEffect(() => {
        if (viewMode === "all") {
            fetchData(page)
        }
    }, [page])

    const fetchData = async (pageNum) => {
        try {
            setLoading(true)
            if (viewMode === "pending") {
                const data = await adminService.getPendingDoctors()
                setDoctors(Array.isArray(data) ? data : [])
                setTotalPages(1)
            } else {
                const data = await adminService.getAllDoctors(pageNum, 10)
                setDoctors(data?.content || [])
                setTotalPages(data?.totalPages || 1)
            }
        } catch (err) {
            setError("Không thể tải danh sách bác sĩ")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

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

    const handleApprove = async (doctorId) => {
        if (!window.confirm("Phê duyệt bác sĩ này?")) return
        try {
            await adminService.approveDoctor(doctorId)
            toast.success("Phê duyệt thành công")
            fetchData(page)
            setDetailModal({ show: false, data: null, loading: false })
        } catch (err) {
            toast.error(err.response?.data || "Lỗi phê duyệt")
        }
    }

    const handleReject = async () => {
        if (!rejectModal.reason.trim()) return
        try {
            await adminService.rejectDoctor(rejectModal.doctor.doctorId, rejectModal.reason)
            toast.success("Đã từ chối hồ sơ")
            setRejectModal({ show: false, doctor: null, reason: "" })
            fetchData(page)
            setDetailModal({ show: false, data: null, loading: false })
        } catch (err) {
            toast.error(err.response?.data || "Lỗi từ chối")
        }
    }

    const getStatusBadge = (status) => {
        const styles = {
            APPROVED: { label: 'Đã duyệt', color: '#10b981', bg: '#ecfdf5' },
            PENDING: { label: 'Chờ duyệt', color: '#f59e0b', bg: '#fffbeb' },
            REJECTED: { label: 'Từ chối', color: '#ef4444', bg: '#fef2f2' }
        }
        return styles[status] || { label: status, color: '#64748b', bg: '#f8fafc' }
    }

    return (
        <div className="reveal">
            <style>{`
                .view-toggle-container { display: flex; background: #f1f5f9; padding: 4px; border-radius: 14px; width: fit-content; margin-bottom: 32px; }
                .view-toggle-btn { padding: 10px 20px; border-radius: 10px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; color: #64748b; background: transparent; }
                .view-toggle-btn.active { background: white; color: #6366f1; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                
                .doc-card { background: white; border-radius: 24px; padding: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); transition: all 0.3s; display: flex; gap: 24px; margin-bottom: 20px; }
                .doc-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08); border-color: #e2e8f0; }
                
                .doc-avatar { width: 80px; height: 80px; border-radius: 50%; background: #f1f5f9; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: #64748b; flex-shrink: 0; border: 2px solid #f1f5f9; line-height: 1; }
                
                .chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; font-size: 12px; font-weight: 500; color: #64748b; margin-right: 8px; margin-top: 4px; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Danh sách bác sĩ</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#64748b' }}>Phê duyệt hồ sơ chuyên môn và quản lý đội ngũ bác sĩ hệ thống.</p>
                </div>
            </div>

            <div className="view-toggle-container">
                <button className={`view-toggle-btn ${viewMode === "all" ? "active" : ""}`} onClick={() => setViewMode("all")}>Tất cả bác sĩ</button>
                <button className={`view-toggle-btn ${viewMode === "pending" ? "active" : ""}`} onClick={() => setViewMode("pending")}>Đang chờ duyệt</button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}><div className="skeleton-pulse" style={{ height: '300px', borderRadius: '24px' }} /></div>
            ) : doctors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
                    <div style={{ color: '#64748b', fontWeight: 700 }}>Danh sách hiện đang trống</div>
                </div>
            ) : (
                <div className="reveal">
                    {doctors.map(doc => (
                        <div key={doc.doctorId} className="doc-card">
                            <div className="doc-avatar">
                                {(doc.user?.avatarUrl || doc.avatarUrl) ? (
                                    <img src={doc.user?.avatarUrl || doc.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                         onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = (doc.user?.fullName || doc.fullName || 'B')?.charAt(0) }} />
                                ) : (doc.user?.fullName || doc.fullName || '👨‍⚕️')?.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>BS. {doc.user?.fullName || doc.fullName}</h3>
                                        <div style={{ marginTop: '4px' }}>
                                            <span className="chip">📧 {doc.user?.email}</span>
                                            <span className="chip">🏥 {doc.specialty?.specialtyName || doc.specialtyName}</span>
                                            <span style={{ 
                                                padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800,
                                                background: getStatusBadge(doc.verificationStatus).bg,
                                                color: getStatusBadge(doc.verificationStatus).color
                                            }}>
                                                {getStatusBadge(doc.verificationStatus).label}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleViewDetail(doc.doctorId)} style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Xem hồ sơ</button>
                                </div>
                                {doc.verificationStatus === 'PENDING' && (
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                        <button onClick={() => handleApprove(doc.doctorId)} style={{ background: '#1063ff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Phê duyệt ngay</button>
                                        <button onClick={() => setRejectModal({ show: true, doctor: doc, reason: "" })} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Từ chối</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {viewMode === "all" && totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
                            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 800, cursor: 'pointer' }}>← Trước</button>
                            <span style={{ fontWeight: 800, color: '#0f172a' }}>Trang {page + 1} / {totalPages}</span>
                            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 800, cursor: 'pointer' }}>Sau →</button>
                        </div>
                    )}
                </div>
            )}

            {detailModal.show && createPortal(
                <div 
                    className="modal-overlay"
                    onClick={() => setDetailModal({ show: false, data: null, loading: false })}
                >
                    <div 
                        className="modal-content" 
                        style={{ maxWidth: '800px', padding: '40px' }} 
                        onClick={e => e.stopPropagation()}
                    >
                        {detailModal.loading ? <div style={{ textAlign: 'center', padding: '60px' }}>Đang tải...</div> : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Chi tiết hồ sơ bác sĩ</h3>
                                    <button onClick={() => setDetailModal({ show: false, data: null, loading: false })} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '32px' }}>
                                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f1f5f9', overflow: 'hidden', border: '3px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#64748b' }}>
                                        {(detailModal.data?.user?.avatarUrl || detailModal.data?.avatarUrl) ? (
                                            <img src={detailModal.data.user?.avatarUrl || detailModal.data.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (detailModal.data?.user?.fullName || detailModal.data?.fullName || '👨‍⚕️')?.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ margin: '8px 0', fontSize: '15px' }}><b>Họ tên:</b> {detailModal.data?.user?.fullName || detailModal.data?.fullName}</p>
                                        <p style={{ margin: '8px 0', fontSize: '15px' }}><b>Học vị:</b> {detailModal.data?.degree}</p>
                                        <p style={{ margin: '8px 0', fontSize: '15px' }}><b>Kinh nghiệm:</b> {detailModal.data?.experienceYears} năm</p>
                                        <p style={{ margin: '8px 0', fontSize: '15px' }}><b>Chuyên khoa:</b> {detailModal.data?.specialty?.specialtyName}</p>
                                        <p style={{ margin: '8px 0', fontSize: '15px' }}><b>Giá khám:</b> {detailModal.data?.price?.toLocaleString()} VNĐ</p>
                                        <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                            <b style={{ display: 'block', marginBottom: '8px' }}>Giới thiệu chuyên môn:</b>
                                            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>{detailModal.data?.bio}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {detailModal.data?.certificateUrl && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <b>Chứng chỉ hành nghề:</b>
                                                <img src={detailModal.data.certificateUrl} alt="" style={{ width: '100%', borderRadius: '16px', marginTop: '12px', border: '1px solid #f1f5f9' }} />
                                            </div>
                                        )}
                                        {detailModal.data?.idCardUrl && (
                                            <div>
                                                <b>CCCD/Hộ chiếu:</b>
                                                <img src={detailModal.data.idCardUrl} alt="" style={{ width: '100%', borderRadius: '16px', marginTop: '12px', border: '1px solid #f1f5f9' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {detailModal.data?.verificationStatus === 'PENDING' && (
                                    <div style={{ display: 'flex', gap: '16px', marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '32px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => handleApprove(detailModal.data.doctorId)} style={{ background: '#1063ff', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '16px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>Phê duyệt hồ sơ</button>
                                        <button onClick={() => setRejectModal({ show: true, doctor: detailModal.data, reason: "" })} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '12px 32px', borderRadius: '16px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>Từ chối</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {rejectModal.show && createPortal(
                <div 
                    className="modal-overlay"
                    onClick={() => setRejectModal({ show: false, doctor: null, reason: "" })}
                >
                    <div 
                        className="modal-content" 
                        style={{ maxWidth: '480px', padding: '32px' }} 
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 800 }}>Lý do từ chối</h3>
                        <textarea value={rejectModal.reason} onChange={e => setRejectModal({ ...rejectModal, reason: e.target.value })} placeholder="Nhập lý do gửi bác sĩ..." style={{ width: '100%', minHeight: '120px', padding: '16px', borderRadius: '16px', border: '1.5px solid #e2e8f0', outline: 'none', marginBottom: '24px' }} />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setRejectModal({ show: false, doctor: null, reason: "" })} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Quay lại</button>
                            <button onClick={handleReject} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Gửi từ chối</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default AdminDoctors
