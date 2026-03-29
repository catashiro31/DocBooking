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
.hp-hero-right img { 
  width: 480px; max-width: 100%; 
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15));
  animation: float 4s ease-in-out infinite;
}

/* ===== SKELETONS ===== */
.skeleton-spec { width: 120px; height: 140px; border-radius: 18px; }
.skeleton-doc { width: 100%; height: 380px; border-radius: 20px; }

/* ===== SECTION TITLES ===== */
.hp-section { text-align: center; margin-top: 100px; }
.hp-section-title {
  font-size: 36px; font-weight: 800; color: #0f172a; margin: 0 0 12px; letter-spacing: -0.03em;
}
.hp-section-sub {
  font-size: 16px; color: #64748b; max-width: 520px; margin: 0 auto 48px; line-height: 1.6;
}

/* ===== SPECIALTIES ===== */
.hp-specs {
  display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;
}
.hp-spec-card {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 24px 28px; min-width: 130px;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 24px;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
}
.hp-spec-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(99,102,241,0.15); border-color: #6366f1; }
.hp-spec-img {
  width: 68px; height: 68px; border-radius: 18px; object-fit: contain; padding: 12px;
  background: #f5f3ff; transition: transform 0.3s ease;
}
.hp-spec-card:hover .hp-spec-img { transform: scale(1.1); }
.hp-spec-name { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0; text-align: center; }

/* ===== DOCTORS GRID ===== */
.hp-docs-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
}
.hp-doc-card {
  background: #fff; border-radius: 24px; overflow: hidden;
  border: 1px solid #e2e8f0; cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
  display: flex; flex-direction: column;
}
.hp-doc-card:hover { 
  transform: translateY(-10px); 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); 
  border-color: #6366f1; 
}
.hp-doc-img-wrap {
  width: 100%; height: 240px;
  background: linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%);
  display: flex; align-items: flex-end; justify-content: center;
  overflow: hidden;
  position: relative;
}
.hp-doc-img { 
  width: 90%; height: 95%; 
  object-fit: cover; object-position: top;
  transition: transform 0.5s ease;
}
.hp-doc-card:hover .hp-doc-img { transform: scale(1.08); }

