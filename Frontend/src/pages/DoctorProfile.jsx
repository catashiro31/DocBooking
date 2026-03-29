import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toast } from 'react-toastify'
import api from "../services/api"

const STEPS = ["Thông tin cơ bản", "Tài liệu xác minh", "Chuyên môn & Cơ sở"]

// ===== STEP INDICATOR =====
function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: '2.5rem' }}>
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 600, transition: 'all 0.3s ease',
              border: `2px solid ${i <= current ? '#0ea47a' : '#d1d5db'}`,
              background: i <= current ? '#0ea47a' : 'transparent',
              color: i <= current ? '#fff' : '#9ca3af',
            }}>
              {i < current ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (i + 1)}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 500, color: i <= current ? '#0ea47a' : '#9ca3af', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: '80px', height: '2px', marginBottom: '20px', background: i < current ? '#0ea47a' : '#e5e7eb', transition: 'background 0.3s ease' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ===== SECTION CARD =====
function SectionCard({ icon, title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '1.5rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e8faf3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1a1a2e', letterSpacing: '-0.01em' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ===== FLOATING INPUT =====
function FloatingInput({ label, required, ...props }) {
  const isTextarea = props.type === "textarea"
  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#1a1a2e',
    background: '#fafafa', outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'inherit', boxSizing: 'border-box',
    ...(isTextarea ? { resize: 'vertical', minHeight: '100px' } : {})
  }
  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {isTextarea ? (
        <textarea {...props} type={undefined} style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#0ea47a'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
      ) : (
        <input {...props} style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#0ea47a'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
      )}
    </div>
  )
}

// ===== UPLOAD ZONE =====
function UploadZone({ label, hint, previewUrl, onUpload }) {
  const [dragging, setDragging] = useState(false)
  return (
    <div style={{ marginBottom: '1rem' }}>
      <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
      <label
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '8px', border: `2px dashed ${dragging ? '#0ea47a' : previewUrl ? '#0ea47a' : '#d1d5db'}`,
          borderRadius: '12px', padding: previewUrl ? 0 : '2rem 1rem', cursor: 'pointer',
          background: dragging ? '#f0fdf8' : previewUrl ? '#000' : '#fafafa',
          transition: 'all 0.2s ease', overflow: 'hidden', position: 'relative',
          minHeight: previewUrl ? '140px' : 'auto'
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); onUpload({ target: { files: e.dataTransfer.files } }) }}
      >
        <input type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} />
        {previewUrl ? (
          <>
            <img src={previewUrl} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} alt="preview" />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            >
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>Đổi ảnh</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e8faf3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#374151' }}>Kéo thả hoặc <span style={{ color: '#0ea47a' }}>chọn file</span></p>
            {hint && <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{hint}</p>}
          </>
        )}
      </label>
    </div>
  )
}

