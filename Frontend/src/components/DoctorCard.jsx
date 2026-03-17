import React from 'react';
import '../styles/DoctorCard.css'; 

export default function DoctorCard({ doctor }) {
  return (
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
          <span
            className="dot"
            style={{ background: doctor.available ? '#22c55e' : '#94a3b8' }}
          />
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
        <button className="book-btn">Book Appointment</button>
      </div>
    </div>
  );
}