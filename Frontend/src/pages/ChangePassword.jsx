import { useState } from "react"
import { userService } from "../services/userService"

function ChangePassword() {
    const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.newPassword !== form.confirmPassword) {
            setMessage({ text: "Mật khẩu mới không khớp!", type: "error" })
            return
        }
        if (form.newPassword.length < 6) {
            setMessage({ text: "Mật khẩu phải có ít nhất 6 ký tự!", type: "error" })
            return
        }

        setLoading(true)
        setMessage({ text: "", type: "" })
        try {
            await userService.changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword })
            setMessage({ text: "Đổi mật khẩu thành công!", type: "success" })
            setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
        } catch (err) {
            setMessage({ text: err.response?.data || "Mật khẩu cũ không chính xác hoặc có lỗi xảy ra", type: "error" })
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s', marginTop: '6px' }
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '16px' }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: "'Inter', sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div style={{ width: '100%', maxWidth: '440px', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px', color: '#0f172a', textAlign: 'center' }}>Đổi mật khẩu</h2>
                
                {message.text && (
                    <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', background: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? '#059669' : '#dc2626' }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>
                        Mật khẩu hiện tại
                        <input type="password" name="oldPassword" value={form.oldPassword} onChange={handleChange} required style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                        Mật khẩu mới
                        <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                        Xác nhận mật khẩu mới
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required style={inputStyle} />
                    </label>

                    <button type="submit" disabled={loading} style={{
                        marginTop: '24px', width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                        background: '#6366f1', color: 'white', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1, transition: 'all 0.2s', fontFamily: 'inherit'
                    }}>
                        {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword
