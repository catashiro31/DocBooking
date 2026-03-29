import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { userService } from "../services/userService"

function UserProfile() {
    const navigate = useNavigate()
    const { user: contextUser, refreshUser } = useAuth()
    const [form, setForm] = useState({ fullName: "", phoneNumber: "", email: "" })
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })

    useEffect(() => {
        if (contextUser) {
            setForm({
                fullName: contextUser.fullName || "",
                phoneNumber: contextUser.phoneNumber || "",
                email: contextUser.email || ""
            })
            setPreview(contextUser.avatarUrl || null)
        }
    }, [contextUser])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFile(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: "", type: "" })
        if (!form.fullName.trim()) {
            setMessage({ text: "Họ và tên không được để trống.", type: "error" })
            setLoading(false)
            return
        }
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
        if (form.phoneNumber && !phoneRegex.test(form.phoneNumber)) {
            setMessage({ text: "Số điện thoại không hợp lệ.", type: "error" })
            setLoading(false)
            return
        }

        try {
            const formData = new FormData()
            if (form.fullName) formData.append("fullName", form.fullName)
            if (form.phoneNumber) formData.append("phoneNumber", form.phoneNumber)
            if (file) formData.append("file", file)

            await userService.updateProfile(formData)
            await refreshUser() // Update AuthContext
            setMessage({ text: "Cập nhật thông tin thành công!", type: "success" })
        } catch (err) {
            setMessage({ text: err.response?.data || "Đã xảy ra lỗi khi cập nhật", type: "error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Thông tin cá nhân</h2>
                    <div>
                        <button 
                            type="button"
                            onClick={() => navigate('/')} 
                            style={{
                                padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                background: '#f1f5f9', color: '#64748b', fontSize: '13px', fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s', marginRight: '8px'
                            }}
                        >
                            Trang chủ
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate(-1)} 
                            style={{
                                padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                background: 'white', color: '#64748b', fontSize: '13px', fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
                
                {message.text && (
                    <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', background: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? '#059669' : '#dc2626' }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Avatar Upload */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: '#e2e8f0',
                            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {preview ? (
                                <img src={preview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '32px', color: '#94a3b8' }}>{form.fullName.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        <div>
                            <label style={{
                                padding: '8px 16px', borderRadius: '8px', background: '#f1f5f9', color: '#475569',
                                fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-block', transition: 'background 0.2s'
                            }}>
                                Đổi ảnh đại diện
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#94a3b8' }}>JPG, PNG. Max 5MB.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Email (Không thể thay đổi)</label>
                            <input type="email" value={form.email} disabled style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Họ và tên</label>
                            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Số điện thoại</label>
                            <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{
                        marginTop: '32px', width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                        background: '#6366f1', color: 'white', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1, transition: 'all 0.2s', fontFamily: 'inherit'
                    }}>
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UserProfile
