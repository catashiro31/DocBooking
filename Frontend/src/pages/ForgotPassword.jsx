import { useState } from "react"
import { Link } from "react-router-dom"
import { forgotPassword } from "../services/authService"
import bg from "../images/bg.png"

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.fp-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.fp-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fafbfe;
  position: relative;
}

.fp-left::before {
  content: '';
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.fp-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.fp-back-link {
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
.fp-back-link:hover { color: #6366f1; }

.fp-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(245,158,11,0.25);
}

.fp-title {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.fp-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 28px;
  line-height: 1.6;
}

.fp-field { margin-bottom: 20px; }

.fp-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.fp-input-wrap { position: relative; }

.fp-input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  pointer-events: none;
}

.fp-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #1f2937;
  background: #fff;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}
.fp-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.fp-input::placeholder { color: #d1d5db; }

.fp-submit {
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(245,158,11,0.3);
}
.fp-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(245,158,11,0.4); }
.fp-submit:disabled { opacity: 0.7; cursor: not-allowed; }

.fp-toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  animation: fpFadeIn 0.3s ease;
}
.fp-toast.error { background: #fef2f2; border: 1px solid #fecaca; }
.fp-toast.success { background: #f0fdf4; border: 1px solid #bbf7d0; }
.fp-toast-text { font-size: 13px; line-height: 1.5; }
.fp-toast.error .fp-toast-text { color: #b91c1c; }
.fp-toast.success .fp-toast-text { color: #15803d; }

@keyframes fpFadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fp-login {
  margin-top: 28px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}
.fp-login a { color: #6366f1; text-decoration: none; font-weight: 600; margin-left: 4px; }
.fp-login a:hover { text-decoration: underline; }

.fp-spinner {
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Right panel */
.fp-right {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
}
.fp-right-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(245,158,11,0.85), rgba(180,83,9,0.85));
  z-index: 1;
}
.fp-right img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
.fp-right-content {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; padding: 60px; color: #fff; text-align: center; max-width: 420px; margin: 0 auto;
}
.fp-right-content h2 { font-size: 28px; font-weight: 800; margin: 0 0 12px; line-height: 1.2; }
.fp-right-content p { font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.85); margin: 0; }

.fp-right-info {
  margin-top: 32px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.15);
  padding: 20px;
  text-align: left;
  width: 100%;
}
.fp-right-info-title { font-size: 14px; font-weight: 700; margin: 0 0 12px; }
.fp-right-info-item { display: flex; gap: 10px; font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 10px; line-height: 1.5; }
.fp-right-info-item:last-child { margin-bottom: 0; }
.fp-right-info-num {
  width: 22px; height: 22px; flex-shrink: 0;
  border-radius: 50%; background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; margin-top: 1px;
}

@media (max-width: 900px) {
  .fp-page { flex-direction: column; }
  .fp-right { display: none; }
  .fp-left { padding: 32px 24px; min-height: 100vh; }
}
`

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setToast(null)

    if (!email.trim()) {
      setToast({ type: "error", text: "Vui lòng nhập email." })
      return
    }

    setLoading(true)
    try {
      const message = await forgotPassword(email)
      setToast({ type: "success", text: message || "Mật khẩu mới đã được gửi đến email của bạn!" })
      setEmail("")
    } catch (err) {
      const msg = err?.response?.data
      setToast({ type: "error", text: typeof msg === "string" ? msg : "Đã có lỗi xảy ra. Vui lòng thử lại." })
    }
    setLoading(false)
  }

  return (
    <>
      <style>{css}</style>
      <div className="fp-page">
        <div className="fp-left">
          <div className="fp-container">

            <Link to="/signin" className="fp-back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Quay lại đăng nhập
            </Link>

            <div className="fp-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            </div>

            <h1 className="fp-title">Quên mật khẩu?</h1>
            <p className="fp-subtitle">
              Nhập email đã đăng ký, hệ thống sẽ gửi mật khẩu mới đến hộp thư của bạn.
            </p>

            {toast && (
              <div className={`fp-toast ${toast.type}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={toast.type === "error" ? "#dc2626" : "#16a34a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  {toast.type === "error" ? (
                    <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
                  ) : (
                    <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
                  )}
                </svg>
                <span className="fp-toast-text">{toast.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="fp-field">
                <label className="fp-label">Địa chỉ email</label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="fp-email"
                    type="email"
                    className="fp-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button id="fp-submit" type="submit" className="fp-submit" disabled={loading}>
                {loading ? <div className="fp-spinner" /> : "Gửi mật khẩu mới"}
              </button>
            </form>

            <div className="fp-login">
              Nhớ mật khẩu rồi?
              <Link to="/signin">Đăng nhập</Link>
            </div>

          </div>
        </div>

        <div className="fp-right">
          <img src={bg} alt="" />
          <div className="fp-right-overlay" />
          <div className="fp-right-content">
            <h2>Đừng lo, chúng tôi sẽ giúp bạn!</h2>
            <p>Quy trình khôi phục mật khẩu rất đơn giản và an toàn.</p>

            <div className="fp-right-info">
              <p className="fp-right-info-title">Quy trình khôi phục:</p>
              <div className="fp-right-info-item">
                <div className="fp-right-info-num">1</div>
                <span>Nhập email đã đăng ký tài khoản</span>
              </div>
              <div className="fp-right-info-item">
                <div className="fp-right-info-num">2</div>
                <span>Hệ thống tạo mật khẩu mới và gửi qua email</span>
              </div>
              <div className="fp-right-info-item">
                <div className="fp-right-info-num">3</div>
                <span>Đăng nhập bằng mật khẩu mới và đổi lại mật khẩu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
