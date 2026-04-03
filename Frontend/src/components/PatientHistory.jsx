import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
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
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    useEffect(() => {
        fetchHistory()
    }, [startDate, endDate])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const data = await patientService.getHistory(0, 100, startDate || null, endDate || null)
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Lịch sử khám bệnh</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Từ:</span>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            style={{ border: 'none', outline: 'none', fontSize: '13px', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Đến:</span>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            style={{ border: 'none', outline: 'none', fontSize: '13px', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}
                        />
                    </div>
                    {(startDate || endDate) && (
                        <button 
                            onClick={() => { setStartDate(""); setEndDate(""); }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 800, cursor: 'pointer', padding: '4px 8px' }}
                        >
                            Xóa lọc
                        </button>
                    )}
                </div>

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
                                        <span style={{ color: '#64748b' }}>
                                            {apt.facilityName}
                                            {apt.facilityAddress && <span style={{ display: 'block', fontSize: '12px', marginTop: '2px', opacity: 0.8 }}>
                                                {apt.facilityAddress}{apt.facilityProvince ? `, ${apt.facilityProvince}` : ''}
                                            </span>}
                                        </span>
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

            {/* Detail Modal - React Portal */}
            {detail && !showReviewModal && createPortal(
                <div 
                    className="modal-overlay"
                    onClick={() => setDetail(null)}
                >
                    <div 
                        className="modal-content"
                        style={{ maxWidth: '600px', padding: '40px', animation: 'modalScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Kết quả khám bệnh</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>ID Lịch hẹn: #{detail.appointmentId}</p>
                            </div>
                            <button 
                                onClick={() => setDetail(null)} 
                                style={{ 
                                    background: '#f1f5f9', 
                                    border: 'none', 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '14px', 
                                    cursor: 'pointer', 
                                    color: '#64748b', 
                                    fontSize: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a' }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b' }}
                            >×</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            {/* Doctor & Patient Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0' }}>
                                    <label style={{ fontSize: '11px', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>Bác sĩ phụ trách</label>
                                    <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '16px' }}>BS. {detail.doctorName}</div>
                                </div>
                                <div style={{ padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0' }}>
                                    <label style={{ fontSize: '11px', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>Bệnh nhân</label>
                                    <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '16px' }}>{detail.patientName}</div>
                                </div>
                            </div>

                            {detail.hasResult ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ padding: '24px', borderRadius: '24px', background: '#ffffff', border: '1.5px solid #ecfdf5', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.05)' }}>
                                        <h4 style={{ margin: '0 0 16px', color: '#059669', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '20px' }}>🩺</span> Chẩn đoán y khoa
                                        </h4>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#1e293b', lineHeight: 1.6, fontWeight: 500 }}>
                                            {detail.diagnosis}
                                        </p>
                                    </div>
                                    
                                    <div style={{ padding: '24px', borderRadius: '24px', background: '#fcfcfe', border: '1.5px solid #eef2ff' }}>
                                        <h4 style={{ margin: '0 0 16px', color: '#4f46e5', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '20px' }}>📝</span> Lời dặn của bác sĩ
                                        </h4>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#475569', fontStyle: 'italic', lineHeight: 1.6 }}>
                                            "{detail.doctorNotes}"
                                        </p>
                                    </div>

                                    {detail.prescriptionUrl && (
                                        <div style={{ marginTop: '8px' }}>
                                            <a 
                                                href={detail.prescriptionUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style={{ 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                                    background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', 
                                                    padding: '18px', borderRadius: '20px',
                                                    textDecoration: 'none', fontWeight: 800, fontSize: '15px',
                                                    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
                                                    transition: 'all 0.3s'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(16, 185, 129, 0.4)' }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}
                                            >
                                                📄 Xem đơn thuốc (PDF Online)
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', borderRadius: '28px', background: '#f8fafc', border: '2px dashed #e2e8f0' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                                    <h4 style={{ color: '#64748b', margin: 0, fontSize: '16px', fontWeight: 700 }}>Đang xử lý kết quả</h4>
                                    <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '14px' }}>Bác sĩ đang cập nhật hồ sơ, vui lòng quay lại sau.</p>
                                </div>
                            )}

                            {/* Existing Review - Visual enhancement */}
                            {(detail.rating != null || (detail.comment && String(detail.comment).trim())) && (
                                <div style={{ padding: '24px', borderRadius: '24px', background: '#fffbeb', border: '1.5px solid #fef3c7', marginTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <label style={{ fontSize: '12px', color: '#d97706', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Đánh giá từ bạn</label>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span key={star} style={{ fontSize: '18px', color: star <= (detail.rating || 0) ? '#fbbf24' : '#e2e8f0' }}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    {detail.comment && (
                                        <p style={{ margin: 0, fontSize: '14px', color: '#92400e', lineHeight: 1.5, padding: '16px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '14px', border: '1px solid rgba(217, 119, 6, 0.1)' }}>
                                            {detail.comment}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setDetail(null)}
                            style={{
                                marginTop: '40px',
                                padding: '16px',
                                borderRadius: '18px',
                                border: 'none',
                                background: '#0f172a',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: '800',
                                width: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            Hoàn tất xem
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* Review Modal - React Portal */}
            {showReviewModal && createPortal(
                <div 
                    className="modal-overlay"
                    onClick={() => { setShowReviewModal(false); setReviewAppointmentId(null) }}
                >
                    <div 
                        className="modal-content"
                        style={{ maxWidth: '480px', padding: '40px', animation: 'modalScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.02em' }}>Đánh giá trải nghiệm</h3>
                        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px', fontWeight: 500 }}>Ý kiến của bạn là chìa khóa để chúng tôi nâng cao chất lượng phục vụ.</p>

                        <div style={{ marginBottom: '32px', textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '48px',
                                            cursor: 'pointer',
                                            color: star <= reviewData.rating ? '#fbbf24' : '#e2e8f0',
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            padding: 0
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25) rotate(15deg)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                                    >
                                        ★
                                    </button>
                                    
                                ))}
                            </div>
                            <div style={{ 
                                marginTop: '16px', 
                                display: 'inline-block',
                                padding: '6px 16px', 
                                borderRadius: '10px',
                                background: '#fffbeb',
                                color: '#d97706',
                                fontSize: '13px', 
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {['Không hài lòng', 'Chưa tốt', 'Bình thường', 'Rất hài lòng', 'Tuyệt vời tuyệt đối'][reviewData.rating - 1]}
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>Nhận xét chi tiết *</label>
                            <textarea
                                value={reviewData.comment}
                                onChange={e => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Hãy viết vài câu chia sẻ về trải nghiệm của bạn..."
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    borderRadius: '20px',
                                    border: '2px solid #f1f5f9',
                                    background: '#fcfcfd',
                                    minHeight: '140px',
                                    fontSize: '15px',
                                    fontFamily: 'inherit',
                                    resize: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    color: '#0f172a'
                                }}
                                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)' }}
                                onBlur={e => { e.target.style.borderColor = '#f1f5f9'; e.target.style.background = '#fcfcfd'; e.target.style.boxShadow = 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                onClick={() => { setShowReviewModal(false); setReviewAppointmentId(null) }}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: '2px solid #f1f5f9',
                                    background: '#fff',
                                    color: '#64748b',
                                    fontWeight: '800',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a' }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b' }}
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                disabled={submittingReview}
                                style={{
                                    flex: 1.8,
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: submittingReview ? '#cbd5e1' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: 'white',
                                    fontSize: '15px',
                                    fontWeight: '800',
                                    cursor: submittingReview ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={e => { if(!submittingReview) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(99, 102, 241, 0.4)' } }}
                                onMouseLeave={e => { if(!submittingReview) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.3)' } }}
                            >
                                {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá ngay'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default PatientHistory
