import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { doctorService } from '../services/doctorService';
import { patientService } from '../services/patientService';
import { useAuth } from '../context/AuthContext';
import { formatLocalDate } from '../utils/dateUtils';

const css = `
.booking-slots { margin-bottom: 52px; background: #fff; padding: 28px; border-radius: 24px; box-shadow: 0 10px 40px rgba(99,102,241,0.05); border: 1px solid #eef2ff; }
.booking-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 20px; letter-spacing: -0.02em; }

.week-tabs { display: flex; gap: 8px; margin-bottom: 24px; background: #f1f5f9; padding: 4px; border-radius: 14px; width: fit-content; }
.week-tab-btn { 
  padding: 8px 16px; border-radius: 10px; border: none; background: transparent; 
  cursor: pointer; font-size: 13px; font-weight: 700; color: #64748b; transition: all 0.2s;
}
.week-tab-btn--active { background: #fff; color: #6366f1; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

.day-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-bottom: 28px; }
.day-btn {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 12px 4px; border-radius: 16px; border: 1.5px solid #e2e8f0;
  background: #f8fafc; cursor: pointer; gap: 4px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none; color: #475569; font-family: inherit;
}
.day-btn:hover:not(.day-btn--active) { border-color: #6366f1; background: #eef2ff; }
.day-btn--active { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-color: transparent; color: #fff; box-shadow: 0 8px 16px rgba(99,102,241,0.2); transform: translateY(-2px); }
.day-name { font-size: 11px; font-weight: 700; text-transform: uppercase; opacity: 0.8; }
.day-num { font-size: 15px; font-weight: 800; }

.slot-section-title { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }
.slot-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 28px; }
.slot-empty { font-size: 13px; color: #64748b; font-style: italic; background: #f8fafc; padding: 20px; border-radius: 16px; grid-column: 1 / -1; text-align: center; border: 1px dashed #e2e8f0; }
.slot-btn { 
  padding: 10px; border-radius: 10px; border: 1.5px solid #e2e8f0; 
  background: #fff; font-size: 14px; font-weight: 700; color: #475569; 
  cursor: pointer; transition: all 0.2s; outline: none; font-family: inherit;
}
.slot-btn:hover:not(.slot-btn--booked):not(.slot-btn--active) { border-color: #6366f1; color: #6366f1; }
.slot-btn--active { background: #6366f1; border-color: #6366f1; color: #fff; }
.slot-btn--booked { background: #f1f5f9; color: #cbd5e1; cursor: not-allowed; border-color: #e2e8f0; }

.booking-form { background: #f8fafc; border-radius: 20px; padding: 24px; margin-bottom: 24px; border: 1px solid #eef2ff; }
.booking-form label { display: block; margin-bottom: 10px; font-weight: 700; color: #1e293b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
.booking-form select, .booking-form textarea { 
  width: 100%; padding: 14px; border-radius: 14px; border: 1.5px solid #e2e8f0; 
  margin-bottom: 20px; font-size: 15px; box-sizing: border-box; font-family: inherit;
  transition: all 0.2s; background: #fff; outline: none;
}
.booking-form select:focus, .booking-form textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.08); }
.booking-form textarea { min-height: 110px; resize: none; margin-bottom: 0; }

.book-appt-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 16px;
  padding: 18px; font-size: 16px; font-weight: 700; cursor: pointer;
  transition: all 0.3s; width: 100%;
  box-shadow: 0 10px 20px rgba(99,102,241,0.2); outline: none; font-family: inherit;
}
.book-appt-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(99,102,241,0.3); }
.book-appt-btn:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }

@media (max-width: 640px) {
  .day-grid { grid-template-columns: repeat(4, 1fr); }
  .slot-grid { grid-template-columns: repeat(3, 1fr); }
}
`;

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function getNext14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function toDateParam(date) {
  return formatLocalDate(date);
}

function formatTimeSlot(slot) {
  const time = slot.timeSlot || slot.startTime || slot.time || '';
  return time.replace('SLOT_', '').replace('_', ':').slice(0, 5);
}

