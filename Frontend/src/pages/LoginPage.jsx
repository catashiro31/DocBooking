import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toast } from 'react-toastify'
import bg from "../images/bg.png"

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ============ LEFT PANEL ============ */
.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fafbfe;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: -120px;
  left: -120px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.login-left::after {
  content: '';
  position: absolute;
  bottom: -80px;
  right: -80px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.login-form-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.login-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 36px;
  transition: color 0.2s;
}
.login-back-link:hover { color: #6366f1; }

.login-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.login-brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}

.login-title {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}

.login-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 32px;
  line-height: 1.5;
}

/* ============ FORM INPUTS ============ */
.login-field {
  margin-bottom: 20px;
}

.login-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.login-input-wrap {
  position: relative;
}

.login-input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.login-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #1f2937;
  background: #fff;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  box-sizing: border-box;
}
.login-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.login-input::placeholder { color: #d1d5db; }

.login-input-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  display: flex;
  transition: color 0.2s;
}
.login-input-toggle:hover { color: #6366f1; }

/* ============ FORGOT PASSWORD ============ */
.login-forgot {
  display: flex;
  justify-content: flex-end;
  margin-top: -12px;
  margin-bottom: 24px;
}

.login-forgot a {
  font-size: 13px;
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.login-forgot a:hover { color: #4f46e5; }

/* ============ SUBMIT BUTTON ============ */
.login-submit-btn {
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(99,102,241,0.3);
}
.login-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(99,102,241,0.4); }
.login-submit-btn:active:not(:disabled) { transform: translateY(0); }
.login-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* ============ ERROR / SUCCESS ============ */

.login-register {
  margin-top: 28px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}
.login-register a { color: #6366f1; text-decoration: none; font-weight: 600; margin-left: 4px; }
.login-register a:hover { text-decoration: underline; }

/* ============ DIVIDER ============ */
.login-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
}
.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}
.login-divider span { font-size: 12px; color: #9ca3af; font-weight: 500; }

/* ============ RIGHT PANEL ============ */
.login-right {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
}

.login-right-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99,102,241,0.85), rgba(139,92,246,0.85));
  z-index: 1;
}

.login-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}

.login-right-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 60px;
  color: #fff;
  max-width: 460px;
}

.login-right-content h2 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.login-right-content p {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255,255,255,0.85);
  margin: 0;
}

.login-right-features {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.login-right-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.15);
}

.login-right-feature-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.login-right-feature span {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.95);
}

/* ============ SPINNER ============ */
.login-spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ============ RESPONSIVE ============ */
@media (max-width: 900px) {
  .login-page { flex-direction: column; }
  .login-right { display: none; }
  .login-left { padding: 32px 24px; min-height: 100vh; }
}
`

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from || "/"

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation
    if (!email.trim()) { toast.warning("Vui lòng nhập email"); return }
    if (!password.trim()) { toast.warning("Vui lòng nhập mật khẩu"); return }

    setLoading(true)
    try {
      const result = await login(email, password)
      const user = result.user

      toast.success("Đăng nhập thành công!")

      // Redirect dựa trên role
      if (user?.role === "ADMIN") {
        navigate(from === "/" ? "/admin" : from)
      } else if (user?.role === "DOCTOR") {
        if (user?.verificationStatus === "APPROVED") {
          navigate(from === "/" ? "/doctor/appointments" : from)
        } else {
          navigate("/doctor/profile")
        }
      } else {
        navigate(from)
      }
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data

      if (status === 404) {
        toast.error("Tài khoản không tồn tại. Vui lòng kiểm tra lại email.")
      } else if (status === 403) {
        toast.error(typeof msg === "string" ? msg : "Tài khoản bị hạn chế truy cập.")
      } else if (status === 401) {
        toast.error("Sai mật khẩu. Vui lòng thử lại.")
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.")
      }
    }
    setLoading(false)
  }

  return (
    <>
      <style>{css}</style>
      <div className="login-page">
        {/* ===== LEFT - FORM ===== */}
        <div className="login-left">
          <div className="login-form-container">

            <Link to="/" className="login-back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Quay lại trang chủ
            </Link>

            <div className="login-brand">
              <div className="login-brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>DocBooking</span>
            </div>

            <h1 className="login-title">Đăng nhập</h1>
            <p className="login-subtitle">Chào mừng bạn trở lại! Hãy đăng nhập để tiếp tục.</p>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="login-field">
                <label className="login-label">Email</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field">
                <label className="login-label">Mật khẩu</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="login-forgot">
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? <div className="login-spinner" /> : "Đăng nhập"}
              </button>
            </form>

            <div className="login-register">
              Chưa có tài khoản?
              <Link to="/register">Đăng ký ngay</Link>
            </div>

          </div>
        </div>

        {/* ===== RIGHT - VISUAL ===== */}
        <div className="login-right">
          <img src={bg} alt="" />
          <div className="login-right-overlay" />
          <div className="login-right-content">
            <h2>Đặt lịch khám bệnh dễ dàng & nhanh chóng</h2>
            <p>Kết nối với hàng ngàn bác sĩ chuyên khoa hàng đầu chỉ trong vài phút.</p>

            <div className="login-right-features">
              <div className="login-right-feature">
                <div className="login-right-feature-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span>Đặt lịch trực tuyến 24/7</span>
              </div>
              <div className="login-right-feature">
                <div className="login-right-feature-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                </div>
                <span>Hơn 100+ bác sĩ chuyên khoa</span>
              </div>
              <div className="login-right-feature">
                <div className="login-right-feature-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span>Bảo mật thông tin tuyệt đối</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage