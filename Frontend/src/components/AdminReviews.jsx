import { useState, useEffect } from "react"
import { adminService } from "../services/adminService"
import { toast } from 'react-toastify'

const AdminReviews = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [aiResults, setAiResults] = useState({})
    const [analyzingId, setAnalyzingId] = useState(null)


    useEffect(() => {
        fetchReviews()
    }, [page])

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const data = await adminService.getAllReviews(page, 10)
            setReviews(data?.content || data || [])
            setTotalPages(data?.totalPages || 1)
        } catch (err) {
            setError("Không thể tải danh sách đánh giá")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleHideReview = async (reviewId) => {
        if (!window.confirm("Ẩn đánh giá này vì vi phạm nội dung? Đây là hành động kiểm duyệt trực tiếp.")) return

        try {
            await adminService.hideReview(reviewId)
            toast.success("Đã ẩn đánh giá vi phạm")
            fetchReviews()
        } catch (err) {
            toast.error(err.response?.data || "Không thể ẩn đánh giá")
        }
    }

    const handleAnalyze = async (reviewId, comment) => {
        if (!comment) {
            toast.warn("Bài đánh giá không có nội dung để phân tích");
            return;
        }
        try {
            setAnalyzingId(reviewId);
            const data = await adminService.analyzeReview(comment);
            setAiResults(prev => ({ ...prev, [reviewId]: data.labels }));
        } catch (err) {
            toast.error("Lỗi phân tích AI");
            console.error(err);
        } finally {
            setAnalyzingId(null);
        }
    }

    const renderStars = (rating) => {
        return (
            <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <svg 
                        key={star} 
                        width="16" height="16" 
                        viewBox="0 0 24 24" 
                        fill={star <= rating ? "#fbbf24" : "none"} 
                        stroke={star <= rating ? "#fbbf24" : "#cbd5e1"} 
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                ))}
            </div>
        )
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

                .review-card {
                    background: #ffffff;
                    border-radius: 24px;
                    padding: 32px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 24px;
                    display: flex;
                    gap: 24px;
                    position: relative;
                }
                .review-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.1);
                    border-color: #e2e8f0;
                }
                .review-card.hidden {
                    background: #f8fafc;
                    border-color: #fee2e2;
                    opacity: 0.8;
                }

                .patient-avatar-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: 700;
                    color: #64748b;
                    flex-shrink: 0;
                }

                .review-main {
                    flex: 1;
                }

                .review-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                    flex-wrap: wrap;
                }

                .review-patient-name {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .review-doctor-link {
                    font-size: 14px;
                    font-weight: 600;
                    color: #6366f1;
                    background: #eef2ff;
                    padding: 2px 10px;
                    border-radius: 6px;
                }

                .review-content-box {
                    padding: 16px 20px;
                    background: #f8fafc;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                    color: #475569;
                    line-height: 1.6;
                    font-size: 15px;
                    margin: 16px 0;
                }

                .review-date {
                    font-size: 12px;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .admin-actions-review {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    justify-content: center;
                }

                .hide-btn-review {
                    padding: 8px 16px;
                    border-radius: 10px;
                    border: 1px solid #fee2e2;
                    background: #fff;
                    color: #ef4444;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .hide-btn-review:hover {
                    background: #ef4444;
                    color: #fff;
                    border-color: #ef4444;
                }

                .pagination-box-reviews {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 16px;
                    margin-top: 40px;
                    padding: 24px;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #f1f5f9;
                }

                .page-btn-review {
                    padding: 10px 20px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    color: #1e293b;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .page-btn-review:hover:not(:disabled) {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }
                .page-btn-review:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .ai-btn-review {
                    padding: 8px 16px; border-radius: 10px; border: none;
                    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
                    color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
                    transition: all 0.2s; display: flex; align-items: center; gap: 8px; justify-content: center;
                }
                .ai-btn-review:hover:not(:disabled) {
                    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3); transform: translateY(-1px);
                }
                .ai-btn-review:disabled {
                    opacity: 0.7; cursor: not-allowed;
                }
                .ai-result-box {
                    margin-top: 16px; padding: 16px; background: #faf5ff; border: 1px dashed #d8b4fe;
                    border-radius: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
                }
                .ai-label-item {
                    display: flex; flex-direction: column; gap: 6px;
                }
                .ai-label-header {
                    display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #4c1d95;
                }
                .ai-progress-bg {
                    height: 6px; background: #e9d5ff; border-radius: 4px; overflow: hidden;
                }
                .ai-progress-fill {
                    height: 100%; background: #9333ea; border-radius: 4px; transition: width 0.5s ease-out;
                }

            `}</style>

            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Quản lý đánh giá</h2>
                <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#64748b' }}>Giám sát phản hồi người dùng và xử lý các đánh giá vi phạm tiêu chuẩn</p>
            </div>

            {loading && reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Đang nạp danh sách đánh giá...</div>
            ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '24px' }}>💬</div>
                    <h3 style={{ margin: 0 }}>Chưa có phản hồi nào</h3>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Hệ thống chưa ghi nhận các đánh giá từ bệnh nhân vào lúc này.</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.reviewId} className={`review-card ${review.isVisible === false ? 'hidden' : ''}`}>
                            <div className="patient-avatar-box">
                                {review.patientName?.charAt(0) || "P"}
                            </div>

                            <div className="review-main">
                                <div className="review-meta">
                                    <span className="review-patient-name">{review.patientName || "Bệnh nhân"}</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                    <span className="review-doctor-link">BS. {review.doctorName || "Bác sĩ"}</span>
                                    
                                    {review.isVisible === false && (
                                        <span style={{ 
                                            fontSize: '11px', fontWeight: 800, background: '#fee2e2', 
                                            color: '#ef4444', padding: '2px 8px', borderRadius: '6px',
                                            textTransform: 'uppercase'
                                        }}>
                                            Đã ẩn vi phạm
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    {renderStars(review.rating)}
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{review.rating}/5</span>
                                </div>

                                <div className="review-content-box">
                                    {review.comment ? `"${review.comment}"` : "Không kèm theo bình luận nội dung."}
                                </div>

                                {aiResults[review.reviewId] && (
                                    <div className="ai-result-box">
                                        {Object.entries(aiResults[review.reviewId]).map(([label, percentage]) => (
                                            <div key={label} className="ai-label-item">
                                                <div className="ai-label-header">
                                                    <span>{label}</span>
                                                    <span>{percentage}%</span>
                                                </div>
                                                <div className="ai-progress-bg">
                                                    <div className="ai-progress-fill" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="review-date">
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    }) : "Thời gian không xác định"}
                                </div>
                            </div>

                            <div className="admin-actions-review">
                                {review.isVisible !== false && (
                                    <>
                                        <button 
                                            className="ai-btn-review" 
                                            onClick={() => handleAnalyze(review.reviewId, review.comment)}
                                            disabled={analyzingId === review.reviewId || !review.comment}
                                            title={!review.comment ? "Không có nội dung để phân tích" : ""}
                                        >
                                            {analyzingId === review.reviewId ? (
                                                <span>⏳ ...</span>
                                            ) : (
                                                <>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                                    </svg>
                                                    Phân tích
                                                </>
                                            )}
                                        </button>

                                        <button className="hide-btn-review" onClick={() => handleHideReview(review.reviewId)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                            Ẩn nội dung
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination-box-reviews">
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
                        Trang <strong>{page + 1}</strong> trên <strong>{totalPages}</strong>
                    </span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            className="page-btn-review"
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                        >
                            Trang trước
                        </button>
                        <button
                            className="page-btn-review"
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminReviews
