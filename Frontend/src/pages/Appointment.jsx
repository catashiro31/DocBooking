import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BookingSlots from '../components/Booking';
import RelatedDoctors from '../components/Related';
import { doctorService } from '../services/doctorService';
import { patientService } from '../services/patientService';
import Footer from '../components/Footer';

const css = `
.appt-page { min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; }
.appt-container { max-width: 1000px; margin: 40px auto 80px; padding: 0 24px; flex: 1; width: 100%; box-sizing: border-box; }

/* Profile Card */
.appt-profile-card {
  display: flex; gap: 32px; background: #fff; border-radius: 24px; padding: 32px;
  box-shadow: 0 10px 40px rgba(99,102,241,0.08); border: 1px solid #eef2ff;
  margin-bottom: 40px; align-items: flex-start;
}
.appt-profile-img-wrap {
  width: 220px; height: 220px; border-radius: 20px; overflow: hidden; flex-shrink: 0;
  background: linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%);
  display: flex; align-items: flex-end; justify-content: center;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
}
.appt-profile-img { width: 90%; height: 90%; object-fit: cover; object-position: top; }

.appt-profile-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.appt-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.appt-doctor-name { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.2; letter-spacing: -0.02em; }
.appt-qualification { font-size: 15px; color: #475569; margin: 0 0 20px; display: flex; align-items: center; gap: 12px; font-weight: 500; }
.appt-exp-badge { background: #eef2ff; color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; display: inline-block; }

.appt-about { margin-bottom: 24px; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; }
.appt-about-label { display: flex; align-items: center; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.appt-about-text { font-size: 14px; color: #64748b; line-height: 1.7; margin: 0; }

.appt-fee { font-size: 15px; color: #475569; margin: 0; display: flex; align-items: center; gap: 8px; }
.appt-fee strong { font-size: 20px; color: #0f172a; font-weight: 800; }

/* Skeleton */
.appt-skeleton-card { display: flex; gap: 32px; background: #fff; border-radius: 24px; padding: 32px; border: 1px solid #eef2ff; margin-bottom: 40px; }
.appt-skeleton { background: #e2e8f0; border-radius: 8px; animation: pulse 1.5s infinite; }
.appt-skeleton--img { width: 220px; height: 220px; border-radius: 20px; flex-shrink: 0; }
.appt-skeleton-lines { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
.appt-skeleton--line { height: 16px; width: 100%; }
.appt-skeleton--wide { height: 32px; width: 60%; margin-bottom: 8px; }
.appt-skeleton--short { width: 40%; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

/* Toast */
.appt-toast { position: fixed; top: 20px; right: 20px; padding: 16px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; color: #fff; z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.appt-toast--success { background: #10b981; }
.appt-toast--error { background: #ef4444; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@media (max-width: 768px) {
  .appt-profile-card { flex-direction: column; align-items: center; text-align: center; padding: 24px; gap: 24px; }
  .appt-name-row { justify-content: center; }
  .appt-qualification { justify-content: center; flex-wrap: wrap; }
  .appt-fee { justify-content: center; }
  .appt-about-label { justify-content: center; }
  .appt-skeleton-card { flex-direction: column; align-items: center; }
  .appt-skeleton--wide, .appt-skeleton--short { margin-left: auto; margin-right: auto; }
}
`;

export default function Appointment() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch doctor detail
  useEffect(() => {
    if (!docId) return;
    setLoading(true);
    setError(null);
    doctorService
      .getDoctorDetail(docId)
      .then(data => { setDoctor(data); setLoading(false); })
      .catch(() => { setError('Không thể tải thông tin bác sĩ.'); setLoading(false); });
  }, [docId]);

  // Fetch related doctors
  useEffect(() => {
    const specId = doctor?.specialtyId || doctor?.specialty?.id;
    if (!specId) return;

    doctorService
      .getDoctors({ specId, size: 6 })
      .then((data) => {
        const list = data.content || data || [];
        const filtered = list.filter((d) => String(d.doctorId || d.id) !== String(docId));
        setRelatedDoctors(filtered.slice(0, 5));
      })
      .catch(() => setRelatedDoctors([]));
  }, [doctor, docId]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleBook = async (bookingData) => {
    if (!bookingData?.scheduleId) {
      showToast('error', 'Vui lòng chọn khung giờ trước khi đặt lịch.');
      return;
    }
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/signin', { state: { from: `/appointment/${docId}` } });
      return;
    }

    try {
      await patientService.createAppointment({
        scheduleId: bookingData.scheduleId,
        relativeId: bookingData.patientId || null,
        reason: bookingData.reason || ''
      });
      showToast('success', 'Đặt lịch thành công! Vui lòng chờ bác sĩ xác nhận.');
    } catch (err) {
      const msg = err?.response?.data || 'Đặt lịch thất bại. Vui lòng thử lại.';
      showToast('error', typeof msg === 'string' ? msg : 'Đặt lịch thất bại');
    }
  };

  return (
    <div className="appt-page">
      <Header />

      {/* Toast notification */}
      {toast && (
        <div className={`appt-toast appt-toast--${toast.type}`}>
          {toast.text}
        </div>
      )}

      <div className="appt-container">
        {loading ? (
          <div className="appt-skeleton-card">
            <div className="appt-skeleton appt-skeleton--img" />
            <div className="appt-skeleton-lines">
              <div className="appt-skeleton appt-skeleton--line appt-skeleton--wide" />
              <div className="appt-skeleton appt-skeleton--line" />
              <div className="appt-skeleton appt-skeleton--line appt-skeleton--short" />
            </div>
          </div>
        ) : !doctor ? (
          <div className="appt-error">Không tìm thấy thông tin bác sĩ.</div>
        ) : (
          /* Doctor profile card */
          <div className="appt-profile-card">
            <div className="appt-profile-img-wrap">
              <img
                src={doctor.photo ?? doctor.avatarUrl ?? doctor.imageUrl}
                alt={doctor.name}
                className="appt-profile-img"
                onError={e => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=6366f1&color=fff&size=300`;
                }}
              />
            </div>

            <div className="appt-profile-info">
              <div className="appt-name-row">
                <h1 className="appt-doctor-name">{doctor.name}</h1>
                <svg className="appt-verified" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#4361EE" />
                  <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <p className="appt-qualification">
                {doctor.qualification ?? doctor.degree ?? 'Bác sĩ'}
                {' – '}
                {doctor.specialty ?? doctor.specialization ?? 'Chuyên khoa'}
                <span className="appt-exp-badge">
                  {doctor.experience ?? doctor.yearsOfExperience ?? '0'} năm
                </span>
              </p>

              <div className="appt-about">
                <span className="appt-about-label">
                  Thông tin bác sĩ
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
                    <circle cx="8" cy="8" r="7.5" stroke="#6B7280" />
                    <rect x="7.25" y="6.5" width="1.5" height="5.5" rx="0.75" fill="#6B7280" />
                    <circle cx="8" cy="4.5" r="0.85" fill="#6B7280" />
                  </svg>
                </span>
                <p className="appt-about-text">
                  {doctor.description ?? doctor.about ?? 'Chưa có thông tin mô tả.'}
                </p>
              </div>

              <p className="appt-fee">
                Phí khám bệnh:{' '}
                <strong>{doctor.appointmentFee ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(doctor.appointmentFee) : doctor.fee ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(doctor.fee) : '—'}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Booking slots component */}
        {!loading && doctor && (
          <BookingSlots docId={docId} onBook={handleBook} />
        )}

        {/* Related doctors component */}
        <RelatedDoctors doctors={relatedDoctors} />
      </div>
      <Footer />
    </div>
  );
}