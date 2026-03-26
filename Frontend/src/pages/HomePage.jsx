import React, { useEffect, useState } from "react"
import { doctorService } from "../services/doctorService"
import { useNavigate } from "react-router-dom"
import doctorImg from "../images/home_booking-removebg-preview.png"
import img1 from "../images/img1.png"
import img2 from "../images/img2.png"
import img3 from "../images/img3.png"
import img4 from "../images/img4.png"
import img5 from "../images/img5.png"
import img6 from "../images/img6.png"
import icon from "../images/iconHome.png"
import d from "../../public/doctors/Ham.jpg"
import bannerImg from "../images/banner-removebg-preview.png"
import Footer from "../components/Footer"
import Header from "../components/Header"

function HomePage() {
  const [topDoctors, setTopDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const SPECIALTIES = [
    { name: "General physician", image: img1 },
    { name: "Gynecologist", image: img2 },
    { name: "Dermatologist", image: img3 },
    { name: "Pediatrician", image: img4 },
    { name: "Neurologist", image: img5 },
    { name: "Gastroenterologist", image: img6 },
  ]

  useEffect(() => {
    doctorService
      .getDoctors()
      .then((data) => {
        setTopDoctors(data.slice(0, 8))
        setLoading(false)
      })
      .catch((error) => {
        console.error("Lỗi lấy danh sách bác sĩ:", error)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');

  /* Hiệu ứng hover giữ nguyên y hệt desktop */
  .hp-specialty-item:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(95,109,252,0.15) !important; border-color: #c3c9ff !important; }
  .hp-doctor-card:hover { transform: translateY(-7px); box-shadow: 0 16px 40px rgba(95,109,252,0.15) !important; border-color: #c3c9ff !important; }
  .hp-more-btn:hover { background: linear-gradient(135deg,#5f6dfc,#a78bfa) !important; border-color: transparent !important; color: white !important; box-shadow: 0 8px 22px rgba(95,109,252,0.3) !important; transform: translateY(-2px); }
  .hp-hero-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(0,0,0,0.18) !important; }
  .hp-banner-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(0,0,0,0.18) !important; }


  /* ==================== RESPONSIVE MOBILE < 640px ==================== */
  @media (max-width: 640px) {

    /* Toàn trang */
    .hp-wrapper {
      padding: 16px 12px !important;
    }

    .hp-wrapper > div {
      margin-top: 52px !important;
    }
    .hp-wrapper > div:first-child {
      margin-top: 0 !important;
    }

    .hp-wrapper h2 {
      font-size: 22px !important;
    }

    .hp-wrapper p[style*="color: '#718096'"] {
      font-size: 14px !important;
      padding: 0 10px;
    }


    /* === PHẦN HERO === */
    .hp-hero {
      flex-direction: column !important;
      padding: 32px 20px 24px 20px !important;
      gap: 20px !important;
    }

    .hp-hero h1 {
      font-size: 28px !important;
      text-align: center !important;
    }

    .hp-hero > div:first-child {
      align-items: center !important;
      text-align: center !important;
      gap: 18px !important;
    }

    .hp-hero div[style*="align-items: center; gap: '16px'"] {
      flex-direction: column !important;
      gap: 12px !important;
    }

    .hp-hero p {
      font-size: 14px !important;
    }

    .hp-hero-btn {
      width: 100% !important;
      min-height: 50px;
      justify-content: center !important;
    }

    .hp-hero img[alt="doctor"] {
      width: 240px !important;
    }


    /* === PHẦN CHUYÊN NGÀNH === */
    .hp-specialties-grid {
      gap: 12px !important;
    }

    .hp-specialty-item {
      min-width: 92px !important;
      padding: 12px 10px !important;
    }

    .hp-specialty-item img {
      width: 52px !important;
      height: 52px !important;
      padding: 8px !important;
    }

    .hp-specialty-item p {
      font-size: 12px !important;
    }


    /* === PHẦN DANH SÁCH BÁC SĨ === */
    .hp-doctor-grid {
      grid-template-columns: repeat(2,1fr) !important;
      gap: 12px !important;
    }

    .hp-doctor-card img {
      height: 135px !important;
    }

    .hp-doctor-card h3 {
      font-size: 14px !important;
    }

    .hp-doctor-card p {
      font-size: 12px !important;
    }

    .hp-more-btn {
      width: 100% !important;
      min-height: 48px;
    }


    /* === ✅ PHẦN BANNER ĐÃ LÀM LẠI HOÀN TOÀN === */
    .hp-banner {
      flex-direction: column !important;
      padding: 36px 24px 0 24px !important;
      gap: 24px !important;
    }

    .hp-banner > div:first-child {
      align-items: center !important;
      text-align: center !important;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .hp-banner h2 {
      font-size: 16px !important;
    }

    .hp-banner h1 {
      font-size: 24px !important;
      text-align: center !important;
      margin-bottom: 12px !important;
    }

    .hp-banner-btn {
      width: 100% !important;
      min-height: 50px;
    }

    .hp-banner .img_baner {
      width: 270px !important;
      transform: translateY(12px) !important;
    }

  }


  /* Responsive Tablet 640px - 1024px */
  @media (max-width: 1024px) {
    .hp-wrapper {
      padding: 24px 30px !important;
    }

    .hp-hero h1 {
      font-size: 38px !important;
    }

    .hp-doctor-grid {
      grid-template-columns: repeat(3,1fr) !important;
    }
  }
`}</style>

      <Header />

      {/* Home wrapper */}
      <div className="hp-wrapper" style={{ padding: '40px 80px', background: '#f7f9fc', fontFamily: "'Nunito', sans-serif" }}>

        {/* ===== HERO ===== */}
        <div className="hp-hero" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#5f6dfc',
          padding: '80px', borderRadius: '28px', color: 'white', gap: '50px',
          boxShadow: '0 24px 60px rgba(95,109,252,0.28)', position: 'relative', overflow: 'hidden'
        }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', width: '420px', height: '420px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%', top: '-120px', right: '-80px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: '220px', height: '220px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', bottom: '-60px', left: '40px', pointerEvents: 'none' }} />

          {/* Hero Left */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '26px', position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '52px', fontWeight: 700, lineHeight: 1.2, color: 'white', margin: 0, textAlign: 'left' }}>
              Đặt lịch hẹn <br />
              với các bác sĩ đáng tin cậy
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={icon} alt="icon" style={{ width: '140px', height: '56px', borderRadius: '40px', background: 'rgba(255,255,255,0.15)' }} />
              <p style={{ maxWidth: '380px', lineHeight: 1.65, fontSize: '16px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                Chỉ cần duyệt qua danh sách bác sĩ đáng tin cậy của chúng tôi và
                đặt lịch hẹn một cách dễ dàng,
              </p>
            </div>

            <button
              className="hp-hero-btn"
              onClick={() => navigate("/signout")}
              style={{ padding: '14px 26px', borderRadius: '50px', border: 'none', background: 'white', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '15px', color: '#5f6dfc', width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'all 0.3s ease' }}
            >
              Đặt lịch hẹn →
            </button>
          </div>

          {/* Hero Right */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
            <img src={doctorImg} alt="doctor" style={{ width: '460px', maxWidth: '100%' }} />
          </div>
        </div>

        {/* ===== SPECIALITY ===== */}
        <div style={{ textAlign: 'center', marginTop: '90px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, marginBottom: '10px', color: '#1a202c' }}>
            Tìm theo chuyên ngành
          </h2>
          <p style={{ maxWidth: '500px', margin: '0 auto 40px', color: '#718096', fontSize: '15.5px', lineHeight: 1.6 }}>
            Chỉ cần duyệt qua danh sách bác sĩ đáng tin cậy của chúng tôi và đặt lịch hẹn một cách dễ dàng.
          </p>

          <div className="hp-specialties-grid" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {SPECIALTIES.map((item) => (
              <div
                key={item.name}
                className="hp-specialty-item"
                onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(item.name)}`)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.3s ease', padding: '16px 20px', borderRadius: '16px', background: 'white', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.05)', minWidth: '110px' }}
              >
                <img src={item.image} alt={item.name} style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#eef0ff', padding: '12px', objectFit: 'contain' }} />
                <p style={{ marginTop: '12px', fontSize: '13.5px', fontWeight: 600, color: '#2d3748', margin: '12px 0 0' }}>{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== TOP DOCTORS ===== */}
        <div style={{ textAlign: 'center', marginTop: '90px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, marginBottom: '10px', color: '#1a202c' }}>
            Các bác sĩ hàng đầu nên đặt lịch hẹn
          </h2>
          <p style={{ color: '#718096', fontSize: '15.5px', marginBottom: '44px' }}>
            Bạn chỉ cần duyệt qua danh sách bác sĩ đáng tin cậy của chúng tôi.
          </p>

          <div className="hp-doctor-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {loading ? (
              <p>Loading...</p>
            ) : topDoctors.length === 0 ? (
              <p>No doctors found</p>
            ) : (
              topDoctors.map((doc) => (
                <div
                  className="hp-doctor-card"
                  key={doc.id}
                  style={{ background: '#ffffff', borderRadius: '18px', overflow: 'hidden', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 18px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                >
                  <img src={doc.image || d} alt={doc.name} style={{ width: '100%', height: '220px', objectFit: 'contain', padding: '10px 0' }} />
                  <div style={{ padding: '16px 18px 18px', textAlign: 'left', borderTop: '1px solid #f0f2f8' }}>
                    <span style={{ color: '#38a169', fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.3px' }}>● Available</span>
                    <h3 style={{ margin: '6px 0 4px', fontSize: '16px', fontWeight: 700, color: '#1a202c' }}>{doc.name}</h3>
                    <p style={{ color: '#718096', fontSize: '13.5px', margin: 0 }}>{doc.specialty}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            className="hp-more-btn"
            onClick={() => navigate("/doctors")}
            style={{ marginTop: '44px', padding: '13px 32px', borderRadius: '50px', border: '1.5px solid #c3c9ff', background: 'white', color: '#5f6dfc', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '15px', cursor: 'pointer', transition: 'all 0.3s ease' }}
          >
            Thêm bác sĩ
          </button>
        </div>

        {/* ===== BANNER ===== */}
        <div className="hp-banner" style={{
          marginTop: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#5f6dfc',
          padding: '80px 80px 0 80px', borderRadius: '28px', color: 'white', overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(95,109,252,0.28)', position: 'relative'
        }}>
          <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', top: '-80px', left: '-60px', pointerEvents: 'none' }} />

          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', margin: '0 0 8px', letterSpacing: '0.4px' }}>
              Đặt lịch hẹn
            </h2>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', fontWeight: 700, margin: '0 0 28px', color: 'white', lineHeight: 1.2, textAlign: 'left' }}>
              Với hơn 10 bác sĩ đáng tin cậy
            </h1>
            <button
              className="hp-banner-btn"
              onClick={() => navigate("/signout")}
              style={{ padding: '14px 30px', borderRadius: '50px', border: 'none', background: 'white', color: '#5f6dfc', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', transition: 'all 0.3s ease' }}
            >
              Tạo tài khoản
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
            <img className="img_baner" src={bannerImg} alt="" style={{ width: '420px', transform: 'translateY(20px)' }} />
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}

export default HomePage;