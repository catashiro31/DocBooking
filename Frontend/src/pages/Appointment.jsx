import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import BookingSlots from '../components/Booking';
import RelatedDoctors from '../components/Related';
import DoctorCard from '../components/DoctorCard';
import { doctorService, unwrapPage } from '../services/doctorService';
import { patientService } from '../services/patientService';
import Footer from '../components/Footer';
import { toast as rtToast } from 'react-toastify';

const getInitials = (name) => {
  if (!name) return "DR";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const css = `
.appt-page { 
  min-height: 100vh; background: #fdfdfd; font-family: 'Inter', sans-serif; color: #1e293b; 
  padding-top: 96px; padding-bottom: 60px; 
}

/* Breadcrumb */
.breadcrumb { max-width: 1200px; margin: 24px auto 0; padding: 0 24px; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #64748b; }
.breadcrumb a { color: #6366f1; text-decoration: none; font-weight: 500; }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb-sep { color: #cbd5e1; }

.appt-container { max-width: 1200px; margin: 24px auto; padding: 0 24px; }

/* Hero Section - Glassmorphism */
.hero-card {
  display: flex; gap: 48px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px);
  border-radius: 40px; padding: 48px; margin-bottom: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05); border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative; overflow: hidden;
}
.hero-card::before {
  content: ''; position: absolute; top: -50%; left: -10%; width: 40%; height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  transform: rotate(30deg); pointer-events: none;
}

.img-wrap {
  width: 320px; height: 380px; border-radius: 32px; overflow: hidden; flex-shrink: 0;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  box-shadow: 0 20px 40px rgba(0,0,0,0.06); position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center;
}
.doc-img { width: 100%; height: 100%; object-fit: cover; object-position: top; }

.initials-fallback {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  background: #eef2ff; color: #4f46e5; font-size: 84px; font-weight: 900; letter-spacing: -0.05em;
}

.info-wrap { flex: 1; position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: center; }
.name-row { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
.doc-name { font-size: 40px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.04em; line-height: 1; }
.verified-badge { 
  display: flex; align-items: center; gap: 6px; padding: 6px 14px; background: #e0e7ff; 
  color: #4361ee; border-radius: 50px; font-size: 13px; font-weight: 700; border: 1px solid #c7d2fe;
}

.doc-degree { font-size: 18px; color: #6366f1; font-weight: 700; margin-bottom: 8px; }
.doc-spec-pill { 
  display: inline-block; padding: 6px 16px; background: #f1f5f9; color: #475569; 
  border-radius: 12px; font-weight: 600; font-size: 16px; margin-bottom: 32px;
}

.stat-pills { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 40px; }
.stat-pill { 
  display: flex; align-items: center; gap: 10px; padding: 12px 20px; 
  background: #ffffff; border: 1px solid #f1f5f9; border-radius: 18px;
  font-size: 15px; font-weight: 600; color: #475569; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
}
.stat-pill svg { color: #6366f1; }

.fee-wrap { 
  background: #f8fafc; border-radius: 24px; padding: 24px 32px; 
  display: flex; align-items: center; justify-content: space-between;
  border: 1px solid #f1f5f9;
}
.fee-label { font-size: 13px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.fee-val { font-size: 28px; font-weight: 800; color: #0f172a; }

/* Info Grid */
.detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 60px; }
.detail-card { 
  background: #fff; border-radius: 32px; padding: 32px; 
  border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.02);
  display: flex; flex-direction: column;
}
.section-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 24px; display: flex; align-items: center; gap: 12px; }
.section-title svg { color: #6366f1; }

.bio-text { font-size: 16px; line-height: 1.8; color: #475569; margin: 0; }

.contact-item { display: flex; gap: 20px; margin-bottom: 24px; align-items: center; }
.contact-icon { 
  width: 48px; height: 48px; border-radius: 16px; background: #eef2ff; color: #6366f1; 
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.contact-info h4 { font-size: 12px; color: #94a3b8; text-transform: uppercase; margin: 0 0 4px; letter-spacing: 0.5px; }
.contact-info p { font-size: 16px; font-weight: 600; color: #1e293b; margin: 0; }

/* Reviews Snippet */
.review-snippet { 
  padding: 16px; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9; 
  margin-top: 12px; font-size: 14px; 
}
.rev-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.rev-author { font-weight: 700; color: #1e293b; }
.rev-stars { color: #f59e0b; display: flex; gap: 2px; }

/* Horizontal Carousel */
.section-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.carousel-container { 
  display: flex; gap: 24px; overflow-x: auto; padding: 10px 4px 30px; 
  scroll-behavior: smooth; -webkit-overflow-scrolling: touch; 
}
.carousel-container::-webkit-scrollbar { height: 6px; }
.carousel-container::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.carousel-item { min-width: 280px; flex-shrink: 0; }

.floating-cta {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  background: #0f172a; color: #fff; padding: 18px 40px; border-radius: 100px;
  font-weight: 700; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.4);
  display: flex; align-items: center; gap: 12px; z-index: 100;
  text-decoration: none; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; border: none;
}
.floating-cta:hover { transform: translateX(-50%) translateY(-5px); box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.5); }

/* Skeleton */
.skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #f8fafc 50%, #f1f5f9 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
@keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

@media (max-width: 1024px) {
  .hero-card { flex-direction: column; padding: 32px; gap: 40px; }
  .img-wrap { width: 100%; height: 420px; }
  .detail-grid { grid-template-columns: 1fr; }
  .doc-name { font-size: 32px; }
}
`;

export default function Appointment() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) return;
    setLoading(true);
    
    // Fetch individual doctor details
    doctorService.getDoctorDetail(docId)
      .then(data => {
        setDoctor(data);
        setLoading(false);
        window.scrollTo(0, 0);

        // Fetch same-specialty doctors
        doctorService.getDoctors({ specId: data.specialtyId, size: 6 })
          .then(res => {
            const list = unwrapPage(res).filter(d => String(d.doctorId || d.id) !== String(docId));
            setRelated(list);
          });

        // Fetch latest reviews
        doctorService.getDoctorReviews(docId)
          .then(res => setReviews(unwrapPage(res).slice(0, 2)));
      })
      .catch(() => {
        rtToast.error('Không thể tải thông tin bác sĩ.');
        setLoading(false);
      });
  }, [docId]);

  useEffect(() => {
    // Fetch global top-rated doctors
    doctorService.getDoctors({ sortBy: 'rating', size: 10 })
      .then(res => setTopRated(unwrapPage(res)));
  }, []);

  const handleBook = async (bookingData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/signin', { state: { from: `/appointment/${docId}` } });
      return;
    }

    try {
      await patientService.createAppointment({
        scheduleId: bookingData.scheduleId,
        patientId: bookingData.patientId || null,
        reason: bookingData.reason || ''
      });
      rtToast.success('Đặt lịch thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/patient'), 1500);
    } catch (err) {
      const msg = err?.response?.data || 'Đặt lịch thất bại.';
      rtToast.error(typeof msg === 'string' ? msg : 'Có lỗi xảy ra');
    }
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="appt-page">
        <style>{css}</style>
        <Header />
        <div className="appt-container">
           <div className="hero-card skeleton" style={{ height: 450, borderRadius: 40 }} />
        </div>
      </div>
    );
  }

  if (!doctor) return <div className="appt-page"><Header /><div className="appt-container">Bác sĩ không tồn tại hoặc đã bị ẩn.</div><Footer /></div>;

  const photo = doctor.avatarUrl || doctor.photo;
  const isPlaceholder = !photo || photo.includes("placeholder") || photo.includes("dicebear") || photo.includes("ui-avatars") || photo.includes("null");

  return (
    <div className="appt-page">
      <style>{css}</style>
      <Header />

      <nav className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/doctors">Bác sĩ</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{doctor.fullName}</span>
      </nav>

      <div className="appt-container">
        {/* --- HERO SECTION --- */}
        <section className="hero-card">
          <div className="img-wrap">
            {isPlaceholder ? (
              <div className="initials-fallback">{getInitials(doctor.fullName)}</div>
            ) : (
              <img 
                src={photo} 
                alt={doctor.fullName} 
                className="doc-img"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="initials-fallback">${getInitials(doctor.fullName)}</div>`;
                }}
              />
            )}
          </div>

          <div className="info-wrap">
            <div className="name-row">
              <h1 className="doc-name">{doctor.fullName}</h1>
              <div className="verified-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Verified
              </div>
            </div>

            {doctor.degree && <div className="doc-degree">{doctor.degree}</div>}
            <div className="doc-spec-pill">{doctor.specialtyName}</div>

            <div className="stat-pills">
              <div className="stat-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                {doctor.ratingAverage ? doctor.ratingAverage.toFixed(1) : '5.0'} ({doctor.totalReviews || 0} đánh giá)
              </div>
              <div className="stat-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                {doctor.experienceYears || '0'} năm kinh nghiệm
              </div>
              <div className="stat-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {doctor.facilityName || 'Cơ sở y tế'}
              </div>
            </div>

            <div className="fee-wrap">
              <div>
                <p className="fee-label">Phí tư vấn</p>
                <h2 className="fee-val">{doctor.price?.toLocaleString('vi-VN')} đ</h2>
              </div>
              <button className="floating-cta" style={{ position: 'static', transform: 'none' }} onClick={scrollToBooking}>
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </section>

        {/* --- INFO GRID --- */}
        <section className="detail-grid">
          {/* 1. Giới thiệu */}
          <div className="detail-card">
            <h2 className="section-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Giới thiệu
            </h2>
            <p className="bio-text">{doctor.bio || 'Thông tin bác sĩ đang được cập nhật.'}</p>
          </div>

          {/* 2. Nơi làm việc */}
          <div className="detail-card">
            <h2 className="section-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              Nơi làm việc
            </h2>
            <div className="contact-item">
              <div className="contact-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div>
              <div className="contact-info">
                <h4>Cơ sở</h4>
                <p>{doctor.facilityName || 'Đang cập nhật'}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg></div>
              <div className="contact-info">
                <h4>Địa chỉ</h4>
                <p>{doctor.facilityAddress || 'Đang cập nhật'}</p>
              </div>
            </div>
            {doctor.facilityMapUrl && (
              <a 
                  href={doctor.facilityMapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: '#f8fafc',
                      color: '#4f46e5',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      marginTop: '8px',
                      border: '1px solid #e2e8f0'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                      <line x1="9" y1="3" x2="9" y2="18"></line>
                      <line x1="15" y1="6" x2="15" y2="21"></line>
                  </svg>
                  Xem vị trí trên bản đồ
              </a>
            )}
          </div>

          {/* 3. Liên hệ */}
          <div className="detail-card">
            <h2 className="section-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Liên hệ trực tiếp
            </h2>
            <div className="contact-item">
              <div className="contact-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
              <div className="contact-info">
                <h4>Email công việc</h4>
                <p>{doctor.doctorEmail || '—'}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
              <div className="contact-info">
                <h4>Hotline cá nhân</h4>
                <p>{doctor.doctorPhone || '—'}</p>
              </div>
            </div>
          </div>

          {/* 4. Đánh giá */}
          <div className="detail-card">
            <h2 className="section-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Đánh giá từ người bệnh
            </h2>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>{doctor.ratingAverage?.toFixed(1) || '5.0'}</span>
              <span style={{ color: '#94a3b8', marginLeft: 8 }}>/ 5.0 ({doctor.totalReviews || 0} nhận xét)</span>
            </div>
            
            {reviews.length > 0 ? reviews.map(r => (
               <div key={r.reviewId} className="review-snippet">
                 <div className="rev-header">
                   <span className="rev-author">{r.patientName || 'Bệnh nhân ẩn danh'}</span>
                   <div className="rev-stars">
                     {Array.from({ length: r.rating }).map((_, i) => <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
                   </div>
                 </div>
                 <p style={{ margin: 0, color: '#64748b', fontStyle: 'italic' }}>"{r.comment}"</p>
               </div>
            )) : <p style={{ color: '#94a3b8' }}>Chưa có nhận xét chi tiết.</p>}
          </div>
        </section>

        {/* --- BOOKING SECTION --- */}
        <div id="booking-section" style={{ marginBottom: 80 }}>
          <BookingSlots docId={docId} onBook={handleBook} />
        </div>

        {/* --- TOP RATED DOCTORS (Carousel) --- */}
        {topRated.length > 0 && (
          <section style={{ marginBottom: 60 }}>
            <div className="section-row">
               <h2 style={{ fontSize: 24, fontWeight: 800 }}>Bác sĩ uy tín</h2>
               <Link to="/doctors" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Xem tất cả</Link>
            </div>
            <div className="carousel-container">
               {topRated.map(d => (
                 <div key={d.doctorId || d.id} className="carousel-item">
                   <DoctorCard doctor={d} />
                 </div>
               ))}
            </div>
          </section>
        )}

        {/* --- RELATED DOCTORS --- */}
        {related.length > 0 && (
          <RelatedDoctors 
            doctors={related} 
            title="Gợi ý cùng chuyên khoa" 
            sub="Các chuyên gia hàng đầu khác trong lĩnh vực tương tự" 
          />
        )}
      </div>

      <button className="floating-cta" onClick={scrollToBooking}>
        Đặt lịch ngay <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      <Footer />
    </div>
  );
}