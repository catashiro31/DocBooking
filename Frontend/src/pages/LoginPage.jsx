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
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: -120px;
  left: -120px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.login-form-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  background: #fff;
  padding: 48px;
  border-radius: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.05);
}

.login-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 40px;
  transition: all 0.2s;
}
.login-back-link:hover { color: #6366f1; transform: translateX(-4px); }

.login-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.login-brand-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(99,102,241,0.3);
}

.login-title {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px;
  letter-spacing: -0.04em;
}

.login-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0 0 40px;
  line-height: 1.6;
}

/* ============ FORM INPUTS ============ */
.login-field { margin-bottom: 24px; }
.login-label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 8px;
}

.login-input-wrap { position: relative; }
.login-input-icon {
  position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
  color: #94a3b8; display: flex; align-items: center; pointer-events: none;
  transition: color 0.3s;
}

.login-input {
  width: 100%; padding: 14px 16px 14px 48px;
  border: 1.5px solid #e2e8f0; border-radius: 14px;
  font-size: 15px; color: #1e293b; background: #f8fafc;
  outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit; box-sizing: border-box;
}
.login-input:focus { 
  border-color: #6366f1; background: #fff;
  box-shadow: 0 10px 15px -3px rgba(99,102,241,0.1); 
}
.login-input:focus + .login-input-icon { color: #6366f1; }
.login-input::placeholder { color: #94a3b8; opacity: 0.6; }

.login-input-toggle {
  position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #94a3b8;
  padding: 0; display: flex; transition: color 0.2s;
}
.login-input-toggle:hover { color: #6366f1; }

/* ============ FORGOT PASSWORD ============ */
.login-forgot {
  display: flex; justify-content: flex-end; margin-top: -16px; margin-bottom: 32px;
}
.login-forgot a {
  font-size: 14px; color: #6366f1; text-decoration: none; font-weight: 600;
  transition: all 0.2s;
}
.login-forgot a:hover { color: #4f46e5; text-decoration: underline; }

/* ============ SUBMIT BUTTON ============ */
.login-submit-btn {
  width: 100%; padding: 15px; border: none; border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit; box-shadow: 0 10px 25px rgba(99,102,241,0.3);
}
.login-submit-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(99,102,241,0.4); }
.login-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.login-register {
  margin-top: 32px; text-align: center; font-size: 15px; color: #64748b;
}
.login-register a { color: #6366f1; text-decoration: none; font-weight: 700; margin-left: 6px; }
.login-register a:hover { text-decoration: underline; }

/* ============ RIGHT PANEL ============ */
.login-right {
  flex: 1.2; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: #0f172a;
}
.login-right-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(99,102,241,0.7));
  z-index: 1;
}
.login-right img {
  width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; opacity: 0.6;
}

.login-right-content {
  position: relative; z-index: 2; text-align: left; padding: 80px; color: #fff; max-width: 520px;
}
.login-right-content h2 {
  font-size: 42px; font-weight: 800; margin: 0 0 20px; letter-spacing: -0.04em; line-height: 1.1;
}
.login-right-content p {
  font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.8); margin: 0;
}

.login-right-features { margin-top: 48px; display: flex; flex-direction: column; gap: 20px; }
.login-right-feature {
  display: flex; align-items: center; gap: 16px;
  background: rgba(255,255,255,0.1); backdrop-filter: blur(12px);
  padding: 18px 24px; border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.15);
  transition: all 0.3s;
}
.login-right-feature:hover { background: rgba(255,255,255,0.15); transform: translateX(10px); }

.login-right-feature-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
.login-right-feature span { font-size: 16px; font-weight: 600; color: #fff; }

.login-spinner {
  width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .login-right-content { padding: 40px; }
  .login-right-content h2 { font-size: 32px; }
}

@media (max-width: 900px) {
  .login-right { display: none; }
  .login-left { padding: 24px; }
  .login-form-container { padding: 32px; border: none; box-shadow: none; background: transparent; }
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
          <div className="login-form-container reveal">

            <Link to="/" className="login-back-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Quay lại trang chủ
            </Link>

            <div className="login-brand reveal-delayed">
              <div className="login-brand-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>DocBooking</span>
            </div>

            <h1 className="login-title reveal-delayed" style={{ animationDelay: '0.3s' }}>Đăng nhập</h1>
            <p className="login-subtitle reveal-delayed" style={{ animationDelay: '0.35s' }}>Hãy đăng nhập để tiếp tục đặt lịch hẹn với bác sĩ của bạn.</p>

            <form onSubmit={handleSubmit} className="reveal-delayed" style={{ animationDelay: '0.4s' }}>
              {/* Email */}
              <div className="login-field">
                <label className="login-label">Email công việc</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="name@example.com"
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="••••••••"
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
                {loading ? <div className="login-spinner" /> : (
                  <>
                    Tiếp tục
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="login-register reveal-delayed" style={{ animationDelay: '0.5s' }}>
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
            <h2 className="reveal">
              Giải pháp chăm sóc sức khỏe thông minh
            </h2>
            <p className="reveal-delayed" style={{ animationDelay: '0.2s' }}>
              Mang y tế đến tận tay bạn với mạng lưới bác sĩ chuyên khoa rộng khắp và hệ thống đặt lịch tiện lợi.
            </p>

            <div className="login-right-features">
              {[
                { icon: '📅', text: 'Đặt lịch trực tuyến 24/7' },
                { icon: '👨‍⚕️', text: 'Đội ngũ bác sĩ hàng đầu' },
                { icon: '🔒', text: 'Bảo mật dữ liệu tuyệt đối' }
              ].map((f, i) => (
                <div 
                  key={i} 
                  className="login-right-feature reveal-delayed" 
                  style={{ animationDelay: `${0.3 + (i * 0.1)}s` }}
                >
                  <div className="login-right-feature-icon">
                    <span style={{ fontSize: '20px' }}>{f.icon}</span>
                  </div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default LoginPage