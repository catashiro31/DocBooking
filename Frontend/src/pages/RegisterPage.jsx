import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register } from "../services/authService"
import bg from "../images/bg.png"

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.reg-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ============ LEFT PANEL ============ */
.reg-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fafbfe;
  position: relative;
  overflow: hidden;
}

.reg-left::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -120px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.reg-form-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 1;
}

.reg-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 28px;
  transition: color 0.2s;
}
.reg-back-link:hover { color: #6366f1; }

.reg-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.reg-brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}

.reg-title {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}

.reg-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 28px;
  line-height: 1.5;
}

/* ============ FORM INPUTS ============ */
.reg-field {
  margin-bottom: 16px;
}

.reg-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.reg-input-wrap {
  position: relative;
}

.reg-input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.reg-input {
  width: 100%;
  padding: 11px 14px 11px 42px;
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
.reg-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.reg-input::placeholder { color: #d1d5db; }
.reg-input.error { border-color: #f87171; }

.reg-input-toggle {
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
.reg-input-toggle:hover { color: #6366f1; }

.reg-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* ============ ROLE SELECTOR ============ */
.reg-role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.reg-role-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
  transition: all 0.25s ease;
  outline: none;
}
.reg-role-btn:hover { border-color: #c7d2fe; background: #f5f3ff; }
.reg-role-btn.active { border-color: #6366f1; background: #eef2ff; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

.reg-role-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.reg-role-btn:not(.active) .reg-role-icon { background: #f3f4f6; }
.reg-role-btn.active .reg-role-icon { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.reg-role-btn.active .reg-role-icon svg { stroke: white; }

.reg-role-label {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  transition: color 0.25s;
}
.reg-role-btn.active .reg-role-label { color: #4f46e5; }

.reg-role-desc {
  font-size: 11px;
  color: #9ca3af;
  margin-top: -4px;
}
.reg-role-btn.active .reg-role-desc { color: #818cf8; }

/* ============ SUBMIT BUTTON ============ */
.reg-submit-btn {
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
  margin-top: 4px;
}
.reg-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(99,102,241,0.4); }
.reg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* ============ ERROR / SUCCESS ============ */
.reg-toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  animation: fadeSlideDown 0.3s ease;
}
.reg-toast.error { background: #fef2f2; border: 1px solid #fecaca; }
.reg-toast.success { background: #f0fdf4; border: 1px solid #bbf7d0; }

.reg-toast-icon { flex-shrink: 0; margin-top: 1px; }
.reg-toast-text { font-size: 13px; line-height: 1.5; }
.reg-toast.error .reg-toast-text { color: #b91c1c; }
.reg-toast.success .reg-toast-text { color: #15803d; }

@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.reg-field-error {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ============ LOGIN LINK ============ */
.reg-login {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}
.reg-login a { color: #6366f1; text-decoration: none; font-weight: 600; margin-left: 4px; }
.reg-login a:hover { text-decoration: underline; }

/* ============ RIGHT PANEL ============ */
.reg-right {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
}

.reg-right-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99,102,241,0.85), rgba(139,92,246,0.85));
  z-index: 1;
}

.reg-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}

.reg-right-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 60px;
  color: #fff;
  max-width: 460px;
}

.reg-right-content h2 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.reg-right-content p {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255,255,255,0.85);
  margin: 0;
}

.reg-right-steps {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.reg-right-step {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.15);
}

.reg-right-step-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
}

.reg-right-step span {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.95);
}

/* ============ SPINNER ============ */
.reg-spinner {
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
  .reg-page { flex-direction: column; }
  .reg-right { display: none; }
  .reg-left { padding: 28px 20px; min-height: 100vh; }
  .reg-row { grid-template-columns: 1fr; }
}
`

function RegisterPage() {
  const [form, setForm] = useState({
    email: "", fullName: "", password: "", confirm: "", phoneNumber: "", role: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null) // { type, text }
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = "Email không được để trống"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email không đúng định dạng"

    if (!form.fullName.trim()) errs.fullName = "Họ tên không được để trống"

    if (!form.password) errs.password = "Mật khẩu không được để trống"
    else if (form.password.length < 6) errs.password = "Mật khẩu phải có ít nhất 6 ký tự"

    if (form.password !== form.confirm) errs.confirm = "Mật khẩu xác nhận không khớp"

    if (!form.phoneNumber.trim()) errs.phoneNumber = "Số điện thoại không được để trống"
    else if (!/^[0-9]{10}$/.test(form.phoneNumber)) errs.phoneNumber = "Số điện thoại phải gồm 10 chữ số"

    if (!form.role) errs.role = "Vui lòng chọn vai trò"

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setToast(null)
    if (!validate()) return

    setLoading(true)
    try {
      const message = await register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        role: form.role
      })
      setToast({
        type: "success",
        text: message || "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      })
      // Reset form
      setForm({ email: "", fullName: "", password: "", confirm: "", phoneNumber: "", role: "" })
    } catch (err) {
      const msg = err?.response?.data
      if (typeof msg === "string") {
        setToast({ type: "error", text: msg })
      } else if (msg && typeof msg === "object") {
        // Validation errors from backend
        const fieldErrors = {}
        Object.entries(msg).forEach(([key, val]) => {
          fieldErrors[key] = val
        })
        setErrors(fieldErrors)
      } else {
        setToast({ type: "error", text: "Đăng ký thất bại. Vui lòng thử lại." })
      }
    }
    setLoading(false)
  }

  return (
    <>
      <style>{css}</style>
      <div className="reg-page">
        {/* ===== LEFT - FORM ===== */}
        <div className="reg-left">
          <div className="reg-form-container">

            <Link to="/" className="reg-back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Quay lại trang chủ
            </Link>

            <div className="reg-brand">
              <div className="reg-brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>DocBooking</span>
            </div>

            <h1 className="reg-title">Tạo tài khoản</h1>
            <p className="reg-subtitle">Đăng ký để bắt đầu đặt lịch khám bệnh trực tuyến.</p>

            {/* Toast Messages */}
            {toast && (
              <div className={`reg-toast ${toast.type}`}>
                <svg className="reg-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={toast.type === "error" ? "#dc2626" : "#16a34a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {toast.type === "error" ? (
                    <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
                  ) : (
                    <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
                  )}
                </svg>
                <span className="reg-toast-text">
                  {toast.text}
                  {toast.type === "success" && (
                    <Link to="/signin" style={{ display: 'block', marginTop: '6px', color: '#059669', fontWeight: 600 }}>
                      → Đăng nhập ngay
                    </Link>
                  )}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="reg-field">
                <label className="reg-label">Email</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    className={`reg-input${errors.email ? ' error' : ''}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="reg-field-error">{errors.email}</p>}
              </div>

              {/* Full Name */}
              <div className="reg-field">
                <label className="reg-label">Họ và tên</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="reg-fullname"
                    type="text"
                    name="fullName"
                    className={`reg-input${errors.fullName ? ' error' : ''}`}
                    placeholder="Nguyễn Văn A"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>
                {errors.fullName && <p className="reg-field-error">{errors.fullName}</p>}
              </div>

              {/* Password Row */}
              <div className="reg-row">
                <div className="reg-field">
                  <label className="reg-label">Mật khẩu</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`reg-input${errors.password ? ' error' : ''}`}
                      placeholder="Ít nhất 6 ký tự"
                      value={form.password}
                      onChange={handleChange}
                    />
                    <button type="button" className="reg-input-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {showPassword ? (
                          <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></>
                        ) : (
                          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.password && <p className="reg-field-error">{errors.password}</p>}
                </div>

                <div className="reg-field">
                  <label className="reg-label">Xác nhận</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </span>
                    <input
                      id="reg-confirm"
                      type={showPassword ? "text" : "password"}
                      name="confirm"
                      className={`reg-input${errors.confirm ? ' error' : ''}`}
                      placeholder="Nhập lại mật khẩu"
                      value={form.confirm}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.confirm && <p className="reg-field-error">{errors.confirm}</p>}
                </div>
              </div>

              {/* Phone */}
              <div className="reg-field">
                <label className="reg-label">Số điện thoại</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phoneNumber"
                    className={`reg-input${errors.phoneNumber ? ' error' : ''}`}
                    placeholder="0901234567"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    maxLength={10}
                  />
                </div>
                {errors.phoneNumber && <p className="reg-field-error">{errors.phoneNumber}</p>}
              </div>

              {/* Role Selector */}
              <div className="reg-field">
                <label className="reg-label">Bạn là</label>
                <div className="reg-role-grid">
                  <button
                    type="button"
                    className={`reg-role-btn${form.role === "PATIENT" ? " active" : ""}`}
                    onClick={() => { setForm({ ...form, role: "PATIENT" }); if (errors.role) setErrors({ ...errors, role: "" }) }}
                  >
                    <div className="reg-role-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={form.role === "PATIENT" ? "white" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span className="reg-role-label">Bệnh nhân</span>
                    <span className="reg-role-desc">Đặt lịch khám</span>
                  </button>

                  <button
                    type="button"
                    className={`reg-role-btn${form.role === "DOCTOR" ? " active" : ""}`}
                    onClick={() => { setForm({ ...form, role: "DOCTOR" }); if (errors.role) setErrors({ ...errors, role: "" }) }}
                  >
                    <div className="reg-role-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={form.role === "DOCTOR" ? "white" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </div>
                    <span className="reg-role-label">Bác sĩ</span>
                    <span className="reg-role-desc">Tiếp nhận bệnh nhân</span>
                  </button>
                </div>
                {errors.role && <p className="reg-field-error">{errors.role}</p>}
              </div>

              {/* Submit */}
              <button
                id="reg-submit"
                type="submit"
                className="reg-submit-btn"
                disabled={loading}
              >
                {loading ? <div className="reg-spinner" /> : "Tạo tài khoản"}
              </button>
            </form>

            <div className="reg-login">
              Đã có tài khoản?
              <Link to="/signin">Đăng nhập</Link>
            </div>

          </div>
        </div>

        {/* ===== RIGHT - VISUAL ===== */}
        <div className="reg-right">
          <img src={bg} alt="" />
          <div className="reg-right-overlay" />
          <div className="reg-right-content">
            <h2>Bắt đầu hành trình chăm sóc sức khỏe</h2>
            <p>Tạo tài khoản chỉ trong 3 bước đơn giản</p>

            <div className="reg-right-steps">
              <div className="reg-right-step">
                <div className="reg-right-step-num">1</div>
                <span>Điền thông tin cá nhân cơ bản</span>
              </div>
              <div className="reg-right-step">
                <div className="reg-right-step-num">2</div>
                <span>Xác thực email qua link trong hộp thư</span>
              </div>
              <div className="reg-right-step">
                <div className="reg-right-step-num">3</div>
                <span>Đăng nhập & bắt đầu đặt lịch hẹn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage