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
            setSpecialties(Array.isArray(data) ? data : [])
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
            } else {
                await adminService.addSpecialty(formData)
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
            setSpecialties(prev => prev.filter(s => s.id !== id))
        } catch (err) {
            toast.error(err.response?.data || "Không thể xóa chuyên khoa (có thể đang được sử dụng)")
        }
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    if (error) {
        return <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>{error}</div>
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>Quản lý chuyên khoa</h3>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#5f6dfc',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    + Thêm chuyên khoa
                </button>
            </div>

            {specialties.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <p style={{ fontSize: '18px' }}>Chưa có chuyên khoa nào</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {specialties.map(specialty => (
                        <div
                            key={specialty.id}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: '1px solid #e5e7eb'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 8px', color: '#333' }}>{specialty.name}</h4>
                                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: 1.5 }}>
                                        {specialty.description || 'Không có mô tả'}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    background: specialty.isActive ? '#dcfce7' : '#fee2e2',
                                    color: specialty.isActive ? '#16a34a' : '#dc2626'
                                }}>
                                    {specialty.isActive ? 'Hoạt động' : 'Ẩn'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                <button
                                    onClick={() => handleOpenModal(specialty)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #5f6dfc',
                                        background: 'white',
                                        color: '#5f6dfc',
                                        cursor: 'pointer',
                                        fontSize: '13px'
                                    }}
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(specialty.id)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #ef4444',
                                        background: 'white',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        fontSize: '13px'
                                    }}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
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
                    onClick={() => setShowModal(false)}
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
                        <h3 style={{ margin: '0 0 20px' }}>
                            {editingItem ? 'Sửa chuyên khoa' : 'Thêm chuyên khoa mới'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                    Tên chuyên khoa *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="VD: Tim mạch, Nhi khoa..."
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Mô tả ngắn về chuyên khoa..."
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
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
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: submitting ? '#ccc' : '#5f6dfc',
                                        color: 'white',
                                        cursor: submitting ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {submitting ? 'Đang lưu...' : 'Lưu'}
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
