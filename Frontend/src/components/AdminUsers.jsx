import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
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
        fetchUsers(page)
    }, [page])

    const fetchUsers = async (pageNum) => {
        try {
            setLoading(true)
            const data = await adminService.getAllUsers(pageNum, 10)
            setUsers(data?.content || [])
            setTotalPages(data?.totalPages || 0)
        } catch (err) {
            setError("Không thể nạp danh sách người dùng")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleBlock = async () => {
        if (!blockModal.user || !blockModal.reason.trim()) {
            toast.warning("Vui lòng nhập lý do khóa")
            return
        }

        try {
            await adminService.blockUser(blockModal.user.userId, blockModal.reason)
            toast.success("Đã khóa tài khoản người dùng")
            setBlockModal({ show: false, user: null, reason: "" })
            fetchUsers(page)
        } catch (err) {
            toast.error(err.response?.data || "Không thể khóa tài khoản")
        }
    }

    const handleUnblock = async (userId) => {
        if (!window.confirm("Mở khóa tài khoản này?")) return
        try {
            await adminService.unblockUser(userId)
            toast.success("Đã mở khóa tài khoản")
            fetchUsers(page)
        } catch (err) {
            toast.error(err.response?.data || "Không thể mở khóa")
        }
    }

    const getRoleBadge = (role) => {
        const styles = {
            ADMIN: { bg: '#fee2e2', color: '#dc2626', icon: '👑' },
            DOCTOR: { bg: '#eef2ff', color: '#4f46e5', icon: '👨‍⚕️' },
            PATIENT: { bg: '#f0fdf4', color: '#16a34a', icon: '👤' }
        }
        const s = styles[role] || { bg: '#f1f5f9', color: '#475569', icon: '❓' }
        return (
            <span style={{ 
                background: s.bg, color: s.color, 
                padding: '4px 10px', borderRadius: '8px', 
                fontSize: '12px', fontWeight: 800,
                display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}>
                {s.icon} {role}
            </span>
        )
    }

    return (
        <div className="reveal">
            <style>{`
                .premium-table { width: 100%; border-collapse: separate; border-spacing: 0 12px; }
                .premium-table th { padding: 16px; text-align: left; color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
                .premium-table tr td { padding: 16px; background: white; transition: all 0.2s; }
                .premium-table tr td:first-child { border-radius: 16px 0 0 16px; border-left: 1px solid #f1f5f9; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
                .premium-table tr td:last-child { border-radius: 0 16px 16px 0; border-right: 1px solid #f1f5f9; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
                .premium-table tr:hover td { background: #f8fafc; transform: scaleY(1.02); border-color: #e2e8f0; }
                .user-avatar { width: 44px; height: 44px; border-radius: 14px; background: #f1f5f9; overflow: hidden; display: flex; alignItems: center; justifyContent: center; font-weight: 800; color: #64748b; }
                .pagination-dot { width: 8px; height: 8px; border-radius: 50%; background: #e2e8f0; cursor: pointer; transition: all 0.2s; }
                .pagination-dot.active { background: #6366f1; transform: scale(1.5); }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Quản lý người dùng</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#64748b' }}>Phân quyền, kiểm soát trạng thái hoạt động toàn hệ thống.</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="skeleton-pulse" style={{ height: '400px', borderRadius: '24px' }} />
                </div>
            ) : (
                <>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Thành viên</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'right' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.userId}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div className="user-avatar">
                                                {u.avatarUrl ? (
                                                    <img src={u.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                         onError={(e) => { e.target.src = ''; e.target.parentElement.innerHTML = u.fullName?.charAt(0) || 'U' }} />
                                                ) : (
                                                    u.fullName?.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '15px' }}>{u.fullName}</div>
                                                <div style={{ color: '#94a3b8', fontSize: '12px' }}>{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{getRoleBadge(u.role)}</td>
                                    <td>
                                        {u.isActive ? (
                                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Hoạt động
                                            </span>
                                        ) : (
                                            <div>
                                                <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Bị khóa
                                                </span>
                                                {u.reasonBanned && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', maxWidth: '150px' }}>{u.reasonBanned}</div>}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {u.role !== 'ADMIN' && (
                                            u.isActive ? (
                                                <button 
                                                    onClick={() => setBlockModal({ show: true, user: u, reason: "" })}
                                                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                    Khóa
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleUnblock(u.userId)}
                                                    style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                    Mở khóa
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '32px' }}>
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ background: 'none', border: 'none', color: page === 0 ? '#cbd5e1' : '#6366f1', fontWeight: 800, cursor: 'pointer' }}>← Trước</button>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[...Array(totalPages)].map((_, i) => (
                                <div key={i} className={`pagination-dot ${page === i ? 'active' : ''}`} onClick={() => setPage(i)} />
                            ))}
                        </div>
                        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ background: 'none', border: 'none', color: page >= totalPages - 1 ? '#cbd5e1' : '#6366f1', fontWeight: 800, cursor: 'pointer' }}>Sau →</button>
                    </div>
                </>
            )}

            {blockModal.show && createPortal(
                <div 
                    className="modal-overlay"
                    onClick={() => setBlockModal({ show: false, user: null, reason: "" })}
                >
                    <div 
                        className="modal-content" 
                        style={{ maxWidth: '480px', padding: '32px' }} 
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: 800 }}>Khóa tài khoản</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Lý do khóa tài khoản của <b>{blockModal.user?.fullName}</b>:</p>
                        <textarea 
                            value={blockModal.reason}
                            onChange={e => setBlockModal({ ...blockModal, reason: e.target.value })}
                            placeholder="Nhập lý do chi tiết..."
                            style={{ width: '100%', minHeight: '100px', padding: '16px', borderRadius: '16px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '14px', marginBottom: '24px' }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setBlockModal({ show: false, user: null, reason: "" })} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Hủy</button>
                            <button onClick={handleBlock} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Gửi lệnh khóa</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default AdminUsers
