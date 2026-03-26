import { useState } from "react"
import { login } from "../services/authService"
import bg from "../images/bg.png"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await login(email, password)
            const user = res.data
            localStorage.setItem("user", JSON.stringify(user))
            if (user.role === "admin") {
                navigate("/admin")
            } else if (user.role === "DOCTOR") {
                if (user.verificationStatus === "PENDING") {
                    navigate("/doctor/profile")
                } else {
                    navigate("/")
                }
            } else {
                navigate("/")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f3f3f3' }}>

            {/* Left - Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
                <form
                    onSubmit={handleSubmitLogin}
                    style={{ width: '100%', maxWidth: '400px', background: 'transparent', boxShadow: 'none', textAlign: 'left' }}
                >
                    {/* Nút quay lại trang chủ */}
                    <Link
                        to="/"
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
                        Quay lại trang chủ
                    </Link>

                    <h2 style={{ fontSize: '32px', marginBottom: '10px', color: '#333' }}>Đăng nhập tài khoản</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px 0', marginBottom: '20px', border: 'none', borderBottom: '1px solid #ccc', background: 'transparent', outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderBottom = '2px solid #5f6dfc'}
                        onBlur={e => e.target.style.borderBottom = '1px solid #ccc'}
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px 0', marginBottom: '20px', border: 'none', borderBottom: '1px solid #ccc', background: 'transparent', outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderBottom = '2px solid #5f6dfc'}
                        onBlur={e => e.target.style.borderBottom = '1px solid #ccc'}
                    />

                    <button
                        type="submit"
                        style={{ marginTop: '20px', padding: '12px 30px', borderRadius: '30px', border: 'none', background: '#8ec5e8', color: 'white', cursor: 'pointer' }}
                    >
                        Đăng nhập
                    </button>

                    <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p style={{ margin: '0', color: '#777', fontSize: '14px', marginTop: '23px', fontWeight: 100 }}>
                            Bạn đã có tài khoản chưa?
                        </p>
                        <Link
                            to="/signout"
                            style={{ color: '#6c63ff', textDecoration: 'none', marginTop: '23px' }}
                        >
                            Đăng ký ở đây
                        </Link>
                    </div>
                </form>
            </div>

            {/* Right - Image */}
            <div style={{ flex: 1, position: 'relative', clipPath: 'ellipse(85% 100% at 100% 50%)' }}>
                <img src={bg} alt="login" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

        </div>
    )
}

export default LoginPage