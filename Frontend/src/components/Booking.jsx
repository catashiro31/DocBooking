import { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';

const css = `
.booking-slots { margin-bottom: 52px; }
.booking-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 20px; }
.day-row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 20px; scrollbar-width: none; }
.day-row::-webkit-scrollbar { display: none; }
.day-btn {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 72px; height: 100px; border-radius: 50px; border: 1.5px solid #e5e7eb;
  background: #fff; cursor: pointer; gap: 2px; flex-shrink: 0; transition: all 0.18s;
  outline: none; color: #374151;
}
.day-btn:hover:not(.day-btn--active) { border-color: #4361EE; color: #4361EE; }
.day-btn--active { background: #4361EE; border-color: #4361EE; color: #fff; box-shadow: 0 4px 16px rgba(67,97,238,0.3); }
.day-name { font-size: 12px; font-weight: 600; letter-spacing: 0.5px; }
.day-num { font-size: 18px; font-weight: 700; }
.slot-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
.slot-empty { font-size: 14px; color: #9ca3af; font-style: italic; }
.slot-btn { padding: 8px 18px; border-radius: 24px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 16px; font-weight: 500; color: #7a7f87; cursor: pointer; transition: all 0.18s; outline: none; }
.slot-btn:hover:not(.slot-btn--booked):not(.slot-btn--active) { border-color: #4361EE; color: #4361EE; }
.slot-btn--active { background: #4361EE; border-color: #4361EE; color: #fff; }
.slot-btn--booked { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; text-decoration: line-through; }
.book-appt-btn {
  background: #4361EE; color: #fff; border: none; border-radius: 30px;
  padding: 14px 44px; font-size: 16px; font-weight: 600; cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  box-shadow: 0 4px 18px rgba(67,97,238,0.25); outline: none;
}
.book-appt-btn:hover { background: #3451d1; transform: translateY(-1px); }
.book-appt-btn:active { transform: translateY(0); }

@media (max-width: 700px) {
  .day-btn { width: 60px; height: 90px; }
  .day-name { font-size: 11px; }
  .day-num { font-size: 16px; }
  .slot-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .slot-btn { width: 100%; padding: 10px 0; text-align: center; justify-content: center; }
}
`;

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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

export default function BookingSlots({ docId, onBook }) {
  const days = getNext7Days();
  const [selectedDay, setSelectedDay] = useState(0);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!docId) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    doctorService
      .getAvailableSlots(docId, toDateParam(days[selectedDay]))
      .then(data => { setSlots(data); setLoadingSlots(false); })
      .catch(() => { setSlots([]); setLoadingSlots(false); });
  }, [docId, selectedDay]);

  return (
    <>
      <style>{css}</style>
      <div className="booking-slots">
        <h3 className="booking-title">Các vị trí đặt chỗ</h3>

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
            <span className="slot-empty">Không có khung giờ khả dụng.</span>
          ) : (
            slots.map(slot => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={`slot-btn${selectedSlot?.id === slot.id ? ' slot-btn--active' : ''}`}
              >
                {(slot.startTime ?? slot.time ?? '').slice(0, 5)}
              </button>
            ))
          )}
        </div>

        <button className="book-appt-btn" onClick={() => onBook(selectedSlot)}>
          Đặt lịch hẹn
        </button>
      </div>
    </>
  );
}