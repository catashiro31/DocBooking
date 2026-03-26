import { useState } from "react"
import { register, login } from "../services/authService"
import { useNavigate } from "react-router-dom"
import bg from "../images/bg.png"
import { Link } from "react-router-dom"

function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [confirm, setConfirm] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [role, setRole] = useState("")

    const navigate = useNavigate()

    const handleSubmitRegister = async (e) => {
        e.preventDefault()
        if (password !== confirm) {
            alert("Mật khẩu xác nhận không đúng")
            return
        }
        try {
            await register(email, password, fullName, confirm, phone, role)
            alert("Đăng ký thành công")

            const res = await login(email, password)
            const userRole = res.role

            if (userRole === "DOCTOR")
                navigate("/doctor-dashboard")
            else
                navigate("/booking")

        } catch (error) {
            alert(error.response.data);
        }
    }

    const inputStyle = {
        width: '100%',
        padding: '10px 0',
        marginBottom: '20px',
        border: 'none',
        borderBottom: '1px solid #ccc',
        background: 'transparent',
        outline: 'none',
        boxSizing: 'border-box'
    }

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f3f3f3' }}>

            {/* Left - Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
                <form
                    onSubmit={handleSubmitRegister}
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

                    <h2 style={{ fontSize: '32px', marginBottom: '10px', color: '#333' }}>Đăng ký tài khoản</h2>
                    <p style={{ color: '#777', fontSize: '14px', marginBottom: '25px' }}>Vui lòng đăng ký để đặt lịch hẹn</p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderBottom = '2px solid #5f6dfc'}
                        onBlur={e => e.target.style.borderBottom = '1px solid #ccc'}
                    />

                    <input
                        type="text"
                        placeholder="Họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderBottom = '2px solid #5f6dfc'}
                        onBlur={e => e.target.style.borderBottom = '1px solid #ccc'}
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderBottom = '2px solid #5f6dfc'}
                        onBlur={e => e.target.style.borderBottom = '1px solid #ccc'}
                    />

                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderBottom = '2px solid #5f6dfc'}
                        onBlur={e => e.target.style.borderBottom = '1px solid #ccc'}
                    />

                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                padding: '10px',
                                width: '40%',
                                color: role ? '#000' : '#888',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                outline: 'none'
                            }}
                        >
                            <option value="" disabled hidden>Đăng ký với</option>
                            <option value="PATIENT">Bệnh nhân</option>
                            <option value="DOCTOR">Bác sĩ</option>
                        </select>

                        <button
                            type="submit"
                            style={{ padding: '10px', background: 'linear-gradient(135deg, #5f6dfc, #a78bfa)', color: 'white', border: 'none', cursor: 'pointer', width: '40%', borderRadius: '5px', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 14px rgba(95,109,252,0.3)', transition: 'all 0.25s ease' }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 20px rgba(95,109,252,0.4)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 14px rgba(95,109,252,0.3)'; }}
                        >
                           Đăng ký
                        </button>
                    </div>

                    <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p style={{ margin: 0, color: '#777', fontSize: '14px', marginTop: '23px', fontWeight: 100 }}>
                            Bạn có tài khoản rồi?
                        </p>
                        <Link
                            to="/signin"
                            style={{ color: '#6c63ff', textDecoration: 'none', marginTop: '23px' }}
                        >
                            Đăng nhập ở đây
                        </Link>
                    </div>
                </form>
            </div>

            {/* Right - Image */}
            <div style={{ flex: 1, position: 'relative', clipPath: 'ellipse(85% 100% at 100% 50%)' }}>
                <img src={bg} alt="register" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

        </div>
    )
}

export default RegisterPage