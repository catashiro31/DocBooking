import React, { useEffect, useState } from "react"
import { doctorService } from "../services/doctorService"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import doctorImg from "../images/home_booking-removebg-preview.png"
import img1 from "../images/img1.png"
import img2 from "../images/img2.png"
import img3 from "../images/img3.png"
import img4 from "../images/img4.png"
import img5 from "../images/img5.png"
import img6 from "../images/img6.png"
import icon from "../images/iconHome.png"
import bannerImg from "../images/banner-removebg-preview.png"
import Footer from "../components/Footer"
import Header from "../components/Header"

const defaultImages = [img1, img2, img3, img4, img5, img6]

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.hp { font-family: 'Inter', -apple-system, sans-serif; background: #f8fafc; }

/* ===== HERO ===== */
.hp-hero {
  display: flex;
  align-items: center;
  gap: 60px;
  padding: 60px 80px;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #8b5cf6 100%);
  border-radius: 28px;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(99,102,241,0.3);
}
.hp-hero::before {
  content: '';
  position: absolute;
  width: 500px; height: 500px;
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
  top: -160px; right: -100px;
  pointer-events: none;
}
.hp-hero::after {
  content: '';
  position: absolute;
  width: 280px; height: 280px;
  background: rgba(255,255,255,0.04);
  border-radius: 50%;
  bottom: -80px; left: 40px;
  pointer-events: none;
}
.hp-hero-left { flex: 1.3; position: relative; z-index: 1; }
.hp-hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 16px;
  letter-spacing: -0.03em;
}
.hp-hero-title span { color: #c4b5fd; }
.hp-hero-desc { font-size: 16px; color: rgba(255,255,255,0.85); line-height: 1.7; max-width: 420px; margin: 0 0 28px; }
.hp-hero-cta-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.hp-hero-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 14px; border: none;
  background: #fff; color: #6366f1;
  font-size: 15px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transition: all 0.25s; font-family: inherit;
}
.hp-hero-cta:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.18); }
.hp-hero-cta-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 15px; font-weight: 600; cursor: pointer;
  transition: all 0.25s; font-family: inherit;
  backdrop-filter: blur(4px);
}
.hp-hero-cta-ghost:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.5); }
.hp-hero-stats {
  display: flex; gap: 24px; margin-top: 36px; flex-wrap: wrap;
}
.hp-stat-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(10px);
}
.hp-stat-icon {
  width: 44px; height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.hp-stat-info { display: flex; flex-direction: column; }
.hp-hero-stat-num { font-size: 24px; font-weight: 800; margin: 0; line-height: 1; }
.hp-hero-stat-label { font-size: 13px; color: rgba(255,255,255,0.8); margin: 4px 0 0; font-weight: 500; }
.hp-hero-right { flex: 1; display: flex; justify-content: flex-end; position: relative; z-index: 1; }
.hp-hero-right img { width: 420px; max-width: 100%; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15)); }

/* ===== SECTION TITLES ===== */
.hp-section { text-align: center; margin-top: 80px; }
.hp-section-title {
  font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.02em;
}
.hp-section-sub {
  font-size: 15px; color: #94a3b8; max-width: 500px; margin: 0 auto 40px; line-height: 1.6;
}

/* ===== SPECIALTIES ===== */
.hp-specs {
  display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;
}
.hp-spec-card {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 20px 24px; min-width: 120px;
  background: #fff; border: 1.5px solid #f0f0f5; border-radius: 18px;
  cursor: pointer; transition: all 0.25s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.hp-spec-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(99,102,241,0.12); border-color: #c7d2fe; }
.hp-spec-img {
  width: 64px; height: 64px; border-radius: 16px; object-fit: contain; padding: 10px;
  background: #eef2ff;
}
.hp-spec-name { font-size: 13px; font-weight: 600; color: #374151; margin: 0; text-align: center; }

/* ===== DOCTORS GRID ===== */
.hp-docs-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
}
.hp-doc-card {
  background: #fff; border-radius: 20px; overflow: hidden;
  border: 1px solid #e2e8f0; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex; flex-direction: column;
}
.hp-doc-card:hover { 
  transform: translateY(-8px); 
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); 
  border-color: #8b5cf6; 
}
.hp-doc-img-wrap {
  width: 100%; height: 220px;
  background: linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%);
  display: flex; align-items: flex-end; justify-content: center;
  overflow: hidden;
}
.hp-doc-img { 
  width: 90%; height: 90%; 
  object-fit: cover; object-position: top;
  transition: transform 0.3s ease;
}
.hp-doc-card:hover .hp-doc-img { transform: scale(1.05); }

.hp-doc-body { padding: 20px; border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.hp-doc-badges { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.hp-doc-avail {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; padding: 4px 10px;
  border-radius: 20px;
}
.hp-doc-avail.active { color: #059669; background: #d1fae5; }
.hp-doc-rating { font-size: 13px; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 4px; }

.hp-doc-name { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.3; }
.hp-doc-spec { font-size: 14px; color: #64748b; margin: 0; display: flex; align-items: center; gap: 6px; }

.hp-doc-btn {
  margin-top: auto; padding: 10px 0; width: 100%;
  border-radius: 12px; border: none;
  background: #f1f5f9; color: #475569;
  font-size: 14px; font-weight: 600;
  transition: all 0.2s; cursor: pointer; font-family: inherit;
}
.hp-doc-card:hover .hp-doc-btn {
  background: #6366f1; color: #fff;
}

.hp-more-btn {
  margin-top: 36px; padding: 12px 32px;
  border-radius: 12px; border: 1.5px solid #e2e8f0;
  background: #fff; color: #6366f1;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.25s; font-family: inherit;
}
.hp-more-btn:hover { background: #6366f1; color: #fff; border-color: #6366f1; box-shadow: 0 4px 16px rgba(99,102,241,0.3); }

/* ===== SERVICES ===== */
.hp-services-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
  max-width: 980px; margin: 0 auto;
}
.hp-service-card {
  background: #fff; border-radius: 18px; padding: 28px 24px;
  border: 1.5px solid #f0f0f5; transition: all 0.25s;
  cursor: pointer; position: relative; overflow: hidden;
}
.hp-service-card::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 4px; height: 100%;
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  border-radius: 4px 0 0 4px;
  transition: width 0.3s;
}
.hp-service-card:hover::before { width: 100%; border-radius: 18px; }
.hp-service-card:hover { border-color: transparent; }
.hp-service-card:hover .hp-service-icon,
.hp-service-card:hover .hp-service-title,
.hp-service-card:hover .hp-service-desc { color: #fff !important; position: relative; z-index: 1; }

.hp-service-icon { font-size: 28px; margin-bottom: 14px; position: relative; z-index: 1; }
.hp-service-title { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 6px; position: relative; z-index: 1; }
.hp-service-desc { font-size: 13px; color: #94a3b8; line-height: 1.6; margin: 0; position: relative; z-index: 1; }

/* ===== CTA BANNER ===== */
.hp-cta {
  display: flex; align-items: center;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #8b5cf6 100%);
  border-radius: 28px; color: #fff; overflow: hidden;
  margin-top: 80px; position: relative;
  box-shadow: 0 20px 60px rgba(99,102,241,0.25);
}
.hp-cta::before {
  content: ''; position: absolute;
  width: 340px; height: 340px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
  top: -100px; left: -60px;
  pointer-events: none;
}
.hp-cta-left { flex: 1; padding: 60px 0 60px 60px; position: relative; z-index: 1; }
.hp-cta-tag { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.7); margin: 0 0 8px; }
.hp-cta-title { font-size: 36px; font-weight: 800; margin: 0 0 24px; line-height: 1.2; letter-spacing: -0.02em; }
.hp-cta-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 14px; border: none;
  background: #fff; color: #6366f1;
  font-size: 15px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transition: all 0.25s; font-family: inherit;
}
.hp-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.18); }
.hp-cta-right { flex: 1; display: flex; justify-content: flex-end; align-items: flex-end; position: relative; z-index: 1; }
.hp-cta-right img { width: 380px; transform: translateY(4px); }

/* ===== LOADING ===== */
.hp-loading { display: flex; justify-content: center; padding: 40px; }
.hp-loading-dot { width: 8px; height: 8px; border-radius: 50%; background: #c7d2fe; margin: 0 4px; animation: hpBounce 0.6s alternate infinite; }
.hp-loading-dot:nth-child(2) { animation-delay: 0.2s; }
.hp-loading-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes hpBounce { to { transform: translateY(-12px); background: #6366f1; } }

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .hp-wrapper { padding: 24px 28px !important; }
  .hp-docs-grid { grid-template-columns: repeat(3, 1fr) !important; }
  .hp-services-grid { grid-template-columns: repeat(2, 1fr) !important; }
}

@media (max-width: 768px) {
  .hp-wrapper { padding: 16px !important; }
  .hp-hero {
    flex-direction: column !important; padding: 36px 24px !important;
    gap: 24px !important; text-align: center;
  }
  .hp-hero-title { font-size: 28px !important; }
  .hp-hero-desc { font-size: 14px !important; margin: 0 auto 20px !important; }
  .hp-hero-cta-row { justify-content: center; }
  .hp-hero-stats { justify-content: center; gap: 24px; }
  .hp-hero-right img { width: 260px !important; }
  .hp-docs-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
  .hp-doc-img { height: 140px !important; }
  .hp-services-grid { grid-template-columns: 1fr !important; }
  .hp-cta { flex-direction: column !important; }
  .hp-cta-left { padding: 36px 24px !important; text-align: center; }
  .hp-cta-title { font-size: 24px !important; }
  .hp-cta-right img { width: 260px !important; }
  .hp-spec-card { min-width: 100px !important; padding: 14px 16px !important; }
  .hp-spec-img { width: 48px !important; height: 48px !important; }
}
`

function HomePage() {
  const [topDoctors, setTopDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    Promise.all([
      doctorService.getDoctors({ size: 8, sortBy: 'rating' }),
      doctorService.getSpecialties()
    ])
      .then(([doctorsData, specialtiesData]) => {
        const doctors = doctorsData?.content || doctorsData || []
        setTopDoctors(Array.isArray(doctors) ? doctors.slice(0, 8) : [])

        const specs = Array.isArray(specialtiesData) ? specialtiesData : []
        setSpecialties(specs.slice(0, 6).map((s, i) => ({
          ...s,
          image: s.imageUrl || defaultImages[i % defaultImages.length]
        })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const isLoggedIn = isAuthenticated()
  const heroCtaText = isLoggedIn ? "Đặt lịch hẹn" : "Bắt đầu ngay"
  const heroCtaPath = isLoggedIn ? "/doctors" : "/register"

  return (
    <>
      <style>{css}</style>
      <div className="hp">
        <Header />

        <div className="hp-wrapper" style={{ padding: '32px 80px', maxWidth: '1280px', margin: '0 auto' }}>

          {/* ===== HERO ===== */}
          <div className="hp-hero">
            <div className="hp-hero-left">
              <h1 className="hp-hero-title">
                Đặt lịch khám bệnh
                <br />
                <span>dễ dàng</span> & nhanh chóng
              </h1>
              <p className="hp-hero-desc">
                Kết nối với hàng trăm bác sĩ chuyên khoa hàng đầu. Đặt lịch trực tuyến 24/7,
                tiết kiệm thời gian chờ đợi.
              </p>
              <div className="hp-hero-cta-row">
                <button className="hp-hero-cta" onClick={() => navigate(heroCtaPath)}>
                  {heroCtaText}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="hp-hero-cta-ghost" onClick={() => navigate("/about")}>
                  Tìm hiểu thêm
                </button>
              </div>
              <div className="hp-hero-stats">
                <div className="hp-stat-card">
                  <div className="hp-stat-icon">👨‍⚕️</div>
                  <div className="hp-stat-info">
                    <p className="hp-hero-stat-num">100+</p>
                    <p className="hp-hero-stat-label">Bác sĩ chuyên khoa</p>
                  </div>
                </div>
                <div className="hp-stat-card">
                  <div className="hp-stat-icon">📅</div>
                  <div className="hp-stat-info">
                    <p className="hp-hero-stat-num">50k+</p>
                    <p className="hp-hero-stat-label">Lượt đặt lịch</p>
                  </div>
                </div>
                <div className="hp-stat-card">
                  <div className="hp-stat-icon">⭐</div>
                  <div className="hp-stat-info">
                    <p className="hp-hero-stat-num">4.9/5</p>
                    <p className="hp-hero-stat-label">Đánh giá trung bình</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hp-hero-right">
              <img src={doctorImg} alt="doctor" />
            </div>
          </div>

          {/* ===== SPECIALTIES ===== */}
          <div className="hp-section">
            <h2 className="hp-section-title">Tìm theo chuyên khoa</h2>
            <p className="hp-section-sub">
              Duyệt qua các chuyên khoa y tế và tìm bác sĩ phù hợp với nhu cầu của bạn.
            </p>
            <div className="hp-specs">
              {specialties.map((item, i) => (
                <div
                  key={item.id || i}
                  className="hp-spec-card"
                  onClick={() => navigate(`/doctors?specId=${item.id}`)}
                >
                  <img src={item.image} alt={item.name} className="hp-spec-img" />
                  <p className="hp-spec-name">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== TOP DOCTORS ===== */}
          <div className="hp-section">
            <h2 className="hp-section-title">Bác sĩ được tin cậy</h2>
            <p className="hp-section-sub">
              Những bác sĩ có đánh giá cao nhất, sẵn sàng hỗ trợ bạn.
            </p>

            {loading ? (
              <div className="hp-loading">
                <div className="hp-loading-dot" />
                <div className="hp-loading-dot" />
                <div className="hp-loading-dot" />
              </div>
            ) : topDoctors.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có bác sĩ nào.</p>
            ) : (
              <div className="hp-docs-grid">
                {topDoctors.map((doc, i) => (
                  <div
                    key={doc.doctorId || doc.id || i}
                    className="hp-doc-card"
                    onClick={() => navigate(`/appointment/${doc.doctorId || doc.id}`)}
                  >
                    <div className="hp-doc-img-wrap">
                      <img
                        src={doc.photo || doc.avatarUrl || doc.image}
                        alt={doc.doctorName || doc.name || doc.fullName}
                        className="hp-doc-img"
                        onError={e => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.doctorName || doc.name || doc.fullName || 'Doctor')}&background=eef2ff&color=6366f1&size=200`
                        }}
                      />
                    </div>
                    <div className="hp-doc-body">
                      <div className="hp-doc-badges">
                        <div className="hp-doc-avail active">
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                          Đang hoạt động
                        </div>
                        <div className="hp-doc-rating">
                          ⭐ {doc.ratingAverage != null ? doc.ratingAverage.toFixed(1) : (doc.rating || '0.0')}
                        </div>
                      </div>
                      <h3 className="hp-doc-name">{doc.doctorName || doc.name || doc.fullName}</h3>
                      <p className="hp-doc-spec">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        {doc.specialtyName || doc.specialty}
                      </p>
                      <button className="hp-doc-btn">Đặt lịch ngay</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="hp-more-btn" onClick={() => navigate("/doctors")}>
              Xem thêm bác sĩ →
            </button>
          </div>

          {/* ===== WHY US ===== */}
          <div className="hp-section">
            <h2 className="hp-section-title">Tại sao chọn DocBooking?</h2>
            <p className="hp-section-sub">
              Chúng tôi mang đến giải pháp chăm sóc sức khỏe toàn diện và tiện lợi nhất.
            </p>
            <div className="hp-services-grid">
              {[
                { icon: '⚡', title: 'Đặt lịch tức thì', desc: 'Không cần chờ đợi, đặt lịch trong vài giây và nhận xác nhận ngay.' },
                { icon: '🛡️', title: 'Bảo mật tuyệt đối', desc: 'Thông tin y tế của bạn được bảo vệ bằng tiêu chuẩn bảo mật cao nhất.' },
                { icon: '💊', title: 'Kết quả trực tuyến', desc: 'Xem kết quả khám bệnh trực tiếp trên hệ thống mọi lúc mọi nơi.' },
              ].map(s => (
                <div key={s.title} className="hp-service-card">
                  <div className="hp-service-icon">{s.icon}</div>
                  <h3 className="hp-service-title">{s.title}</h3>
                  <p className="hp-service-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== CTA BANNER ===== */}
          <div className="hp-cta">
            <div className="hp-cta-left">
              <p className="hp-cta-tag">Bắt đầu ngay hôm nay</p>
              <h2 className="hp-cta-title">
                Đặt lịch hẹn với
                <br />hơn 100 bác sĩ hàng đầu
              </h2>
              <button
                className="hp-cta-btn"
                onClick={() => navigate(isLoggedIn ? "/doctors" : "/register")}
              >
                {isLoggedIn ? "Đặt lịch ngay" : "Tạo tài khoản"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="hp-cta-right">
              <img src={bannerImg} alt="" />
            </div>
          </div>

        </div>
        <div style={{ marginTop: '60px' }}>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default HomePage