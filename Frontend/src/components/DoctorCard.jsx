import React from 'react';
import { useNavigate } from 'react-router-dom';

const css = `
.card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
.avatar-wrap { background: none; display: flex; align-items: flex-end; justify-content: center; height: 160px; overflow: hidden; }
.avatar { height: 150px; width: 100%; object-fit: cover; object-position: top; }
.card-body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 4px; }
.avail-badge { display: flex; align-items: center; gap: 5px; margin-bottom: 2px; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.doc-name { margin: 0; font-size: 15px; font-weight: 700; color: #0f172a; line-height: 1.3; }
.doc-spec { margin: 0; font-size: 13px; color: #64748b; }
.meta-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
.meta-badge { font-size: 11px; padding: 3px 8px; background: #f1f5f9; border-radius: 6px; color: #475569; font-weight: 500; }
.book-btn { margin-top: 10px; background: #2563eb; color: #fff; border: none; border-radius: 9px; padding: 9px 0; font-size: 13px; font-weight: 600; cursor: pointer; width: 100%; transition: transform 0.2s, box-shadow 0.2s; }
.book-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(37,99,235,0.4); }
.book-btn:active { transform: translateY(0); box-shadow: none; }
`;

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  return (
    <>
      <style>{css}</style>
      <div className="card">
        <div className="avatar-wrap">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="avatar"
            onError={e => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=dbeafe&color=1e40af&size=160`;
            }}
          />
        </div>
        <div className="card-body">
          <div className="avail-badge">
            <span className="dot" style={{ background: doctor.available ? '#22c55e' : '#94a3b8' }} />
            <span style={{ color: doctor.available ? '#16a34a' : '#64748b', fontSize: 13, fontWeight: 600 }}>
              {doctor.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <h3 className="doc-name">{doctor.name}</h3>
          <p className="doc-spec">{doctor.specialty}</p>
          <div className="meta-row">
            <span className="meta-badge">🎓 {doctor.experience} yrs</span>
            <span className="meta-badge">💰 ₹{doctor.fee}</span>
          </div>
          <button className="book-btn" onClick={() => navigate(`/appointment/${doctor.id}`)}>Đặt lịch hẹn</button>
        </div>
      </div>
    </>
  );
}