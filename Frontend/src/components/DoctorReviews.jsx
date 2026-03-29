import { useState, useEffect } from "react"
import { doctorService } from "../services/doctorService"

const DoctorReviews = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [stats, setStats] = useState({ average: 0, total: 0 })

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const data = await doctorService.getMyReviews(0, 50)
            const reviewList = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : [])
            setReviews(reviewList)
            
            if (reviewList.length > 0) {
                const total = reviewList.length
                const sum = reviewList.reduce((acc, r) => acc + (r.rating || 0), 0)
                setStats({ average: (sum / total).toFixed(1), total })
            }
        } catch (err) {
            setError("Không thể tải đánh giá")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map(star => (
            <span key={star} style={{ color: star <= rating ? '#fbbf24' : '#d1d5db', fontSize: '16px' }}>★</span>
        ))
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    if (error) {
        return <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>{error}</div>
    }

    return (
        <div>
            <h3 style={{ margin: '0 0 20px', color: '#333' }}>Đánh giá từ bệnh nhân</h3>

            {/* Stats */}
            <div style={{
                background: 'linear-gradient(135deg, #5f6dfc, #a78bfa)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '24px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: '700' }}>{stats.average}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                        {renderStars(Math.round(stats.average))}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>{stats.total} đánh giá</div>
                </div>

                <div style={{ flex: 1 }}>
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = reviews.filter(r => r.rating === star).length
                        const percent = stats.total > 0 ? (count / stats.total) * 100 : 0
                        return (
                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ width: '20px', fontSize: '14px' }}>{star}★</span>
                                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}>
                                    <div style={{ width: `${percent}%`, height: '100%', background: 'white', borderRadius: '4px' }} />
                                </div>
                                <span style={{ width: '30px', fontSize: '12px', textAlign: 'right' }}>{count}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <p style={{ fontSize: '18px' }}>Chưa có đánh giá nào</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reviews.map((review, index) => (
                        <div
                            key={review.reviewId ?? index}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: '1px solid #e5e7eb'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                        {review.patientName || 'Bệnh nhân'}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div>{renderStars(review.rating)}</div>
                                        <span style={{ color: '#6b7280', fontSize: '14px' }}>
                                            {review.rating}/5
                                        </span>
                                    </div>
                                </div>
                                <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                                </div>
                            </div>

                            {review.comment && (
                                <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>
                                    "{review.comment}"
                                </p>
                            )}

                            {review.appointmentDate && (
                                <div style={{ marginTop: '12px', fontSize: '13px', color: '#9ca3af' }}>
                                    Khám ngày: {review.appointmentDate}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DoctorReviews
