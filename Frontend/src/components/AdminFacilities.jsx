import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { adminService } from "../services/adminService"
import { toast } from 'react-toastify'

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
            const list = Array.isArray(data) ? data : []
            setFacilities(list.map(f => ({ 
                ...f, 
                id: f.facilityId || f.id, 
                name: f.facilityName || f.name 
            })))
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
            toast.warning("Vui lòng nhập tên cơ sở")
            return
        }
        if (!formData.address?.trim()) {
            toast.warning("Vui lòng nhập địa chỉ")
            return
        }

        setSubmitting(true)
        try {
            const payload = { ...formData, file: imageFile || undefined }
            if (editingItem) {
                await adminService.updateFacility(editingItem.id, payload)
                toast.success("Cập nhật cơ sở y tế thành công")
            } else {
                await adminService.addFacility(payload)
                toast.success("Thêm cơ sở y tế mới thành công")
            }
            setShowModal(false)
            fetchFacilities()
        } catch (err) {
            toast.error(err.response?.data || "Không thể lưu cơ sở y tế")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa cơ sở y tế này? Hành động này không thể hoàn tác.")) return

        try {
            await adminService.deleteFacility(id)
            toast.success("Đã xóa cơ sở y tế")
            setFacilities(prev => prev.filter(f => f.id !== id))
        } catch (err) {
            toast.error(err.response?.data || "Không thể xóa cơ sở y tế")
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

                .facility-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 24px;
                }

                .facility-card {
                    background: #ffffff;
                    border-radius: 24px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .facility-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    border-color: #6366f1;
                }

                .facility-image {
                    width: 100%;
                    height: 180px;
                    background: #f1f5f9;
                    object-fit: cover;
                }

                .facility-placeholder {
                    width: 100%;
                    height: 180px;
                    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    color: #6366f1;
                }

                .facility-content {
                    padding: 24px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .facility-name {
                    font-size: 18px;
                    font-weight: 800;
                    color: #1e293b;
                    margin: 0 0 8px;
                }

                .facility-address {
                    font-size: 13px;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 12px;
                }

                .facility-desc {
                    font-size: 14px;
                    color: #475569;
                    line-height: 1.5;
                    margin-bottom: 24px;
                    flex: 1;
                }

                .card-actions {
                    display: flex;
                    gap: 12px;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 20px;
                }

                .btn-card-action {
                    flex: 1;
                    padding: 10px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    color: #475569;
                }
                .btn-card-action:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                    color: #1e293b;
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
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 6px;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px 14px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.2s;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: #6366f1;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .file-upload-box {
                    border: 2px dashed #e2e8f0;
                    border-radius: 14px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .file-upload-box:hover {
                    border-color: #6366f1;
                    background: #f5f3ff;
                }
                .file-upload-box input {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    cursor: pointer;
                }

                .add-facility-btn {
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: white;
                    border-radius: 14px;
                    border: none;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
                    transition: all 0.2s;
                }
                .add-facility-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.4);
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Cơ sở y tế</h2>
                    <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#64748b' }}>Quản lý hệ thống bệnh viện, phòng khám liên kết trên nền tảng</p>
                </div>
                <button className="add-facility-btn" onClick={() => handleOpenModal()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>Thêm cơ sở</span>
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Đang nạp dữ liệu cơ sở y tế...</div>
            ) : facilities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏥</div>
                    <h3 style={{ margin: 0 }}>Mạng lưới trống</h3>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Nhấn nút "Thêm cơ sở" để mở rộng mạng lưới liên kết y tế</p>
                </div>
            ) : (
                <div className="facility-grid">
                    {facilities.map(facility => (
                        <div key={facility.id} className="facility-card">
                            {facility.imageUrl ? (
                                <img src={facility.imageUrl} alt={facility.name} className="facility-image" />
                            ) : (
                                <div className="facility-placeholder">🏥</div>
                            )}
                            
                            <div className="facility-content">
                                <h3 className="facility-name">{facility.name}</h3>
                                <div className="facility-address">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    {facility.address || 'Đang cập nhật địa chỉ'}
                                </div>
                                <p className="facility-desc">
                                    {facility.description || 'Không có mô tả thông tin cho cơ sở y tế này.'}
                                </p>
                                
                                <div className="card-actions">
                                    <button className="btn-card-action" onClick={() => handleOpenModal(facility)}>Chỉnh sửa</button>
                                    <button className="btn-card-action" style={{ color: '#ef4444' }} onClick={() => handleDelete(facility.id)}>Gỡ bỏ</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && createPortal(
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" style={{ maxWidth: '500px', padding: '32px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
                                {editingItem ? 'Cập nhật cơ sở' : 'Thêm cơ sở mới'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Tên cơ sở y tế *</label>
                                <input 
                                    type="text" 
                                    placeholder="Ví dụ: Bệnh viện Đa khoa Tâm Anh..."
                                    value={formData.name}
                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                />
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ cụ thể *</label>
                                <input 
                                    type="text" 
                                    placeholder="Số nhà, tên đường, quận/huyện..."
                                    value={formData.address}
                                    onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                                />
                            </div>

                            <div className="form-group">
                                <label>Mô tả tóm tắt</label>
                                <textarea 
                                    placeholder="Điểm mạnh hoặc dịch vụ nổi bật của cơ sở..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                />
                            </div>

                            <div className="form-group">
                                <label>Hình ảnh đại diện</label>
                                <div className="file-upload-box">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                                        {imageFile ? <strong>{imageFile.name}</strong> : 'Nhấn để chọn ảnh hoặc kéo thả vào đây'}
                                    </p>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button type="button" className="btn-card-action" style={{ flex: 1, padding: '14px' }} onClick={() => setShowModal(false)}>Hủy bỏ</button>
                                <button 
                                    type="submit" 
                                    className="add-facility-btn" 
                                    style={{ flex: 2, justifyContent: 'center', padding: '14px' }}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Đang nạp...' : (editingItem ? 'Lưu thay đổi' : 'Gia nhập mạng lưới')}
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

export default AdminFacilities
