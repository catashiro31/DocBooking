import { useState, useEffect } from "react"
import { adminService } from "../services/adminService"
import { toast } from 'react-toastify'

const AdminReviews = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        fetchReviews()
    }, [page])

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const data = await adminService.getAllReviews(page, 10)
            setReviews(data.content || data || [])
            setTotalPages(data.totalPages || 1)
        } catch (err) {
            setError("Không thể tải danh sách đánh giá")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleHideReview = async (reviewId) => {
        if (!window.confirm("Ẩn đánh giá này vì vi phạm nội dung?")) return

        try {
            await adminService.hideReview(reviewId)
            fetchReviews()
        } catch (err) {
            toast.error(err.response?.data || "Không thể ẩn đánh giá")
        }
    }

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map(star => (
            <span key={star} style={{ color: star <= rating ? '#fbbf24' : '#d1d5db' }}>★</span>
        ))
    }

    if (loading && reviews.length === 0) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    if (error) {
        return <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>{error}</div>
    }

    return (
        <div>
            <h3 style={{ margin: '0 0 20px', color: '#333' }}>Quản lý đánh giá</h3>

            {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <p style={{ fontSize: '18px' }}>Chưa có đánh giá nào</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reviews.map(review => (
                        <div
                            key={review.reviewId}
                            style={{
                                background: review.isVisible === false ? '#f9fafb' : 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: `1px solid ${review.isVisible === false ? '#fecaca' : '#e5e7eb'}`,
                                opacity: review.isVisible === false ? 0.7 : 1
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: '600' }}>{review.patientName || 'Bệnh nhân'}</span>
                                        <span style={{ color: '#6b7280' }}>→</span>
                                        <span style={{ color: '#5f6dfc' }}>BS. {review.doctorName || 'Bác sĩ'}</span>
                                        {review.isVisible === false && (
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                background: '#fee2e2',
                                                color: '#dc2626'
                                            }}>
                                                Đã ẩn
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <div>{renderStars(review.rating)}</div>
                                        <span style={{ color: '#6b7280', fontSize: '14px' }}>
                                            {review.rating}/5
                                        </span>
                                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                                            • {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                                        </span>
                                    </div>

                                    {review.comment && (
                                        <p style={{ 
                                            margin: '0', 
                                            color: '#4b5563', 
                                            fontSize: '14px',
                                            lineHeight: 1.6,
                                            padding: '12px',
                                            background: '#f9fafb',
                                            borderRadius: '8px'
                                        }}>
                                            "{review.comment}"
                                        </p>
                                    )}
                                </div>

                                <div>
                                    {review.isVisible !== false && (
                                        <button
                                            type="button"
                                            onClick={() => handleHideReview(review.reviewId)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid #ef4444',
                                                background: 'white',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontSize: '13px'
                                            }}
                                        >
                                            Ẩn vi phạm
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            background: 'white',
                            cursor: page === 0 ? 'not-allowed' : 'pointer',
                            opacity: page === 0 ? 0.5 : 1
                        }}
                    >
                        Trước
                    </button>
                    <span style={{ padding: '8px 16px' }}>
                        Trang {page + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            background: 'white',
                            cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                            opacity: page >= totalPages - 1 ? 0.5 : 1
                        }}
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    )
}

export default AdminReviews
