import { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import { patientService } from '../services/patientService';
import { useAuth } from '../context/AuthContext';

const css = `
.booking-slots { margin-bottom: 52px; background: #fff; padding: 32px; border-radius: 24px; box-shadow: 0 10px 40px rgba(99,102,241,0.05); border: 1px solid #eef2ff; }
.booking-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 24px; letter-spacing: -0.02em; }
.day-row { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 28px; scrollbar-width: none; }
.day-row::-webkit-scrollbar { display: none; }
.day-btn {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 80px; height: 110px; border-radius: 24px; border: 1.5px solid #e2e8f0;
  background: #f8fafc; cursor: pointer; gap: 6px; flex-shrink: 0; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none; color: #475569; font-family: inherit;
}
.day-btn:hover:not(.day-btn--active) { border-color: #a5b4fc; background: #eef2ff; transform: translateY(-4px); }
.day-btn--active { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-color: transparent; color: #fff; box-shadow: 0 12px 24px rgba(99,102,241,0.3); transform: translateY(-4px); }
.day-name { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9; }
.day-num { font-size: 22px; font-weight: 800; line-height: 1; }

.slot-section-title { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 16px; }
.slot-row { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
.slot-empty { font-size: 14px; color: #64748b; font-style: italic; background: #f8fafc; padding: 16px 24px; border-radius: 12px; width: 100%; text-align: center; }
.slot-btn { 
  padding: 12px 24px; border-radius: 12px; border: 1.5px solid #e2e8f0; 
  background: #fff; font-size: 15px; font-weight: 600; color: #475569; 
  cursor: pointer; transition: all 0.2s; outline: none; font-family: inherit;
}
.slot-btn:hover:not(.slot-btn--booked):not(.slot-btn--active) { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
.slot-btn--active { background: #6366f1; border-color: #6366f1; color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.25); }
.slot-btn--booked { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; border-color: #e2e8f0; opacity: 0.7; }

.booking-form { background: #f8fafc; border-radius: 16px; padding: 24px; margin-bottom: 28px; border: 1px solid #eef2ff; }
.booking-form label { display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px; }
.booking-form select, .booking-form textarea { 
  width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #cbd5e1; 
  margin-bottom: 20px; font-size: 15px; box-sizing: border-box; font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s; background: #fff;
}
.booking-form select:focus, .booking-form textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); outline: none; }
.booking-form textarea { min-height: 100px; resize: vertical; }

.book-appt-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 14px;
  padding: 16px 40px; font-size: 16px; font-weight: 700; cursor: pointer;
  transition: all 0.25s; width: 100%;
  box-shadow: 0 8px 24px rgba(99,102,241,0.25); outline: none; font-family: inherit;
}
.book-appt-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.35); }
.book-appt-btn:active:not(:disabled) { transform: translateY(0); box-shadow: 0 4px 12px rgba(99,102,241,0.2); }
.book-appt-btn:disabled { background: #cbd5e1; color: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }

@media (max-width: 768px) {
  .booking-slots { padding: 24px 20px; border-radius: 20px; }
  .day-btn { width: 70px; height: 96px; border-radius: 20px; }
  .day-name { font-size: 12px; }
  .day-num { font-size: 18px; }
  .slot-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .slot-btn { width: 100%; padding: 10px 0; text-align: center; font-size: 14px; }
}
@media (max-width: 480px) {
  .slot-row { grid-template-columns: repeat(2, 1fr); }
}
`;

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function toDateParam(date) {
  return date.toISOString().split('T')[0];
}

function formatTimeSlot(slot) {
  const time = slot.timeSlot || slot.startTime || slot.time || '';
  return time.replace('SLOT_', '').replace('_', ':').slice(0, 5);
}

export default function BookingSlots({ docId, onBook }) {
  const days = getNext7Days();
  const [selectedDay, setSelectedDay] = useState(0);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [relatives, setRelatives] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('self');
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load relatives
  useEffect(() => {
    if (isAuthenticated() && user?.role === 'PATIENT') {
      patientService.getRelatives()
        .then(data => setRelatives(Array.isArray(data) ? data : []))
        .catch(() => setRelatives([]));
    }
  }, [user]);

  // Load slots
  useEffect(() => {
    if (!docId) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    doctorService
      .getAvailableSlots(docId, toDateParam(days[selectedDay]))
      .then(data => { 
        const availableSlots = (Array.isArray(data) ? data : []).filter(s => 
          s.status === 'AVAILABLE' || !s.isBooked
        );
        setSlots(availableSlots); 
        setLoadingSlots(false); 
      })
      .catch(() => { setSlots([]); setLoadingSlots(false); });
  }, [docId, selectedDay]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do khám');
      return;
    }
    
    setBooking(true);
    const relativeId = selectedPatient === 'self' ? null : selectedPatient;
    
    try {
      await onBook({
        scheduleId: selectedSlot.scheduleId || selectedSlot.id,
        relativeId,
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
        <h3 className="booking-title">Chọn ngày & giờ khám</h3>

        <div className="day-row">
          {days.map((d, i) => (
            <button
              key={i}
              className={`day-btn${selectedDay === i ? ' day-btn--active' : ''}`}
              onClick={() => setSelectedDay(i)}
            >
              <span className="day-name">{DAYS[d.getDay()]}</span>
              <span className="day-num">{d.getDate()}</span>
            </button>
          ))}
        </div>

        <div className="slot-row">
          {loadingSlots ? (
            <span className="slot-empty">Đang tải...</span>
          ) : slots.length === 0 ? (
            <span className="slot-empty">Không có khung giờ khả dụng cho ngày này.</span>
          ) : (
            slots.map(slot => (
              <button
                key={slot.scheduleId || slot.id}
                onClick={() => setSelectedSlot(slot)}
                disabled={slot.isBooked || slot.status === 'BOOKED'}
                className={`slot-btn${selectedSlot?.scheduleId === slot.scheduleId || selectedSlot?.id === slot.id ? ' slot-btn--active' : ''}${slot.isBooked || slot.status === 'BOOKED' ? ' slot-btn--booked' : ''}`}
              >
                {formatTimeSlot(slot)}
              </button>
            ))
          )}
        </div>

        {selectedSlot && isAuthenticated() && (
          <div className="booking-form">
            {relatives.length > 0 && (
              <div>
                <label>Đặt lịch cho</label>
                <select 
                  value={selectedPatient} 
                  onChange={e => setSelectedPatient(e.target.value)}
                >
                  <option value="self">Bản thân ({user?.fullName})</option>
                  {relatives.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.fullName} ({r.relationship || 'Người thân'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label>Lý do khám <span style={{color:'#ef4444'}}>*</span></label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Mô tả triệu chứng hoặc lý do khám..."
              />
            </div>
          </div>
        )}

        <button 
          className="book-appt-btn" 
          onClick={handleBook}
          disabled={!selectedSlot || booking}
        >
          {booking ? 'Đang đặt lịch...' : 'Đặt lịch hẹn'}
        </button>
      </div>
    </>
  );
}