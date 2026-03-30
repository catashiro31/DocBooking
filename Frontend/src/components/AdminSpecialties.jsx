import { useState, useEffect } from "react"
import { adminService } from "../services/adminService"
import { toast } from 'react-toastify'

const AdminSpecialties = () => {
    const [specialties, setSpecialties] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({ name: "", description: "" })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchSpecialties()
    }, [])

    const fetchSpecialties = async () => {
        try {
            setLoading(true)
            const data = await adminService.getAllSpecialties()
            const list = Array.isArray(data) ? data : []
            setSpecialties(list.map(s => ({ 
                ...s, 
                id: s.specialtyId || s.id, 
                name: s.specialtyName || s.name 
            })))
        } catch (err) {
            setError("Không thể tải danh sách chuyên khoa")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item)
            setFormData({ name: item.name || "", description: item.description || "" })
        } else {
            setEditingItem(null)
            setFormData({ name: "", description: "" })
        }
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.warning("Vui lòng nhập tên chuyên khoa")
            return
        }

        setSubmitting(true)
        try {
            if (editingItem) {
                await adminService.updateSpecialty(editingItem.id, formData)
                toast.success("Cập nhật chuyên khoa thành công")
            } else {
                await adminService.addSpecialty(formData)
                toast.success("Thêm chuyên khoa mới thành công")
            }
            setShowModal(false)
            fetchSpecialties()
        } catch (err) {
            toast.error(err.response?.data || "Không thể lưu chuyên khoa")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa chuyên khoa này? Hành động này không thể hoàn tác.")) return

        try {
            await adminService.deleteSpecialty(id)
            toast.success("Đã xóa chuyên khoa")
            setSpecialties(prev => prev.filter(s => s.id !== id))
        } catch (err) {
            toast.error(err.response?.data || "Không thể xóa chuyên khoa")
        }
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

                .specialty-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px;
                }

                .specialty-card {
                    background: #ffffff;
                    border-radius: 24px;
                    padding: 32px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }
                .specialty-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    border-color: #6366f1;
                }

                .specialty-icon-box {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    background: #eef2ff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-bottom: 24px;
                }

                .specialty-status {
                    position: absolute;
                    top: 32px;
                    right: 32px;
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .specialty-name {
                    font-size: 20px;
                    font-weight: 800;
                    color: #1e293b;
                    margin: 0 0 12px;
                }

                .specialty-desc {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.6;
                    flex: 1;
                    margin-bottom: 24px;
                }

                .card-actions {
                    display: flex;
                    gap: 12px;
                }

                .btn-card {
                    flex: 1;
                    padding: 10px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    color: #475569;
                }
                .btn-card:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                    color: #1e293b;
                }

                .add-btn {
                    padding: 12px 24px;
                    border-radius: 14px;
                    border: none;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: white;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
                    transition: all 0.2s;
                }
                .add-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.4);
                }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(8px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    padding: 20px;
                }
                .modal-content {
                    background: #ffffff;
                    border-radius: 24px;
                    padding: 32px;
                    width: 100%;
                    max-width: 500px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .input-group {
                    margin-bottom: 20px;
                }
                .input-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 8px;
                }
                .input-group input, .input-group textarea {
                    width: 100%;
                    padding: 14px;
                    border-radius: 14px;
                    border: 1px solid #e2e8f0;
                    font-size: 15px;
                    background: #f8fafc;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-group input:focus, .input-group textarea:focus {
                    border-color: #6366f1;
                    background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Quản lý chuyên khoa</h2>
                    <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#64748b' }}>Thiết lập danh mục chuyên môn y tế cho hệ thống đặt lịch</p>
                </div>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>Thêm chuyên khoa</span>
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Đang nạp dữ liệu chuyên khoa...</div>
            ) : specialties.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
                    <h3 style={{ margin: 0 }}>Danh mục trống</h3>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Nhấn nút thêm ở trên để bắt đầu định nghĩa chuyên khoa</p>
                </div>
            ) : (
                <div className="specialty-grid">
                    {specialties.map(specialty => (
                        <div key={specialty.id} className="specialty-card">
                            <span 
                                className="specialty-status"
                                style={{ 
                                    background: specialty.isActive ? '#f0fdf4' : '#fef2f2',
                                    color: specialty.isActive ? '#16a34a' : '#dc2626'
                                }}
                            >
                                {specialty.isActive ? 'Hoạt động' : 'Đã ẩn'}
                            </span>
                            
                            <div className="specialty-icon-box">⚕️</div>
                            
                            <h3 className="specialty-name">{specialty.name}</h3>
                            <p className="specialty-desc">{specialty.description || "Không có mô tả chi tiết cho chuyên khoa y tế này."}</p>
                            
                            <div className="card-actions">
                                <button className="btn-card" onClick={() => handleOpenModal(specialty)}>Chỉnh sửa</button>
                                <button 
                                    className="btn-card" 
                                    style={{ color: '#ef4444' }}
                                    onClick={() => handleDelete(specialty.id)}
                                >
                                    Gỡ bỏ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
                                {editingItem ? 'Cập nhật chuyên khoa' : 'Thêm chuyên khoa mới'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Tên chuyên khoa *</label>
                                <input 
                                    type="text" 
                                    placeholder="Ví dụ: Nội tiết, Chỉnh hình..."
                                    value={formData.name}
                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                />
                            </div>

                            <div className="input-group">
                                <label>Mô tả tóm tắt</label>
                                <textarea 
                                    placeholder="Mô tả về lĩnh vực điều trị và phạm vi chuyên môn..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button type="button" className="btn-card" style={{ flex: 1, padding: '14px' }} onClick={() => setShowModal(false)}>Hủy bỏ</button>
                                <button 
                                    type="submit" 
                                    className="add-btn" 
                                    style={{ flex: 2, justifyContent: 'center', padding: '14px' }}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Đang lưu...' : (editingItem ? 'Lưu thay đổi' : 'Tạo mới ngay')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminSpecialties
