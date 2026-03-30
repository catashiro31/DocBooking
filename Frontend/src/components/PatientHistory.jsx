import { useState, useEffect } from "react"
import { patientService, unwrapPage } from "../services/patientService"
import { toast } from 'react-toastify'

const PatientHistory = () => {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [detailLoading, setDetailLoading] = useState(false)
    const [detail, setDetail] = useState(null)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [reviewAppointmentId, setReviewAppointmentId] = useState(null)
    const [reviewData, setReviewData] = useState({ rating: 5, comment: "" })
    const [submittingReview, setSubmittingReview] = useState(false)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const data = await patientService.getHistory(0, 100)
            setHistory(unwrapPage(data))
        } catch (err) {
            setError("Không thể tải lịch sử khám")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadDetail = async (appointmentId) => {
        setDetailLoading(true)
        try {
            const d = await patientService.getHistoryDetail(appointmentId)
            setDetail(d)
            return d
        } catch (err) {
            toast.error(err.response?.data || "Không thể tải chi tiết")
            return null
        } finally {
            setDetailLoading(false)
        }
    }

    const handleViewDetail = (apt) => {
        loadDetail(apt.appointmentId)
    }

    const handleOpenReview = async (apt) => {
        setReviewAppointmentId(apt.appointmentId)
        setDetailLoading(true)
        try {
            const d = await patientService.getHistoryDetail(apt.appointmentId)
            const hasReview = d.rating != null && d.comment != null && String(d.comment).trim() !== ""
            setReviewData({
                rating: d.rating || 5,
                comment: hasReview ? d.comment : ""
            })
            setShowReviewModal(true)
        } catch (err) {
            toast.error(err.response?.data || "Không thể tải chi tiết để đánh giá")
            setReviewAppointmentId(null)
        } finally {
            setDetailLoading(false)
        }
    }

    const handleSubmitReview = async () => {
        if (reviewAppointmentId == null) return
        if (!String(reviewData.comment).trim()) {
            toast.warning("Vui lòng nhập nhận xét")
            return
        }

        setSubmittingReview(true)
        const appointmentId = reviewAppointmentId
        try {
            const d = await patientService.getHistoryDetail(appointmentId)
            const hasExisting = d.rating != null && d.comment != null && String(d.comment).trim() !== ""
            if (hasExisting) {
                await patientService.updateReview(appointmentId, reviewData.rating, reviewData.comment)
            } else {
                await patientService.createReview(appointmentId, reviewData.rating, reviewData.comment)
            }
            toast.success("Cảm ơn bạn đã đánh giá!")
            setShowReviewModal(false)
            setReviewAppointmentId(null)
            fetchHistory()
            if (detail && detail.appointmentId === appointmentId) {
                const fresh = await patientService.getHistoryDetail(appointmentId)
                setDetail(fresh)
            }
        } catch (err) {
            const msg = err.response?.data
            toast.error(typeof msg === "string" ? msg : "Không thể gửi đánh giá")
        } finally {
            setSubmittingReview(false)
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton" style={{ height: '140px', width: '100%', borderRadius: '16px' }} />
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
                    onClick={fetchHistory}
                    style={{ marginTop: '16px', color: '#6366f1', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                >
                    Thử lại
                </button>
            </div>
        )
    }

    if (history.length === 0) {
        return (
            <div className="reveal" style={{ textAlign: 'center', padding: '80px 40px', color: '#64748b' }}>
                <div style={{ 
                    width: '80px', height: '80px', borderRadius: '50%', 
                    background: '#f1f5f9', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' 
                }}>
                    📋
                </div>
                <h3 style={{ color: '#1e293b', margin: '0 0 8px', fontSize: '20px', fontWeight: 800 }}>Chưa có lịch sử khám</h3>
                <p style={{ margin: 0 }}>Thông tin các lần khám bệnh sẽ được hiển thị tại đây.</p>
            </div>
        )
    }

    return (
        <div className="reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Lịch sử khám bệnh</h2>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Hoàn thành ({history.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {history.map(apt => (
                    <div 
                        key={apt.appointmentId}
                        className="premium-card"
                        style={{ padding: '24px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1e293b' }}>
                                        BS. {apt.doctorName}
                                    </h3>
                                    {apt.patientName && (
                                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#64748b', background: '#f1f5f9', padding: '2px 10px', borderRadius: '6px' }}>
                                            BN: {apt.patientName}
                                        </span>
                                    )}
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: '#059669',
                                        border: '1px solid rgba(16, 185, 129, 0.2)'
                                    }}>
                                        Hoàn thành
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 20px', color: '#475569', fontSize: '14px' }}>
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
                                        <span style={{ color: '#64748b' }}>{apt.facilityName || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleViewDetail(apt)}
                                    disabled={detailLoading}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        background: '#fff',
                                        color: '#1e293b',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: detailLoading ? 'wait' : 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                >
                                    📄 Kết quả
                                </button>
                                <button
                                    onClick={() => handleOpenReview(apt)}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        color: 'white',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                                    }}
                                >
                                    ⭐ Đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {detail && !showReviewModal && (
                <div 
                    className="glass"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(8px)'
                    }}
                    onClick={() => setDetail(null)}
                >
                    <div 
                        className="premium-card reveal"
                        style={{
                            maxWidth: '560px',
                            width: '100%',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            padding: '32px'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>Chi tiết khám bệnh</h3>
                            <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}>×</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc' }}>
                                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Bác sĩ</label>
                                    <span style={{ fontWeight: 700, color: '#1e293b' }}>BS. {detail.doctorName}</span>
                                </div>
                                <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc' }}>
                                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Bệnh nhân</label>
                                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{detail.patientName}</span>
                                </div>
                            </div>

                            {detail.hasResult ? (
                                <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                    <h4 style={{ margin: '0 0 16px', color: '#059669', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🩺 Kết quả lâm sàng
                                    </h4>
                                    
                                    {detail.diagnosis && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <strong style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '4px' }}>Chẩn đoán:</strong>
                                            <p style={{ margin: 0, padding: '12px', background: '#fff', borderRadius: '10px', fontSize: '14px', border: '1px solid #e2e8f0', color: '#1e293b', lineHeight: 1.5 }}>
                                                {detail.diagnosis}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {detail.doctorNotes && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <strong style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '4px' }}>Lời dặn của bác sĩ:</strong>
                                            <p style={{ margin: 0, padding: '12px', background: '#fff', borderRadius: '10px', fontSize: '14px', border: '1px solid #e2e8f0', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                                                "{detail.doctorNotes}"
                                            </p>
                                        </div>
                                    )}

                                    {detail.prescriptionUrl && (
                                        <div style={{ marginTop: '12px' }}>
                                            <a 
                                                href={detail.prescriptionUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style={{ 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                    background: '#fff', color: '#059669', padding: '12px', borderRadius: '12px',
                                                    textDecoration: 'none', fontWeight: 700, fontSize: '14px', border: '1px solid rgba(16, 185, 129, 0.2)',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                            >
                                                📄 Xem đơn thuốc (PDF)
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ padding: '24px', textAlign: 'center', borderRadius: '16px', background: '#f8fafc', border: '1px dashed #e2e8f0' }}>
                                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>⏳</span>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Bác sĩ chưa cập nhật kết quả</p>
                                </div>
                            )}

                            {(detail.rating != null || (detail.comment && String(detail.comment).trim())) && (
                                <div style={{ padding: '20px', borderRadius: '16px', background: '#fcfcfe', border: '1px solid #eff0fe' }}>
                                    <label style={{ fontSize: '12px', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Đánh giá của bạn</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star} style={{ fontSize: '20px', color: star <= (detail.rating || 0) ? '#fbbf24' : '#e2e8f0' }}>★</span>
                                        ))}
                                    </div>
                                    {detail.comment && (
                                        <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5, padding: '12px', background: '#fff', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                            {detail.comment}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setDetail(null)}
                            style={{
                                marginTop: '32px',
                                padding: '14px',
                                borderRadius: '14px',
                                border: 'none',
                                background: '#1e293b',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '700',
                                width: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div 
                    className="glass"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1001,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(8px)'
                    }}
                    onClick={() => { setShowReviewModal(false); setReviewAppointmentId(null) }}
                >
                    <div 
                        className="premium-card reveal"
                        style={{ maxWidth: '440px', width: '100%', padding: '32px' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800 }}>Đánh giá dịch vụ</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>Ý kiến của bạn giúp chúng tôi cải thiện chất lượng phục vụ.</p>

                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '42px',
                                            cursor: 'pointer',
                                            color: star <= reviewData.rating ? '#fbbf24' : '#e2e8f0',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginTop: '8px', display: 'block' }}>
                                {['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'][reviewData.rating - 1]}
                            </span>
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>Nhận xét của bạn *</label>
                            <textarea
                                value={reviewData.comment}
                                onChange={e => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Hãy chia sẻ trải nghiệm của bạn về bác sĩ và phòng khám..."
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    minHeight: '120px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => { setShowReviewModal(false); setReviewAppointmentId(null) }}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#fff',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                disabled={submittingReview}
                                style={{
                                    flex: 2,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: submittingReview ? '#cbd5e1' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    color: 'white',
                                    fontWeight: '700',
                                    cursor: submittingReview ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)'
                                }}
                            >
                                {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PatientHistory
