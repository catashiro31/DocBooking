import { useState, useEffect } from "react"
import { adminService } from "../services/adminService"

const AdminFacilities = () => {
    const [facilities, setFacilities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({ name: "", address: "", description: "" })
    const [imageFile, setImageFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchFacilities()
    }, [])

    const fetchFacilities = async () => {
        try {
            setLoading(true)
            const data = await adminService.getAllFacilities()
            setFacilities(Array.isArray(data) ? data : [])
        } catch (err) {
            setError("Không thể tải danh sách cơ sở y tế")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item)
            setFormData({ 
                name: item.name || "", 
                address: item.address || "",
                description: item.description || ""
            })
        } else {
            setEditingItem(null)
            setFormData({ name: "", address: "", description: "" })
        }
        setImageFile(null)
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên cơ sở")
            return
        }
        if (!formData.address?.trim()) {
            alert("Vui lòng nhập địa chỉ")
            return
        }

        setSubmitting(true)
        try {
            const payload = { ...formData, file: imageFile || undefined }
            if (editingItem) {
                await adminService.updateFacility(editingItem.id, payload)
            } else {
                await adminService.addFacility(payload)
            }
            setShowModal(false)
            fetchFacilities()
        } catch (err) {
            alert(err.response?.data || "Không thể lưu cơ sở y tế")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa cơ sở y tế này? Hành động này không thể hoàn tác.")) return

        try {
            await adminService.deleteFacility(id)
            setFacilities(prev => prev.filter(f => f.id !== id))
        } catch (err) {
            alert(err.response?.data || "Không thể xóa cơ sở (có thể đang được sử dụng)")
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
                <h3 style={{ margin: 0, color: '#333' }}>Quản lý cơ sở y tế</h3>
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
                    + Thêm cơ sở
                </button>
            </div>

            {facilities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <p style={{ fontSize: '18px' }}>Chưa có cơ sở y tế nào</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {facilities.map(facility => (
                        <div
                            key={facility.id}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h4 style={{ margin: 0, color: '#333' }}>{facility.name}</h4>
                                    {facility.imageUrl && (
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            background: '#e0e7ff',
                                            color: '#4338ca'
                                        }}>
                                            Có ảnh
                                        </span>
                                    )}
                                </div>
                                <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                    {facility.address && <span>📍 {facility.address}</span>}
                                    {facility.description && <span>{facility.description.length > 80 ? `${facility.description.slice(0, 80)}…` : facility.description}</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleOpenModal(facility)}
                                    style={{
                                        padding: '8px 16px',
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
                                    onClick={() => handleDelete(facility.id)}
                                    style={{
                                        padding: '8px 16px',
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
                            maxWidth: '450px',
                            width: '90%'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 20px' }}>
                            {editingItem ? 'Sửa cơ sở y tế' : 'Thêm cơ sở y tế mới'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                    Tên cơ sở *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="VD: Bệnh viện Đa khoa ABC..."
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
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    placeholder="Nhập địa chỉ cơ sở..."
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
                                    placeholder="Giới thiệu ngắn về cơ sở..."
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        boxSizing: 'border-box',
                                        minHeight: '72px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                    Ảnh cơ sở (tùy chọn)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                                    style={{ width: '100%' }}
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

export default AdminFacilities
