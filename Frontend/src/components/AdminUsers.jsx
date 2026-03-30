import { useState, useEffect } from "react"
import { adminService } from "../services/adminService"
import { toast } from 'react-toastify'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [blockModal, setBlockModal] = useState({ show: false, user: null, reason: "" })

    useEffect(() => {
        fetchUsers()
    }, [page])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const data = await adminService.getAllUsers(page, 10)
            setUsers(data?.content || data || [])
            setTotalPages(data?.totalPages || 1)
        } catch (err) {
            setError("Không thể tải danh sách người dùng")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleBlock = async () => {
        if (!blockModal.user || !blockModal.reason.trim()) {
            toast.warning("Vui lòng nhập lý do khóa tài khoản")
            return
        }

        try {
            await adminService.blockUser(blockModal.user.userId, blockModal.reason)
            toast.success("Đã khóa tài khoản thành công")
            setBlockModal({ show: false, user: null, reason: "" })
            fetchUsers()
        } catch (err) {
            toast.error(err.response?.data || "Không thể khóa tài khoản")
        }
    }

    const getRoleStyle = (role) => {
        const styles = {
            'ADMIN': { background: '#fefce8', color: '#854d0e', border: '#fef08a' },
            'DOCTOR': { background: '#eff6ff', color: '#1e40af', border: '#dbeafe' },
            'PATIENT': { background: '#f0fdf4', color: '#166534', border: '#dcfce7' }
        }
        return styles[role] || { background: '#f8fafc', color: '#64748b', border: '#f1f5f9' }
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

                .user-card-container {
                    background: #ffffff;
                    border-radius: 24px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
                    overflow: hidden;
                }

                .table-premium {
                    width: 100%;
                    border-collapse: collapse;
                }
                .table-premium th {
                    padding: 18px 24px;
                    background: #f8fafc;
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-align: left;
                    border-bottom: 1px solid #f1f5f9;
                }
                .table-premium td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    font-size: 14px;
                }
                .table-premium tr:last-child td {
                    border-bottom: none;
                }
                .table-premium tr:hover {
                    background: #fafbfc;
                }

                .role-badge {
                    display: inline-flex;
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 800;
                    border: 1px solid;
                }

                .status-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 600;
                    font-size: 13px;
                }

                .pagination-btn {
                    padding: 10px 20px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    color: #1e293b;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .pagination-btn:hover:not(:disabled) {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                    transform: translateY(-1px);
                }
                .pagination-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .block-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease-out;
                }
                .block-modal-content {
                    background: #ffffff;
                    border-radius: 24px;
                    padding: 32px;
                    width: 100%;
                    maxWidth: 480px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .btn-danger {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-danger:hover {
                    background: #dc2626;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }
            `}</style>

            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Quản lý người dùng</h2>
                <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#64748b' }}>Phân quyền, kiểm soát truy cập và bảo mật tài khoản toàn hệ thống</p>
            </div>

            <div className="user-card-container">
                <table className="table-premium">
                    <thead>
                        <tr>
                            <th>Hồ sơ thành viên</th>
                            <th>Vai trò</th>
                            <th>Trạng thái tài khoản</th>
                            <th style={{ textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && users.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>Đang tải danh sách...</td></tr>
                        ) : users.map(user => (
                            <tr key={user.userId}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ 
                                            width: 40, height: 40, borderRadius: 12, 
                                            background: `linear-gradient(135deg, #f1f5f9, #e2e8f0)`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 16, color: '#64748b', fontWeight: 700
                                        }}>
                                            {user.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{user.fullName}</div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span 
                                        className="role-badge"
                                        style={{
                                            background: getRoleStyle(user.role).background,
                                            color: getRoleStyle(user.role).color,
                                            borderColor: getRoleStyle(user.role).border
                                        }}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    {user.isActive ? (
                                        <div className="status-indicator" style={{ color: '#10b981' }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                                            Đang hoạt động
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="status-indicator" style={{ color: '#ef4444' }}>
                                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                                                Đã khóa
                                            </div>
                                            {user.reasonBanned && (
                                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', maxWidth: '200px' }}>
                                                    Lý do: {user.reasonBanned}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {user.role !== 'ADMIN' && user.isActive && (
                                        <button
                                            className="pagination-btn"
                                            style={{ color: '#ef4444', borderColor: '#fee2e2', padding: '6px 14px' }}
                                            onClick={() => setBlockModal({ show: true, user, reason: "" })}
                                        >
                                            Khóa tài khoản
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ 
                        padding: '24px 32px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderTop: '1px solid #f1f5f9',
                        background: '#f8fafc'
                    }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                            Trang <strong>{page + 1}</strong> trên <strong>{totalPages}</strong>
                        </span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                Trước
                            </button>
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                            >
                                Tiếp theo
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Block Modal */}
            {blockModal.show && (
                <div className="block-modal-overlay" onClick={() => setBlockModal({ show: false, user: null, reason: "" })}>
                    <div className="block-modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Xác nhận khóa tài khoản</h3>
                            <button onClick={() => setBlockModal({ show: false, user: null, reason: "" })} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}>×</button>
                        </div>
                        
                        <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                            Bạn đang thực hiện khóa tài khoản của <strong>{blockModal.user?.fullName}</strong>. Người dùng này sẽ không thể đăng nhập vào hệ thống cho đến khi được mở khóa.
                        </p>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                                Lý do khóa (Bắt buộc)
                            </label>
                            <textarea
                                value={blockModal.reason}
                                onChange={e => setBlockModal(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Nhập lý do cụ thể..."
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    minHeight: '100px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                className="pagination-btn"
                                style={{ flex: 1 }}
                                onClick={() => setBlockModal({ show: false, user: null, reason: "" })}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className="btn-danger"
                                style={{ flex: 1.5 }}
                                onClick={handleBlock}
                            >
                                Khóa tài khoản ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsers
