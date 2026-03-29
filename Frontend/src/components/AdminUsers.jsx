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
            setUsers(data.content || data || [])
            setTotalPages(data.totalPages || 1)
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
            setBlockModal({ show: false, user: null, reason: "" })
            fetchUsers()
        } catch (err) {
            toast.error(err.response?.data || "Không thể khóa tài khoản")
        }
    }

    const getRoleStyle = (role) => {
        const styles = {
            'ADMIN': { background: '#fef3c7', color: '#d97706' },
            'DOCTOR': { background: '#dbeafe', color: '#2563eb' },
            'PATIENT': { background: '#dcfce7', color: '#16a34a' }
        }
        return styles[role] || { background: '#f3f4f6', color: '#6b7280' }
    }

    if (loading && users.length === 0) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    if (error) {
        return <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>{error}</div>
    }

    return (
        <div>
            <h3 style={{ margin: '0 0 20px', color: '#333' }}>Quản lý người dùng</h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Người dùng</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Vai trò</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Trạng thái</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ fontWeight: '500' }}>{user.fullName}</div>
                                    <div style={{ color: '#6b7280', fontSize: '13px' }}>{user.email}</div>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        ...getRoleStyle(user.role)
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    {user.isActive ? (
                                        <span style={{ color: '#16a34a' }}>✓ Hoạt động</span>
                                    ) : (
                                        <div>
                                            <span style={{ color: '#dc2626' }}>✗ Đã khóa</span>
                                            {user.reasonBanned && (
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    Lý do: {user.reasonBanned}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                    {user.role !== 'ADMIN' && user.isActive && (
                                        <button
                                            type="button"
                                            onClick={() => setBlockModal({ show: true, user, reason: "" })}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '6px',
                                                border: '1px solid #ef4444',
                                                background: 'white',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontSize: '13px'
                                            }}
                                        >
                                            Khóa
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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

            {/* Block Modal */}
            {blockModal.show && (
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
                    onClick={() => setBlockModal({ show: false, user: null, reason: "" })}
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
                        <h3 style={{ margin: '0 0 16px' }}>Khóa tài khoản</h3>
                        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                            Khóa tài khoản: <strong>{blockModal.user?.fullName}</strong>
                        </p>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Lý do khóa *
                            </label>
                            <textarea
                                value={blockModal.reason}
                                onChange={e => setBlockModal(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Nhập lý do khóa tài khoản..."
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
                                onClick={() => setBlockModal({ show: false, user: null, reason: "" })}
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
                                onClick={handleBlock}
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
                                Khóa tài khoản
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsers
