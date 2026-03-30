import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
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

    const validateForm = () => {
        if (!formData.fullName.trim()) return "Họ tên không được để trống"
        if (!formData.phoneNumber.match(/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/)) {
            return "Số điện thoại không đúng định dạng Việt Nam"
        }
        if (!formData.dateOfBirth) return "Vui lòng chọn ngày sinh"
        if (!formData.relationship.trim()) return "Vui lòng nhập mối quan hệ"
        if (!formData.address.trim()) return "Địa chỉ không được để trống"
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const errorMsg = validateForm()
        if (errorMsg) {
            toast.error(errorMsg)
            return
        }

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

    const getGenderLabel = (gender) => {
        return gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : 'Khác'
    }

    if (loading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton-pulse" style={{ height: '180px', width: '100%', borderRadius: '24px', background: '#f1f5f9' }} />
                ))}
            </div>
        )
    }

    return (
        <div className="reveal">
            <style>{`
                .relative-card {
                    background: white;
                    border-radius: 24px;
                    padding: 24px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .relative-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
                    border-color: #6366f1;
                }
                .relative-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 4px; height: 100%;
                    background: #6366f1;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .relative-card:hover::before {
                    opacity: 1;
                }
                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                    color: #475569;
                    font-size: 14px;
                }
                .info-icon {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    border-radius: 8px;
                    font-size: 12px;
                }
                .floating-label-input {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .floating-label-input label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                    margin-left: 4px;
                }
                .floating-label-input input, .floating-label-input select {
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: 1.5px solid #e2e8f0;
                    font-size: 15px;
                    color: #1e293b;
                    outline: none;
                    transition: all 0.2s;
                }
                .floating-label-input input:focus, .floating-label-input select:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }
            `}</style>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Hồ sơ người thân</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#64748b' }}>Lưu trữ thông tin để đặt lịch khám nhanh chóng hơn.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '14px 28px',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Thêm hồ sơ mới
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {relatives.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', background: '#f8fafc', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
                        <h3 style={{ color: '#64748b', margin: 0 }}>Chưa có hồ sơ người thân nào</h3>
                        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Hãy nhấn vào nút "Thêm hồ sơ mới" để bắt đầu.</p>
                    </div>
                ) : (
                    relatives.map(r => (
                        <div key={r.patientId} className="relative-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: r.gender === 'MALE' ? '#e0f2fe' : '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                        {r.gender === 'MALE' ? '👨' : '👩'}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{r.fullName}</h3>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.relationship}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleOpenModal(r)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                    <button onClick={() => handleDelete(r.patientId)} style={{ background: '#fee2e2', border: 'none', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <div className="info-icon">🎂</div>
                                <span>{new Date(r.dateOfBirth).toLocaleDateString('vi-VN')} ({getGenderLabel(r.gender)})</span>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">📞</div>
                                <span>{r.phoneNumber}</span>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">📍</div>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.address}</span>
                            </div>
                            
                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' }}>
                                <button style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 700, color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    Xem lịch sử khám bệnh
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && createPortal(
                <div 
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="modal-content" 
                        style={{ maxWidth: '600px', padding: '40px' }} 
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                {editingRelative ? 'Chỉnh sửa hồ sơ' : 'Thêm người thân mới'}
                            </h3>
                            <button 
                                onClick={() => setShowModal(false)} 
                                style={{ 
                                    background: '#f8fafc', 
                                    border: 'none', 
                                    width: '36px', 
                                    height: '36px', 
                                    borderRadius: '50%', 
                                    cursor: 'pointer', 
                                    color: '#64748b', 
                                    fontSize: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >×</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="floating-label-input">
                                    <label>Họ tên đầy đủ *</label>
                                    <input type="text" placeholder="VD: Nguyễn Văn A" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required />
                                </div>
                                <div className="floating-label-input">
                                    <label>Số điện thoại *</label>
                                    <input type="tel" placeholder="VD: 0987654321" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} required />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="floating-label-input">
                                    <label>Ngày sinh *</label>
                                    <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} required />
                                </div>
                                <div className="floating-label-input">
                                    <label>Giới tính *</label>
                                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} required>
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                    </select>
                                </div>
                            </div>

                            <div className="floating-label-input">
                                <label>Mối quan hệ *</label>
                                <input type="text" placeholder="VD: Bố, Mẹ, Con, Vợ..." value={formData.relationship} onChange={e => setFormData({ ...formData, relationship: e.target.value })} required />
                            </div>

                            <div className="floating-label-input">
                                <label>Địa chỉ liên lạc *</label>
                                <input type="text" placeholder="Nhập địa chỉ chi tiết" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>Hủy bỏ</button>
                                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', background: submitting ? '#cbd5e1' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '15px', boxShadow: submitting ? 'none' : '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>
                                    {submitting ? 'Đang lưu...' : editingRelative ? 'Cập nhật hồ sơ' : 'Lưu hồ sơ ngay'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default RelativeManagement