.hp-doc-body { padding: 24px; border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.hp-doc-badges { display: flex; justify-content: space-between; align-items: center; }
.hp-doc-avail {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 700; padding: 6px 12px;
  border-radius: 20px;
}
.hp-doc-avail.active { color: #059669; background: #d1fae5; }
.hp-doc-rating { font-size: 14px; font-weight: 800; color: #475569; display: flex; align-items: center; gap: 4px; }

.hp-doc-name { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.2; }
.hp-doc-spec { font-size: 14px; color: #64748b; margin: 0; display: flex; align-items: center; gap: 8px; font-weight: 500; }

.hp-doc-btn {
  margin-top: 8px; padding: 12px 0; width: 100%;
  border-radius: 14px; border: none;
  background: #f8fafc; color: #6366f1;
  font-size: 14px; font-weight: 700;
  transition: all 0.3s; cursor: pointer; font-family: inherit;
}
.hp-doc-card:hover .hp-doc-btn {
  background: #6366f1; color: #fff;
  box-shadow: 0 8px 20px rgba(99,102,241,0.3);
}

.hp-more-btn {
  margin-top: 48px; padding: 14px 36px;
  border-radius: 16px; border: 2px solid #eef2ff;
  background: #fff; color: #6366f1;
  font-size: 15px; font-weight: 700; cursor: pointer;
  transition: all 0.3s; font-family: inherit;
}
.hp-more-btn:hover { background: #6366f1; color: #fff; border-color: #6366f1; box-shadow: 0 10px 25px rgba(99,102,241,0.3); transform: translateY(-3px); }

/* ===== SERVICES ===== */
.hp-services-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  max-width: 1000px; margin: 0 auto;
}
.hp-service-card {
  background: #fff; border-radius: 24px; padding: 36px 32px;
  border: 1px solid #e2e8f0; transition: all 0.3s ease;
  cursor: pointer; position: relative; overflow: hidden;
  text-align: left;
}
.hp-service-card::after {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  opacity: 0; transition: opacity 0.3s ease;
  z-index: 0;
}
.hp-service-card:hover::after { opacity: 1; }
.hp-service-card:hover { border-color: transparent; transform: translateY(-5px); }
.hp-service-card:hover * { color: #fff !important; position: relative; z-index: 1; }

.hp-service-icon { font-size: 32px; margin-bottom: 20px; display: block; }
.hp-service-title { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0 0 10px; }
.hp-service-desc { font-size: 14px; color: #64748b; line-height: 1.7; margin: 0; font-weight: 500; }

/* ===== CTA BANNER ===== */
.hp-cta {
  display: flex; align-items: center;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
  border-radius: 32px; color: #fff; overflow: hidden;
  margin-top: 100px; position: relative;
  box-shadow: 0 30px 60px rgba(99,102,241,0.25);
}
.hp-cta-left { flex: 1; padding: 80px 0 80px 80px; position: relative; z-index: 1; }
.hp-cta-tag { font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.8); margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px; }
.hp-cta-title { font-size: 42px; font-weight: 800; margin: 0 0 32px; line-height: 1.1; letter-spacing: -0.03em; }
.hp-cta-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 16px 36px; border-radius: 16px; border: none;
  background: #fff; color: #6366f1;
  font-size: 16px; font-weight: 800; cursor: pointer;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  transition: all 0.3s; font-family: inherit;
}
.hp-cta-btn:hover { transform: scale(1.05); box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
.hp-cta-right { flex: 1; display: flex; justify-content: flex-end; align-items: flex-end; position: relative; z-index: 1; }
.hp-cta-right img { width: 440px; transform: translateY(10px); }

/* ===== MARQUEE (CƠ SỞ Y TẾ) ===== */
.hp-marquee-wrapper { position: relative; overflow: hidden; margin-top: 48px; padding: 20px 0; }
.hp-marquee-track {
  display: flex; align-items: center; width: max-content;
  animation: scrollMarquee 45s linear infinite;
}
.hp-marquee-track:hover { animation-play-state: paused; }
.hp-facility-card {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 100px;
  padding: 10px 28px 10px 10px; margin: 0 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  transition: all 0.3s; cursor: pointer;
}
.hp-facility-card:hover { border-color: #6366f1; box-shadow: 0 10px 25px rgba(99,102,241,0.12); transform: translateY(-3px); }
.hp-facility-img {
  width: 48px; height: 48px; border-radius: 50%;
  object-fit: cover; background: #f5f3ff;
}
.hp-facility-name { font-size: 16px; font-weight: 700; color: #1e293b; white-space: nowrap; margin: 0; }


@keyframes scrollMarquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.33%); }
}

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
  const [facilities, setFacilities] = useState([])
  const [stats, setStats] = useState({ totalDoctors: 0, totalAppointments: 0, averageRating: 5.0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    Promise.all([
      doctorService.getDoctors({ size: 8, sortBy: 'rating' }),
      doctorService.getSpecialties(),
      doctorService.getFacilities(),
      doctorService.getPortalStats()
    ])
      .then(([doctorsData, specialtiesData, facilitiesData, statsData]) => {
        const doctors = doctorsData?.content || doctorsData || []
        setTopDoctors(Array.isArray(doctors) ? doctors.slice(0, 8) : [])

        const specs = Array.isArray(specialtiesData) ? specialtiesData : []
        setSpecialties(specs.slice(0, 6).map((s, i) => ({
          ...s,
          image: s.imageUrl || defaultImages[i % defaultImages.length]
        })))
        
        const facs = Array.isArray(facilitiesData) ? facilitiesData : []
        setFacilities(facs.slice(0, 15))

        if (statsData) setStats(statsData)

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
          <div className="hp-hero reveal">
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
                <div className="hp-stat-card reveal-delayed">
                  <div className="hp-stat-icon">👨‍⚕️</div>
                  <div className="hp-stat-info">
                    <p className="hp-hero-stat-num">{stats.totalDoctors}+</p>
                    <p className="hp-hero-stat-label">Bác sĩ chuyên khoa</p>
                  </div>
                </div>
                <div className="hp-stat-card reveal-delayed" style={{ animationDelay: '0.3s' }}>
                  <div className="hp-stat-icon">📅</div>
                  <div className="hp-stat-info">
                    <p className="hp-hero-stat-num">{stats.totalAppointments}</p>
                    <p className="hp-hero-stat-label">Lượt đặt lịch</p>
                  </div>
                </div>
                <div className="hp-stat-card reveal-delayed" style={{ animationDelay: '0.4s' }}>
                  <div className="hp-stat-icon">⭐</div>
                  <div className="hp-stat-info">
                    <p className="hp-hero-stat-num">{stats.averageRating}/5</p>
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
          <div className="hp-section reveal">
            <h2 className="hp-section-title">Tìm theo chuyên khoa</h2>
            <p className="hp-section-sub">
              Duyệt qua các chuyên khoa y tế và tìm bác sĩ phù hợp với nhu cầu của bạn.
            </p>
            <div className="hp-specs">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="skeleton skeleton-spec" />
                ))
              ) : (
                specialties.map((item, i) => (
                  <div
                    key={item.id || i}
                    className="hp-spec-card reveal-delayed"
                    style={{ animationDelay: `${0.1 * i}s` }}
                    onClick={() => navigate(`/doctors?specId=${item.id}`)}
                  >
                    <img src={item.image} alt={item.name} className="hp-spec-img" />
                    <p className="hp-spec-name">{item.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ===== FACILITIES MARQUEE ===== */}
          {facilities.length > 0 && (
            <div className="hp-section reveal" style={{ marginTop: '100px' }}>
              <h2 className="hp-section-title">Cơ sở y tế đối tác</h2>
              <p className="hp-section-sub">Chúng tôi đồng hành cùng các bệnh viện và phòng khám uy tín nhất.</p>
              
              <div className="hp-marquee-wrapper">
                <div className="hp-marquee-track">
                  {[...facilities, ...facilities, ...facilities].map((fac, i) => (
                    <div key={i} className="hp-facility-card" onClick={() => navigate('/facilities')}>
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fac.name || 'HOS')}&background=f5f3ff&color=6366f1`} 
                        alt={fac.name} 
                        className="hp-facility-img" 
                      />
                      <p className="hp-facility-name">{fac.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== TOP DOCTORS ===== */}
          <div className="hp-section reveal">
            <h2 className="hp-section-title">Bác sĩ được tin cậy</h2>
            <p className="hp-section-sub">
              Những bác sĩ có đánh giá cao nhất, sẵn sàng hỗ trợ bạn.
            </p>

            {loading ? (
              <div className="hp-docs-grid">
                {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton skeleton-doc" />)}
              </div>
            ) : topDoctors.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có bác sĩ nào.</p>
            ) : (
              <div className="hp-docs-grid">
                {topDoctors.map((doc, i) => (
                  <div
                    key={doc.doctorId || doc.id || i}
                    className="hp-doc-card reveal-delayed"
                    style={{ animationDelay: `${0.2 * i}s` }}
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
                          Hoạt động
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
                      <button className="hp-doc-btn">Đặt lịch khám</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="hp-more-btn" onClick={() => navigate("/doctors")}>
              Xem thêm bác sĩ
            </button>
          </div>

          {/* ===== WHY US ===== */}
          <div className="hp-section reveal" style={{ marginBottom: '40px' }}>
            <h2 className="hp-section-title">Tại sao chọn DocBooking?</h2>
            <p className="hp-section-sub">
              Chúng tôi mang đến giải pháp chăm sóc sức khỏe toàn diện và tiện lợi nhất.
            </p>
            <div className="hp-services-grid">
              {[
                { icon: '⚡', title: 'Đặt lịch tức thì', desc: 'Không cần chờ đợi, đặt lịch trong vài giây và nhận xác nhận ngay.' },
                { icon: '🛡️', title: 'Bảo mật tuyệt đối', desc: 'Thông tin y tế của bạn được bảo vệ bằng tiêu chuẩn bảo mật cao nhất.' },
                { icon: '💊', title: 'Kết quả trực tuyến', desc: 'Xem kết quả khám bệnh trực tiếp trên hệ thống mọi lúc mọi nơi.' },
              ].map((s, i) => (
                <div key={s.title} className="hp-service-card reveal-delayed" style={{ animationDelay: `${0.1 * i}s` }}>
                  <span className="hp-service-icon">{s.icon}</span>
                  <h3 className="hp-service-title">{s.title}</h3>
                  <p className="hp-service-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== CTA BANNER ===== */}
          <div className="hp-cta reveal">
            <div className="hp-cta-left">
              <p className="hp-cta-tag">Bắt đầu ngay hôm nay</p>
              <h2 className="hp-cta-title">
                Sẵn sàng chăm sóc
                <br />sức khỏe của bạn?
              </h2>
              <button
                className="hp-cta-btn"
                onClick={() => navigate(isLoggedIn ? "/doctors" : "/register")}
              >
                {isLoggedIn ? "Đặt lịch ngay" : "Tạo tài khoản"}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="hp-cta-right">
              <img src={bannerImg} alt="" />
            </div>
          </div>

        </div>
        <div style={{ marginTop: '100px' }}>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default HomePage