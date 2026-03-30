import { useState, useEffect } from "react"
import { patientService } from "../services/patientService"
import { toast } from 'react-toastify'

const RelativeManagement = () => {
    const [relatives, setRelatives] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingRelative, setEditingRelative] = useState(null)
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "MALE",
        relationship: "",
        address: ""
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchRelatives()
    }, [])

    const fetchRelatives = async () => {
        try {
            setLoading(true)
            const data = await patientService.getRelatives()
            setRelatives(Array.isArray(data) ? data : [])
        } catch (err) {
            setError("Không thể tải danh sách người thân")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (relative = null) => {
        if (relative) {
            setEditingRelative(relative)
            setFormData({
                fullName: relative.fullName || "",
                phoneNumber: relative.phoneNumber || "",
                dateOfBirth: relative.dateOfBirth || "",
                gender: relative.gender || "MALE",
                relationship: relative.relationship || "",
                address: relative.address || ""
            })
        } else {
            setEditingRelative(null)
            setFormData({
                fullName: "",
                phoneNumber: "",
                dateOfBirth: "",
                gender: "MALE",
                relationship: "",
                address: ""
            })
        }
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            if (editingRelative) {
                await patientService.updateRelative(editingRelative.patientId, formData)
                toast.success("Cập nhật hồ sơ thành công")
            } else {
                await patientService.addRelative(formData)
                toast.success("Thêm người thân thành công")
            }
            setShowModal(false)
            fetchRelatives()
        } catch (err) {
            toast.error(err.response?.data || "Không thể lưu thông tin")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa hồ sơ này?")) return

        try {
            await patientService.deleteRelative(id)
            setRelatives(prev => prev.filter(r => r.patientId !== id))
            toast.success("Đã xóa hồ sơ")
        } catch (err) {
            toast.error(err.response?.data || "Không thể xóa hồ sơ")
        }
    }

    const getGenderStyles = (gender) => {
        switch (gender) {
            case 'MALE': return { bg: '#e0f2fe', color: '#0369a1', text: 'Nam' }
            case 'FEMALE': return { bg: '#fdf2f8', color: '#be185d', text: 'Nữ' }
            default: return { bg: '#f1f5f9', color: '#475569', text: gender }
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton" style={{ height: '240px', width: '100%', borderRadius: '20px' }} />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="reveal" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <h3 style={{ color: '#ef4444', margin: '0 0 8px' }}>Lỗi tải dữ liệu</h3>
                <p style={{ color: '#64748b' }}>{error}</p>
                <button 
                    onClick={fetchRelatives}
                    style={{ marginTop: '16px', color: '#6366f1', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                >
                    Thử lại
                </button>
            </div>
        )
    }

    return (
        <div className="reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Hồ sơ người thân</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>Quản lý thông tin y tế cho gia đình bạn.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                    }}
                >
                    <span style={{ fontSize: '18px' }}>+</span> Thêm người thân
                </button>
            </div>

            {relatives.length === 0 ? (
                <div 
                    className="premium-card" 
                    style={{ textAlign: 'center', padding: '80px 40px', background: 'linear-gradient(to bottom, #fff, #f8fafc)' }}
                >
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', 
                        background: '#eef2ff', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' 
                    }}>
                        👨‍👩‍👧
                    </div>
                    <h3 style={{ color: '#1e293b', margin: '0 0 8px', fontSize: '20px', fontWeight: 800 }}>Chưa có hồ sơ nào</h3>
                    <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '360px', margin: '0 auto 28px' }}>
                        Hãy thêm thông tin người thân để bạn có thể dễ dàng đặt lịch khám cho cả gia đình.
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        style={{ background: 'none', border: '2px dashed #6366f1', color: '#6366f1', padding: '10px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                        Bắt đầu ngay
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {relatives.map(relative => {
                        const gender = getGenderStyles(relative.gender);
                        return (
                            <div
                                key={relative.patientId}
                                className="premium-card"
                                style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: gender.bg }} />
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ 
                                            width: '48px', height: '48px', borderRadius: '14px', 
                                            background: '#f1f5f9', display: 'flex', alignItems: 'center', 
                                            justifyContent: 'center', fontSize: '20px' 
                                        }}>
                                            👤
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: 800 }}>{relative.fullName}</h4>
                                            <span style={{ 
                                                fontSize: '12px', fontWeight: 700, 
                                                color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' 
                                            }}>
                                                {relative.relationship || 'Người thân'}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ 
                                        padding: '4px 10px', borderRadius: '8px', 
                                        background: gender.bg, color: gender.color, 
                                        fontSize: '11px', fontWeight: 800 
                                    }}>
                                        {gender.text}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', color: '#475569', fontSize: '14px', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '16px', opacity: 0.7 }}>📱</span>
                                        <span style={{ fontWeight: 600 }}>{relative.phoneNumber || 'Chưa cập nhật'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '16px', opacity: 0.7 }}>🎂</span>
                                        <span style={{ fontWeight: 600 }}>{relative.dateOfBirth || 'Chưa cập nhật'}</span>
                                    </div>
                                    {relative.address && (
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}>
                                            <span style={{ fontSize: '16px', opacity: 0.7 }}>📍</span>
                                            <span style={{ lineHeight: 1.4, color: '#64748b' }}>{relative.address}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleOpenModal(relative)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            background: '#fff',
                                            color: '#1e293b',
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                    >
                                        ✏️ Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(relative.patientId)}
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '12px',
                                            border: '1px solid #fee2e2',
                                            background: '#fff',
                                            color: '#ef4444',
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div
                    className="glass"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(8px)'
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="premium-card reveal"
                        style={{
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            padding: '32px'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>
                                {editingRelative ? 'Cập nhật hồ sơ' : 'Thêm người thân'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#cbd5e1' }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
                                        Họ và tên <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        placeholder="Nhập tên đầy đủ..."
                                        required
                                        className="premium-input-style"
                                        style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                                            border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>Số điện thoại</label>
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                            placeholder="09xx..."
                                            style={{
                                                width: '100%', padding: '12px 16px', borderRadius: '12px',
                                                border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>Mối quan hệ</label>
                                        <input
                                            type="text"
                                            value={formData.relationship}
                                            onChange={e => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                                            placeholder="Con, Bố, Mẹ..."
                                            style={{
                                                width: '100%', padding: '12px 16px', borderRadius: '12px',
                                                border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>Ngày sinh</label>
                                        <input
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                            style={{
                                                width: '100%', padding: '12px 16px', borderRadius: '12px',
                                                border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>Giới tính</label>
                                        <select
                                            value={formData.gender}
                                            onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                            style={{
                                                width: '100%', padding: '12px 16px', borderRadius: '12px',
                                                border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box',
                                                fontFamily: 'inherit', background: '#fff'
                                            }}
                                        >
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>Địa chỉ liên hệ</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder="Nhập địa chỉ cư trú..."
                                        style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                                            border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box',
                                            minHeight: '80px', resize: 'none', fontFamily: 'inherit'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        flex: 1, padding: '14px', borderRadius: '14px',
                                        border: '1px solid #e2e8f0', background: '#fff',
                                        fontWeight: '700', cursor: 'pointer'
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        flex: 2, padding: '14px', borderRadius: '14px',
                                        border: 'none', background: submitting ? '#cbd5e1' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        color: 'white', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)'
                                    }}
                                >
                                    {submitting ? '⏳ Đang lưu...' : 'Lưu hồ sơ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RelativeManagement