export default function BookingSlots({ docId, onBook }) {
  const allDays = getNext14Days();
  const [week, setWeek] = useState(0); // 0 or 1
  const [selectedDayIdx, setSelectedDayIdx] = useState(0); // 0 to 13
  
  const currentWeekDays = allDays.slice(week * 7, (week + 1) * 7);

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [relatives, setRelatives] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('self');
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated() && user?.role === 'PATIENT') {
      patientService.getRelatives()
        .then(data => {
          const rels = Array.isArray(data) ? data : [];
          setRelatives(rels);
          const selfRel = rels.find(r => r.relationship === 'SELF' || r.relationship === 'Bản thân');
          if (selfRel) setSelectedPatient(selfRel.patientId || selfRel.id);
        })
        .catch(() => setRelatives([]));
    }
  }, [user]);

  useEffect(() => {
    if (!docId) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    doctorService
      .getAvailableSlots(docId, toDateParam(allDays[selectedDayIdx]))
      .then(data => { 
        const availableSlots = (Array.isArray(data) ? data : []).filter(s => 
          s.status === 'AVAILABLE' || !s.isBooked
        );
        setSlots(availableSlots); 
        setLoadingSlots(false); 
      })
      .catch(() => { setSlots([]); setLoadingSlots(false); });
  }, [docId, selectedDayIdx]);

    const handleBook = async () => {
    if (!selectedSlot) return;
    
    if (!isAuthenticated()) {
      await onBook({ scheduleId: selectedSlot.scheduleId || selectedSlot.id });
      return;
    }

    if (!reason.trim()) {
      toast.warning('Vui lòng nhập lý do khám');
      return;
    }
    
    setBooking(true);
    try {
      await onBook({
        scheduleId: selectedSlot.scheduleId || selectedSlot.id,
        patientId: selectedPatient, 
        reason: reason.trim()
      });
    } finally {
      setBooking(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="booking-slots">
        <h3 className="booking-title">Lịch khám của bác sĩ</h3>

        <div className="week-tabs">
          <button className={`week-tab-btn ${week === 0 ? 'week-tab-btn--active' : ''}`} onClick={() => { setWeek(0); setSelectedDayIdx(week * 7); }}>Tuần này</button>
          <button className={`week-tab-btn ${week === 1 ? 'week-tab-btn--active' : ''}`} onClick={() => { setWeek(1); setSelectedDayIdx(week * 7); }}>Tuần sau</button>
        </div>

        <div className="day-grid">
          {currentWeekDays.map((d, i) => {
            const absoluteIdx = week * 7 + i;
            return (
              <button
                key={absoluteIdx}
                className={`day-btn${selectedDayIdx === absoluteIdx ? ' day-btn--active' : ''}`}
                onClick={() => setSelectedDayIdx(absoluteIdx)}
              >
                <span className="day-name">{DAYS[d.getDay()]}</span>
                <span className="day-num">{d.getDate()}/{d.getMonth() + 1}</span>
              </button>
            );
          })}
        </div>

        <div className="slot-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Giờ khám khả dụng
        </div>

        <div className="slot-grid">
          {loadingSlots ? (
            <span className="slot-empty">Đang tìm các khung giờ trống...</span>
          ) : slots.length === 0 ? (
            <span className="slot-empty">Hiện không có khung giờ nào khả dụng.</span>
          ) : (
            slots.map(slot => (
              <button
                key={slot.scheduleId || slot.id}
                onClick={() => setSelectedSlot(slot)}
                disabled={slot.isBooked || slot.status === 'BOOKED'}
                className={`slot-btn${selectedSlot === slot ? ' slot-btn--active' : ''}${(slot.isBooked || slot.status === 'BOOKED') ? ' slot-btn--booked' : ''}`}
              >
                {formatTimeSlot(slot)}
              </button>
            ))
          )}
        </div>

        {selectedSlot && (
          <div className="booking-form">
            {!isAuthenticated() ? (
              <p style={{ color: '#6366f1', margin: 0, fontSize: '14px', fontWeight: 700, textAlign: 'center' }}>
                👉 Đăng nhập để chọn hồ sơ và nhập lý do khám
              </p>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label>Bệnh nhân</label>
                  <select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                    <option value="">-- Chọn hồ sơ --</option>
                    {relatives.map(r => (
                      <option key={r.patientId || r.id} value={r.patientId || r.id}>
                        {r.fullName} ({r.relationship === 'SELF' ? 'Bản thân' : r.relationship})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Lý do khám *</label>
                  <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Nhập triệu chứng của bạn..." />
                </div>
              </>
            )}
          </div>
        )}

        <button className="book-appt-btn" onClick={handleBook} disabled={!selectedSlot || booking}>
          {booking ? 'Đang xử lý...' : (!isAuthenticated() ? 'Tiếp tục đăng nhập' : 'Xác nhận đặt lịch')}
        </button>
      </div>
    </>
  );
}