// ===== MAIN COMPONENT =====
function DoctorProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(user?.verificationStatus === "PENDING")
  const [approved, setApproved] = useState(user?.verificationStatus === "APPROVED")
  const [loading, setLoading] = useState(false)
  
  // Du lieu ho so (khi da duoc duyet)
  const [profileData, setProfileData] = useState(null)
  
  // Form sua gia, tieu su (Khi da duoc duyet)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ bio: "", price: "" })
  const [savingEdit, setSavingEdit] = useState(false)

  const [form, setForm] = useState({
    bio: "", degree: "", experienceYears: "", price: "",
    idCardUrl: "", certificateUrl: "", specialtyId: "", facilityId: ""
  })
  const [files, setFiles] = useState({ idCard: null, certificate: null })
  const [specialties, setSpecialties] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  useEffect(() => {
    // Kiem tra trang thai ho so hien tai
    api.get("/doctor/profile")
      .then(res => {
        const status = res.data?.verificationStatus;
        if (status === "APPROVED") {
            setApproved(true)
            setProfileData(res.data)
            setEditForm({ bio: res.data.bio || "", price: res.data.price || "" })
        }
        else if (status === "PENDING") {
            setSubmitted(true)
        }
        else if (status === "REJECTED") {
            setSubmitted(false);
            setApproved(false);
            // Pre-fill form with rejected data to help them fix it
            setForm({
                bio: res.data.bio || "",
                degree: res.data.degree || "",
                experienceYears: res.data.experienceYears || "",
                price: res.data.price || "",
                specialtyId: res.data.specialty?.id || "",
                facilityId: res.data.facility?.id || "",
                idCardUrl: res.data.idCardUrl || "",
                certificateUrl: res.data.certificateUrl || ""
            });
        }
      })
      .catch(() => {}) // 404 neu chua lap ho so

    Promise.all([api.get("/portal/specialties"), api.get("/portal/facilities")])
      .then(([specRes, facRes]) => {
        setSpecialties(specRes.data?.content || specRes.data || [])
        setFacilities(facRes.data?.content || facRes.data || [])
      })
      .catch(() => console.error("Không tải được danh sách chuyên khoa / cơ sở y tế"))
      .finally(() => setLoadingOptions(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })
  
  const handleSaveEdit = async () => {
    if (Number(editForm.price) < 0) {
        toast.error("Giá khám không được là số âm")
        return
    }
    setSavingEdit(true)
    try {
        await api.put("/doctor/profile", {
            bio: editForm.bio,
            price: Number(editForm.price)
        })
        toast.success("Cập nhật hồ sơ thành công")
        setProfileData(prev => ({ ...prev, bio: editForm.bio, price: Number(editForm.price) }))
        setEditMode(false)
    } catch (err) {
        toast.error(err.response?.data || "Đã xảy ra lỗi khi cập nhật")
    }
    setSavingEdit(false)
  }

  const handleUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.warning("File quá lớn! Tối đa 5MB."); return }
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
    if (Number(form.experienceYears) < 0 || Number(form.price) < 0) {
        toast.error("Số năm kinh nghiệm và giá khám không được âm")
        return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("bio", form.bio)
      formData.append("degree", form.degree)
      formData.append("experienceYears", form.experienceYears)
      formData.append("price", form.price)
      formData.append("specialtyId", form.specialtyId)
      formData.append("facilityId", form.facilityId)
      if (files.idCard) formData.append("idCardImage", files.idCard)
      if (files.certificate) formData.append("certificatePdf", files.certificate)

      await api.post("/doctor/profile", formData, {
        transformRequest: (data) => data,
        headers: { "Content-Type": undefined },
      })

      const userObj = JSON.parse(localStorage.getItem("user") || "{}")
      if (userObj) { 
        userObj.verificationStatus = "PENDING"
        localStorage.setItem("user", JSON.stringify(userObj))
        // Cập nhật cả AuthContext để UI reflect ngay lập tức
        if (window.dispatchEvent) {
          window.dispatchEvent(new Event('storage')) 
        }
      }
      setSubmitted(true)
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message || err?.response?.data || err?.message
      if (!status) toast.error("Không kết nối được server.")
      else if (status === 401) toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.")
      else if (status === 400) toast.error("Dữ liệu không hợp lệ: " + (typeof msg === "string" ? msg : JSON.stringify(msg)))
      else if (status === 403) toast.error("Không có quyền thực hiện. Kiểm tra role tài khoản.")
      else if (status === 404) toast.error("Endpoint /doctors/profile không tồn tại.")
      else if (status === 500) toast.error("Lỗi server (500). Báo lại team BE.")
      else toast.error(`Gửi thất bại (${status}).`)
    }
    setLoading(false)
  }

  const pageWrapStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0fdf8 0%, #f8fafc 50%, #eff6ff 100%)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: '3rem 1rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  }

  // ===== APPROVED SCREEN =====
  if (approved && profileData) {
      return (
          <div style={{...pageWrapStyle, display: 'block', padding: '40px 20px'}}>
              <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Hồ sơ chuyên môn</h2>
                      <div>
                          {!editMode ? (
                              <button onClick={() => setEditMode(true)} style={{ padding: '8px 16px', background: '#0ea47a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cập nhật hồ sơ</button>
                          ) : (
                              <>
                                  <button onClick={() => setEditMode(false)} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginRight: '8px' }}>Hủy</button>
                                  <button onClick={handleSaveEdit} disabled={savingEdit} style={{ padding: '8px 16px', background: '#0ea47a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>{savingEdit ? "Đang lưu..." : "Lưu"}</button>
                              </>
                          )}
                      </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                      <div>
                          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748b' }}>Bằng cấp</p>
                          <p style={{ margin: 0, fontWeight: 500 }}>{profileData.degree}</p>
                      </div>
                      <div>
                          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748b' }}>Kinh nghiệm</p>
                          <p style={{ margin: 0, fontWeight: 500 }}>{profileData.experienceYears} năm</p>
                      </div>
                      <div>
                          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748b' }}>Chuyên khoa</p>
                          <p style={{ margin: 0, fontWeight: 500 }}>{profileData.specialty?.specialtyName}</p>
                      </div>
                      <div>
                          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748b' }}>Cơ sở khám</p>
                          <p style={{ margin: 0, fontWeight: 500 }}>{profileData.facility?.facilityName}</p>
                      </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                      <div style={{ marginBottom: '20px' }}>
                          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>GÍA KHÁM (VNĐ)</p>
                          {editMode ? (
                              <input type="number" min="0" name="price" value={editForm.price} onChange={handleEditChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                          ) : (
                              <p style={{ margin: 0, fontWeight: 600, color: '#0ea47a', fontSize: '16px' }}>{Number(profileData.price).toLocaleString('vi-VN')} đ</p>
                          )}
                      </div>

                      <div>
                          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>TIỂU SỬ BÁC SĨ</p>
                          {editMode ? (
                              <textarea name="bio" value={editForm.bio} onChange={handleEditChange} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '120px', resize: 'vertical' }} />
                          ) : (
                              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '14px', lineHeight: 1.6, color: '#334155' }}>
                                  {profileData.bio || "Chưa có tiểu sử"}
                              </div>
                          )}
                      </div>
                  </div>

              </div>
          </div>
      )
  }

  // ===== SUCCESS SCREEN =====
  if (submitted) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          @keyframes dp-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
          .dp-btn-home:hover, .dp-btn-next:hover, .dp-btn-submit:hover, .dp-btn-back:hover { opacity: 0.9; }
        `}</style>
        <div style={pageWrapStyle}>
          <div style={{ width: '100%', maxWidth: '440px', background: '#fff', borderRadius: '24px', border: '1px solid #f0f0f0', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '3rem 2.5rem', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea47a, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(14,164,122,0.3)' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>Nộp hồ sơ thành công!</h2>
            <p style={{ margin: '0 0 2rem', fontSize: '14px', color: '#6b7280', lineHeight: 1.7 }}>
              Hồ sơ của bạn đã được gửi đến admin.<br/>
              Vui lòng chờ xét duyệt trong vòng <strong style={{ color: '#0ea47a' }}>24–48 giờ</strong>.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '30px', padding: '8px 18px', marginBottom: '2rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', animation: 'dp-pulse 1.5s infinite', flexShrink: 0, display: 'inline-block' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>Đang chờ xét duyệt</span>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
              {[["1","Admin nhận và xem xét hồ sơ"],["2","Bạn nhận thông báo kết quả qua email"],["3","Bắt đầu nhận lịch tư vấn từ bệnh nhân"]].map(([num, text]) => (
                <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e8faf3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 700, color: '#0ea47a' }}>{num}</div>
                  <span style={{ fontSize: '13px', color: '#374151' }}>{text}</span>
                </div>
              ))}
            </div>
            <button
              className="dp-btn-home"
              onClick={() => navigate("/")}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0ea47a, #059669)', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 14px rgba(14,164,122,0.35)', fontFamily: 'inherit', transition: 'opacity 0.2s' }}
            >
              Về trang chủ →
            </button>
          </div>
        </div>
      </>
    )
  }

  // ===== MAIN FORM =====
  const selectStyle = {
    width: '100%', padding: '12px 40px 12px 14px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#1a1a2e',
    background: '#fafafa', outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'inherit', boxSizing: 'border-box', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes dp-shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .dp-btn-next:hover, .dp-btn-submit:hover { opacity: 0.9 !important; }
        .dp-btn-back:hover { background: #f9fafb !important; }
        .dp-select:focus { border-color: #0ea47a !important; }
      `}</style>

      <div style={pageWrapStyle}>
        <div style={{ width: '100%', maxWidth: '560px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #0ea47a, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em' }}>Hoàn thiện hồ sơ bác sĩ</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>Điền đầy đủ thông tin để được xét duyệt và bắt đầu tư vấn</p>
          </div>

          <StepIndicator current={step} />

          {/* Step 0 */}
          {step === 0 && (
            <>
              <SectionCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} title="Giới thiệu bản thân">
                <FloatingInput label="Tiểu sử" type="textarea" name="bio" placeholder="Mô tả kinh nghiệm, chuyên môn và phong cách làm việc của bạn..." value={form.bio} onChange={handleChange} required />
                <FloatingInput label="Bằng cấp" type="text" name="degree" placeholder="VD: Tiến sĩ Y khoa, Đại học Y Hà Nội" value={form.degree} onChange={handleChange} required />
              </SectionCard>
              <SectionCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} title="Kinh nghiệm & Chi phí">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <FloatingInput label="Số năm kinh nghiệm" type="number" min="0" name="experienceYears" placeholder="VD: 10" value={form.experienceYears} onChange={handleChange} required />
                  <FloatingInput label="Giá tư vấn (VNĐ)" type="number" min="0" name="price" placeholder="VD: 200000" value={form.price} onChange={handleChange} required />
                </div>
              </SectionCard>
            </>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <SectionCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} title="Tài liệu xác minh">
              <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '10px 14px', marginBottom: '1.25rem', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ margin: 0, fontSize: '12px', color: '#92400e', lineHeight: 1.6 }}>Tài liệu sẽ được admin xét duyệt trong vòng 24–48 giờ. Hãy đảm bảo ảnh rõ nét và đầy đủ thông tin.</p>
              </div>
              <UploadZone label="Ảnh CCCD / Hộ chiếu" hint="PNG, JPG tối đa 5MB" previewUrl={form.idCardUrl} onUpload={(e) => handleUpload(e, "idCard")} />
              <UploadZone label="Chứng chỉ hành nghề" hint="PNG, JPG tối đa 5MB" previewUrl={form.certificateUrl} onUpload={(e) => handleUpload(e, "certificate")} />
            </SectionCard>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <SectionCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea47a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} title="Chuyên khoa & Cơ sở y tế">

              {/* Specialty select */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Chuyên khoa <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ content: '', position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #9ca3af', pointerEvents: 'none' }} />
                  {loadingOptions ? (
                    <div style={{ padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: '#f3f4f6', fontSize: '14px', color: '#9ca3af', animation: 'dp-shimmer 1.2s infinite' }}>Đang tải...</div>
                  ) : (
                    <select className="dp-select" name="specialtyId" value={form.specialtyId} onChange={handleChange} style={selectStyle}
                      onFocus={e => e.target.style.borderColor = '#0ea47a'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    >
                      <option value="">-- Chọn chuyên khoa --</option>
                      {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Facility select */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Cơ sở y tế <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ content: '', position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #9ca3af', pointerEvents: 'none' }} />
                  {loadingOptions ? (
                    <div style={{ padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: '#f3f4f6', fontSize: '14px', color: '#9ca3af', animation: 'dp-shimmer 1.2s infinite' }}>Đang tải...</div>
                  ) : (
                    <select className="dp-select" name="facilityId" value={form.facilityId} onChange={handleChange} style={selectStyle}
                      onFocus={e => e.target.style.borderColor = '#0ea47a'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    >
                      <option value="">-- Chọn cơ sở y tế --</option>
                      {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div style={{ marginTop: '1rem', padding: '14px', borderRadius: '12px', background: '#f0fdf8', border: '1px solid #a7f3d0' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#065f46', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tóm tắt hồ sơ</p>
                {[
                  ["Bằng cấp", form.degree || "—"],
                  ["Kinh nghiệm", form.experienceYears ? `${form.experienceYears} năm` : "—"],
                  ["Giá tư vấn", form.price ? `${Number(form.price).toLocaleString("vi-VN")}đ` : "—"],
                  ["Chuyên khoa", specialties.find(s => String(s.id) === String(form.specialtyId))?.name || "—"],
                  ["Cơ sở y tế", facilities.find(f => String(f.id) === String(form.facilityId))?.name || "—"],
                  ["CCCD", files.idCard ? "✓ Đã chọn" : "Chưa có"],
                  ["Chứng chỉ", files.certificate ? "✓ Đã chọn" : "Chưa có"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                    <span style={{ color: '#374151' }}>{k}</span>
                    <span style={{ fontWeight: 500, color: v.startsWith("✓") ? '#059669' : (v === "—" || v === "Chưa có") ? '#9ca3af' : '#1a1a2e' }}>{v}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
            {step > 0 && (
              <button
                className="dp-btn-back"
                onClick={() => setStep(s => s - 1)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', background: '#fff', fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer', transition: 'background 0.2s', fontFamily: 'inherit' }}
              >
                ← Quay lại
              </button>
            )}
            {step < 2 ? (
              <button
                className="dp-btn-next"
                onClick={() => setStep(s => s + 1)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0ea47a, #059669)', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer', transition: 'opacity 0.2s', boxShadow: '0 4px 14px rgba(14,164,122,0.35)', fontFamily: 'inherit' }}
              >
                Tiếp theo →
              </button>
            ) : (
              <button
                className="dp-btn-submit"
                onClick={handleSubmit}
                disabled={loading}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #0ea47a, #059669)', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s', boxShadow: loading ? 'none' : '0 4px 14px rgba(14,164,122,0.35)', fontFamily: 'inherit' }}
              >
                {loading ? "Đang gửi..." : "Gửi hồ sơ xét duyệt ✓"}
              </button>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '1.5rem', lineHeight: 1.6 }}>
            Thông tin của bạn được bảo mật và chỉ dùng cho mục đích xác minh
          </p>

        </div>
      </div>
    </>
  )
}

export default DoctorProfile