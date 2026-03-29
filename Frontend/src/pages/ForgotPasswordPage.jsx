import { useState } from "react"
import { forgotPassword } from "../services/authService"
import bg from "../images/bg.png"
import { Link } from "react-router-dom"

function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!email) {
            setError("Vui lòng nhập email")
            return
        }

        setLoading(true)
        try {
            const message = await forgotPassword(email)
            setSuccess(message || "Mật khẩu mới đã được gửi đến email của bạn!")
        } catch (err) {
            const message = err.response?.data || "Có lỗi xảy ra. Vui lòng thử lại."
            setError(typeof message === 'string' ? message : "Có lỗi xảy ra")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f3f3f3' }}>

            {/* Left - Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
                <form
                    onSubmit={handleSubmit}
                    style={{ width: '100%', maxWidth: '400px', background: 'transparent', boxShadow: 'none', textAlign: 'left' }}
                >
                    {/* Nút quay lại */}
                    <Link
                        to="/signin"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#6b7280',
                            textDecoration: 'none',
                            fontSize: '14px',
                            marginBottom: '28px',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#5f6dfc'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Quay lại đăng nhập
                    </Link>

                    <h2 style={{ fontSize: '32px', marginBottom: '10px', color: '#333' }}>Quên mật khẩu</h2>
                    <p style={{ color: '#777', fontSize: '14px', marginBottom: '25px' }}>
                        Nhập email của bạn để nhận mật khẩu mới
                    </p>

                    {error && (
                        <div style={{ 
                            background: '#fee2e2', 
                            color: '#dc2626', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ 
                            background: '#dcfce7', 
                            color: '#16a34a', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            {success}
                            <div style={{ marginTop: '10px' }}>
                                <Link to="/signin" style={{ color: '#16a34a', fontWeight: 'bold' }}>
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        </div>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '10px 0', 
                            marginBottom: '20px', 
                            border: 'none', 
                            borderBottom: '1px solid #ccc', 
                            background: 'transparent', 
                            outline: 'none', 
                            boxSizing: 'border-box' 
                        }}
                        onFocus={e => e.target.style.borderBottom = '2px solid #5f6dfc'}
                        onBlur={e => e.target.style.borderBottom = '1px solid #ccc'}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ 
                            marginTop: '20px', 
                            padding: '12px 30px', 
                            borderRadius: '30px', 
                            border: 'none', 
                            background: loading ? '#ccc' : '#8ec5e8', 
                            color: 'white', 
                            cursor: loading ? 'not-allowed' : 'pointer',
                            width: '100%'
                        }}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi mật khẩu mới'}
                    </button>
                </form>
            </div>

            {/* Right - Image */}
            <div style={{ flex: 1, position: 'relative', clipPath: 'ellipse(85% 100% at 100% 50%)' }}>
                <img src={bg} alt="forgot-password" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

        </div>
    )
}

export default ForgotPasswordPage
