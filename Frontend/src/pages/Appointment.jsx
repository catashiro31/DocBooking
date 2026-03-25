import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BookingSlots from '../components/Booking';
import RelatedDoctors from '../components/Related';
import { doctorService } from '../services/doctorService';
import '../styles/Appointment.css';
import Footer from '../components/footer';

export default function Appointment() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', text }

  // Fetch doctor detail
  useEffect(() => {
    if (!docId) return;
    setLoading(true);
    setError(null);
    doctorService
      .getDoctorDetail(docId)
      .then(data => { setDoctor(data); setLoading(false); })
      .catch(() => { setError('Không hiện mô tả bác sĩ. Thử lại.'); setLoading(false); });
  }, [docId]);

  // Fetch related doctors after doctor loaded
  useEffect(() => {
    const spec = doctor?.specialty ?? doctor?.specialization;
    if (!spec) return;

    doctorService
      .getDoctors({ specialty: spec })
      .then((data) => {
        const filtered = data.filter((d) => String(d.id) !== String(docId));
        setRelatedDoctors(filtered.slice(0, 5));
      })
      .catch(() => setRelatedDoctors([]));
  }, [doctor, docId]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBook = async (selectedSlot) => {
    if (!selectedSlot) {
      showToast('error', 'Vui lòng chọn khung giờ trước khi đặt lịch.');
      return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await doctorService.bookAppointment(selectedSlot.id);
      showToast('success', '🎉 Đặt lịch thành công! Kiểm tra lịch sử trong tài khoản của bạn.');
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Đặt lịch thất bại. Vui lòng thử lại.';
      showToast('error', msg);
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
                {doctor.qualification ?? doctor.degree ?? 'MBBS'}
                {' – '}
                {doctor.specialty ?? doctor.specialization ?? 'Specialist'}
                <span className="appt-exp-badge">
                  {doctor.experience ?? doctor.yearsOfExperience ?? '0'} years
                </span>
              </p>

              <div className="appt-about">
                <span className="appt-about-label">
                  About
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
                Appointment Fee :{' '}
                <strong>₹{doctor.appointmentFee ?? doctor.fee ?? '—'}</strong>
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