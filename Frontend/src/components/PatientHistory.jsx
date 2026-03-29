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
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    if (error) {
        return <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>{error}</div>
    }

    if (history.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <p style={{ fontSize: '18px' }}>Bạn chưa có lịch sử khám bệnh</p>
            </div>
        )
    }

    return (
        <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Lịch sử khám bệnh</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {history.map(apt => (
                    <div 
                        key={apt.appointmentId}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}>
                                        BS. {apt.doctorName}
                                    </span>
                                    {apt.patientName && (
                                        <span style={{ fontWeight: '500', fontSize: '15px', color: '#4b5563' }}>
                                            - BN: {apt.patientName}
                                        </span>
                                    )}
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        background: '#dcfce7',
                                        color: '#16a34a'
                                    }}>
                                        Đã hoàn thành
                                    </span>
                                </div>

                                <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div>📅 {apt.dateWorking} - {apt.timeSlot}</div>
                                    <div>📍 {apt.facilityName || 'Không xác định'}</div>
                                    {apt.specialtyName && <div>🏥 {apt.specialtyName}</div>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={() => handleViewDetail(apt)}
                                    disabled={detailLoading}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #5f6dfc',
                                        background: 'white',
                                        color: '#5f6dfc',
                                        cursor: detailLoading ? 'wait' : 'pointer'
                                    }}
                                >
                                    Xem chi tiết
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleOpenReview(apt)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#5f6dfc',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {detail && !showReviewModal && (
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
                    onClick={() => setDetail(null)}
                >
                    <div 
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            maxWidth: '520px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: '20px' }}>Chi tiết lịch khám</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                            <div><strong>Bác sĩ:</strong> {detail.doctorName}</div>
                            <div><strong>Bệnh nhân:</strong> {detail.patientName}</div>
                            <div><strong>Ngày khám:</strong> {detail.dateWorking}</div>
                            <div><strong>Giờ khám:</strong> {detail.timeSlot}</div>
                            <div><strong>Cơ sở:</strong> {detail.facilityName || 'N/A'}</div>
                            <div><strong>Chuyên khoa:</strong> {detail.specialtyName || 'N/A'}</div>

                            {detail.hasResult && (
                                <div style={{ marginTop: '8px', padding: '12px', background: '#f0fdf4', borderRadius: '8px' }}>
                                    {detail.diagnosis && (
                                        <div style={{ marginBottom: '8px' }}>
                                            <strong>Chẩn đoán:</strong>
                                            <p style={{ margin: '6px 0 0' }}>{detail.diagnosis}</p>
                                        </div>
                                    )}
                                    {detail.doctorNotes && (
                                        <div style={{ marginBottom: '8px' }}>
                                            <strong>Ghi chú / lời dặn:</strong>
                                            <p style={{ margin: '6px 0 0' }}>{detail.doctorNotes}</p>
                                        </div>
                                    )}
                                    {detail.prescriptionUrl && (
                                        <div>
                                            <strong>Đơn thuốc / tài liệu:</strong>{' '}
                                            <a href={detail.prescriptionUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#5f6dfc' }}>
                                                Xem file
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(detail.rating != null || (detail.comment && String(detail.comment).trim())) && (
                                <div style={{ marginTop: '8px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                                    <strong>Đánh giá của bạn:</strong>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star} style={{ color: star <= (detail.rating || 0) ? '#fbbf24' : '#d1d5db' }}>★</span>
                                        ))}
                                    </div>
                                    {detail.comment && <p style={{ margin: '8px 0 0', color: '#4b5563' }}>{detail.comment}</p>}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setDetail(null)}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#5f6dfc',
                                color: 'white',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {showReviewModal && (
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
                    onClick={() => { setShowReviewModal(false); setReviewAppointmentId(null) }}
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
                        <h3 style={{ marginBottom: '20px' }}>Đánh giá bác sĩ</h3>

                        <div style={{ marginBottom: '16px' }}>
                            <span style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Số sao</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '28px',
                                            cursor: 'pointer',
                                            color: star <= reviewData.rating ? '#fbbf24' : '#d1d5db'
                                        }}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nhận xét *</label>
                            <textarea
                                value={reviewData.comment}
                                onChange={e => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Nhập nhận xét của bạn..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    minHeight: '100px',
                                    resize: 'vertical',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => { setShowReviewModal(false); setReviewAppointmentId(null) }}
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
                                type="button"
                                onClick={handleSubmitReview}
                                disabled={submittingReview}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: submittingReview ? '#ccc' : '#5f6dfc',
                                    color: 'white',
                                    cursor: submittingReview ? 'not-allowed' : 'pointer'
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
