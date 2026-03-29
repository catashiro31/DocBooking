import React from 'react';
import { useNavigate } from 'react-router-dom';

const css = `
.card { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
.card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border-color: #8b5cf6; }
.avatar-wrap { background: linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%); display: flex; align-items: flex-end; justify-content: center; height: 180px; overflow: hidden; }
.avatar { height: 90%; width: 90%; object-fit: cover; object-position: top; transition: transform 0.3s ease; }
.card:hover .avatar { transform: scale(1.05); }
.card-body { padding: 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; border-top: 1px solid #f1f5f9; }
.avail-badge { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.doc-name { margin: 0; font-size: 17px; font-weight: 700; color: #0f172a; line-height: 1.3; }
.doc-spec { margin: 0; font-size: 14px; color: #64748b; display: flex; align-items: center; gap: 6px; }
.meta-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
.meta-badge { 
  font-size: 12px; padding: 5px 10px; background: #f8fafc; border: 1px solid #f1f5f9; 
  border-radius: 10px; color: #475569; font-weight: 600; display: flex; align-items: center; gap: 5px; 
}
.meta-badge svg { width: 14px; height: 14px; }
.badge-star { color: #f59e0b; }
.badge-exp { color: #6366f1; }
.badge-fee { color: #10b981; }
.book-btn { margin-top: auto; padding: 12px 0; background: #f1f5f9; color: #475569; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; width: 100%; transition: all 0.2s; }
.card:hover .book-btn { background: #6366f1; color: #fff; transform: scale(1.02); }
`;

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const rating = doctor.ratingAverage != null ? doctor.ratingAverage : (doctor.rating || 5.0);
  const exp = doctor.experience || doctor.experienceYears || 0;
  const fee = doctor.fee || doctor.price || doctor.consultationFee || 0;

  return (
    <>
      <style>{css}</style>
      <div className="card" onClick={() => navigate(`/appointment/${doctor.doctorId || doctor.id}`)}>
        <div className="avatar-wrap">
          <img
            src={doctor.photo || doctor.avatarUrl || doctor.imageUrl}
            alt={doctor.doctorName || doctor.name || doctor.fullName}
            className="avatar"
            onError={e => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.doctorName || doctor.name || doctor.fullName || 'Doctor')}&background=dbeafe&color=1e40af&size=160`;
            }}
          />
        </div>
        <div className="card-body">
          <div className="avail-badge">
            <span className="dot" style={{ background: doctor.available !== false ? '#22c55e' : '#94a3b8' }} />
            <span style={{ color: doctor.available !== false ? '#16a34a' : '#64748b', fontSize: 13, fontWeight: 700 }}>
              {doctor.available !== false ? 'Đang hoạt động' : 'Tạm nghỉ'}
            </span>
          </div>
          <h3 className="doc-name">{doctor.doctorName || doctor.name || doctor.fullName}</h3>
          <p className="doc-spec">{doctor.specialtyName || doctor.specialty || doctor.specialization}</p>
          
          <div className="meta-row">
            <span className="meta-badge">
              <svg className="badge-star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
              {Number(rating).toFixed(1)}
            </span>
            <span className="meta-badge">
              <svg className="badge-exp" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              {exp} năm
            </span>
            <span className="meta-badge">
              <svg className="badge-fee" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              {fee.toLocaleString()}đ
            </span>
          </div>
          
          <button className="book-btn">Đặt lịch hẹn</button>
        </div>
      </div>
    </>
  );
}