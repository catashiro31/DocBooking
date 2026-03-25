import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "../styles/DoctorProfile.css"

const STEPS = ["Thông tin cơ bản", "Tài liệu xác minh", "Chuyên môn & Cơ sở"]

function StepIndicator({ current }) {
  return (
    <div className="dp-steps">
      {STEPS.map((label, i) => (
        <div key={i} className="dp-step-item">
          <div className="dp-step-inner">
            <div className={`dp-step-circle ${i < current ? "done" : i === current ? "active" : ""}`}>
              {i < current ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (i + 1)}
            </div>
            <span className={`dp-step-label ${i <= current ? "active" : ""}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`dp-step-line ${i < current ? "done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="dp-section-card">
      <div className="dp-section-header">
        <div className="dp-section-icon">{icon}</div>
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function FloatingInput({ label, required, ...props }) {
  return (
    <div className="dp-field">
      <label>
        {label} {required && <span className="required-star">*</span>}
      </label>
      {props.type === "textarea" ? (
        <textarea {...props} type={undefined} className="dp-textarea" />
      ) : (
        <input {...props} className="dp-input" />
      )}
    </div>
  )
}

function UploadZone({ label, hint, previewUrl, onUpload }) {
  const [dragging, setDragging] = useState(false)

  return (
    <div className="dp-upload-wrap">
      <span className="dp-upload-label-text">{label}</span>
      <label
        className={`dp-upload-zone ${dragging ? "dragging" : ""} ${previewUrl ? "has-preview" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); onUpload({ target: { files: e.dataTransfer.files } }) }}
      >
        <input type="file" accept="image/*" onChange={onUpload} />

        {previewUrl ? (
          <>
            <img src={previewUrl} className="dp-preview-img" alt="preview" />
            <div className="dp-preview-overlay">
              <span>Đổi ảnh</span>
            </div>
          </>
        ) : (
          <>
            <div className="dp-upload-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="dp-upload-text">Kéo thả hoặc <span>chọn file</span></p>
            {hint && <p className="dp-upload-hint">{hint}</p>}
          </>
        )}
      </label>
    </div>
  )
}

function DoctorProfile() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    bio: "", degree: "", experienceYears: "", price: "",
    idCardUrl: "", certificateUrl: "", specialtyId: "", facilityId: ""
  })

  const [files, setFiles] = useState({ idCard: null, certificate: null })

  const [specialties, setSpecialties] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get("/specialties"),
      api.get("/facilities"),
    ])
      .then(([specRes, facRes]) => {
        setSpecialties(specRes.data || [])
        setFacilities(facRes.data || [])
      })
      .catch(() => {
        console.error("Không tải được danh sách chuyên khoa / cơ sở y tế")
      })
      .finally(() => setLoadingOptions(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert("File quá lớn! Tối đa 5MB."); return }
    const localUrl = URL.createObjectURL(file)
    if (type === "idCard") {
      setFiles(prev => ({ ...prev, idCard: file }))
      setForm(prev => ({ ...prev, idCardUrl: localUrl }))
    } else {
      setFiles(prev => ({ ...prev, certificate: file }))
      setForm(prev => ({ ...prev, certificateUrl: localUrl }))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("bio", form.bio)
      formData.append("degree", form.degree)
      formData.append("experienceYears", form.experienceYears)
      formData.append("price", form.price)
      formData.append("specialtyId", form.specialtyId)
      formData.append("facilityId", form.facilityId)
      if (files.idCard) formData.append("idCard", files.idCard)
      if (files.certificate) formData.append("certificate", files.certificate)

      await api.post("/doctors/profile", formData, {
        transformRequest: (data) => data,
        headers: { "Content-Type": undefined },
      })

      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user) { user.verificationStatus = "PENDING"; localStorage.setItem("user", JSON.stringify(user)) }
      setSubmitted(true)
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message || err?.response?.data || err?.message
      console.error("Submit error:", status, msg)
      if (!status) alert("Không kết nối được server.")
      else if (status === 401) alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.")
      else if (status === 400) alert("Dữ liệu không hợp lệ: " + (typeof msg === "string" ? msg : JSON.stringify(msg)))
      else if (status === 403) alert("Không có quyền thực hiện. Kiểm tra role tài khoản.")
      else if (status === 404) alert("Endpoint /doctors/profile không tồn tại.")
      else if (status === 500) alert("Lỗi server (500). Báo lại team BE.")
      else alert(`Gửi thất bại (${status}).`)
    }
    setLoading(false)
  }

  // ===== SUCCESS SCREEN =====
  if (submitted) {
    return (
      <div className="dp-success-page">
        <div className="dp-success-card">
          <div className="dp-success-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h2>Nộp hồ sơ thành công!</h2>
          <p>
            Hồ sơ của bạn đã được gửi đến admin.<br/>
            Vui lòng chờ xét duyệt trong vòng <strong>24–48 giờ</strong>.
          </p>
          <div className="dp-status-badge">
            <span className="dp-status-dot" />
            <span>Đang chờ xét duyệt</span>
          </div>
          <div className="dp-success-steps">
            {[
              ["1", "Admin nhận và xem xét hồ sơ"],
              ["2", "Bạn nhận thông báo kết quả qua email"],
              ["3", "Bắt đầu nhận lịch tư vấn từ bệnh nhân"],
            ].map(([num, text]) => (
              <div key={num} className="dp-success-step-row">
                <div className="dp-success-step-num">{num}</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <button className="dp-btn-home" onClick={() => navigate("/")}>
            Về trang chủ →
          </button>
        </div>
      </div>
    )
  }

  // ===== MAIN FORM =====
  return (
    <div className="dp-page">
      <div className="dp-container">

        <div className="dp-header">
          <div className="dp-header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h1>Hoàn thiện hồ sơ bác sĩ</h1>
          <p>Điền đầy đủ thông tin để được xét duyệt và bắt đầu tư vấn</p>
        </div>

        <StepIndicator current={step} />

        {/* Step 0 */}
        {step === 0 && (
          <>
            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
              title="Giới thiệu bản thân"
            >
              <FloatingInput label="Tiểu sử" type="textarea" name="bio"
                placeholder="Mô tả kinh nghiệm, chuyên môn và phong cách làm việc của bạn..."
                value={form.bio} onChange={handleChange} required />
              <FloatingInput label="Bằng cấp" type="text" name="degree"
                placeholder="VD: Tiến sĩ Y khoa, Đại học Y Hà Nội"
                value={form.degree} onChange={handleChange} required />
            </SectionCard>

            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
              title="Kinh nghiệm & Chi phí"
            >
              <div className="dp-grid-2">
                <FloatingInput label="Số năm kinh nghiệm" type="number" name="experienceYears"
                  placeholder="VD: 10" value={form.experienceYears} onChange={handleChange} required />
                <FloatingInput label="Giá tư vấn (VNĐ)" type="number" name="price"
                  placeholder="VD: 200000" value={form.price} onChange={handleChange} required />
              </div>
            </SectionCard>
          </>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <SectionCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
            title="Tài liệu xác minh"
          >
            <div className="dp-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>Tài liệu sẽ được admin xét duyệt trong vòng 24–48 giờ. Hãy đảm bảo ảnh rõ nét và đầy đủ thông tin.</p>
            </div>
            <UploadZone label="Ảnh CCCD / Hộ chiếu" hint="PNG, JPG tối đa 5MB"
              previewUrl={form.idCardUrl} onUpload={(e) => handleUpload(e, "idCard")} />
            <UploadZone label="Chứng chỉ hành nghề" hint="PNG, JPG tối đa 5MB"
              previewUrl={form.certificateUrl} onUpload={(e) => handleUpload(e, "certificate")} />
          </SectionCard>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <SectionCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
            title="Chuyên khoa & Cơ sở y tế"
          >
            <div className="dp-field">
              <label>Chuyên khoa <span className="required-star">*</span></label>
              <div className="dp-select-wrap">
                {loadingOptions ? (
                  <div className="dp-select-loading">Đang tải...</div>
                ) : (
                  <select
                    className="dp-select"
                    name="specialtyId"
                    value={form.specialtyId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn chuyên khoa --</option>
                    {specialties.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="dp-field">
              <label>Cơ sở y tế <span className="required-star">*</span></label>
              <div className="dp-select-wrap">
                {loadingOptions ? (
                  <div className="dp-select-loading">Đang tải...</div>
                ) : (
                  <select
                    className="dp-select"
                    name="facilityId"
                    value={form.facilityId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn cơ sở y tế --</option>
                    {facilities.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="dp-summary">
              <p className="dp-summary-title">Tóm tắt hồ sơ</p>
              {[
                ["Bằng cấp", form.degree || "—"],
                ["Kinh nghiệm", form.experienceYears ? `${form.experienceYears} năm` : "—"],
                ["Giá tư vấn", form.price ? `${Number(form.price).toLocaleString("vi-VN")}đ` : "—"],
                ["Chuyên khoa", specialties.find(s => String(s.id) === String(form.specialtyId))?.name || "—"],
                ["Cơ sở y tế", facilities.find(f => String(f.id) === String(form.facilityId))?.name || "—"],
                ["CCCD", files.idCard ? "✓ Đã chọn" : "Chưa có"],
                ["Chứng chỉ", files.certificate ? "✓ Đã chọn" : "Chưa có"],
              ].map(([k, v]) => (
                <div key={k} className="dp-summary-row">
                  <span>{k}</span>
                  <span className={`dp-summary-val ${v.startsWith("✓") ? "success" : v === "—" || v === "Chưa có" ? "muted" : ""}`}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Navigation */}
        <div className="dp-nav">
          {step > 0 && (
            <button className="dp-btn-back" onClick={() => setStep(s => s - 1)}>
              ← Quay lại
            </button>
          )}
          {step < 2 ? (
            <button className="dp-btn-next" onClick={() => setStep(s => s + 1)}>
              Tiếp theo →
            </button>
          ) : (
            <button className="dp-btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi hồ sơ xét duyệt ✓"}
            </button>
          )}
        </div>

        <p className="dp-footer-note">
          Thông tin của bạn được bảo mật và chỉ dùng cho mục đích xác minh
        </p>
      </div>
    </div>
  )
}

export default DoctorProfile