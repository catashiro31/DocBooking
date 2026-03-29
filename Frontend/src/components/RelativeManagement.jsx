import { useState, useEffect } from "react"
import { patientService } from "../services/patientService"

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
            } else {
                await patientService.addRelative(formData)
            }
            setShowModal(false)
            fetchRelatives()
        } catch (err) {
            alert(err.response?.data || "Không thể lưu thông tin")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa hồ sơ này?")) return

        try {
            await patientService.deleteRelative(id)
            setRelatives(prev => prev.filter(r => r.patientId !== id))
        } catch (err) {
            alert(err.response?.data || "Không thể xóa hồ sơ")
        }
    }

    const getGenderText = (gender) => {
        switch (gender) {
            case 'MALE': return 'Nam'
            case 'FEMALE': return 'Nữ'
            default: return gender
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
                <h3 style={{ margin: 0, color: '#333' }}>Hồ sơ người thân</h3>
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
                    + Thêm người thân
                </button>
            </div>

            {relatives.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>Chưa có hồ sơ người thân nào</p>
                    <p style={{ fontSize: '14px' }}>Thêm hồ sơ người thân để đặt lịch khám cho họ</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {relatives.map(relative => (
                        <div
                            key={relative.patientId}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 8px', color: '#333' }}>{relative.fullName}</h4>
                                    <div style={{ 
                                        display: 'inline-block',
                                        padding: '2px 8px', 
                                        background: '#e0e7ff', 
                                        color: '#4338ca',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        marginBottom: '12px'
                                    }}>
                                        {relative.relationship || 'Người thân'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div>📱 {relative.phoneNumber || 'Chưa cập nhật'}</div>
                                <div>🎂 {relative.dateOfBirth || 'Chưa cập nhật'}</div>
                                <div>👤 {getGenderText(relative.gender)}</div>
                                {relative.address && <div>📍 {relative.address}</div>}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                <button
                                    onClick={() => handleOpenModal(relative)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #5f6dfc',
                                        background: 'white',
                                        color: '#5f6dfc',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(relative.patientId)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #ef4444',
                                        background: 'white',
                                        color: '#ef4444',
                                        cursor: 'pointer'
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
                            width: '90%',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: '20px' }}>
                            {editingRelative ? 'Sửa hồ sơ người thân' : 'Thêm người thân mới'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #d1d5db',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #d1d5db',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                            Ngày sinh
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #d1d5db',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                            Giới tính
                                        </label>
                                        <select
                                            value={formData.gender}
                                            onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #d1d5db',
                                                boxSizing: 'border-box'
                                            }}
                                        >
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                        Mối quan hệ
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.relationship}
                                        onChange={e => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                                        placeholder="VD: Con, Bố, Mẹ, Vợ, Chồng..."
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #d1d5db',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                        Địa chỉ
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #d1d5db',
                                            minHeight: '60px',
                                            resize: 'vertical',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
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

export default RelativeManagement
