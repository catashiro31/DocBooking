import { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';

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
    <div className="booking-slots">
      <h3 className="booking-title">Booking slots</h3>

      {/* Day selector */}
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

      {/* Time slots */}
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

      {/* Book button */}
      <button
        className="book-appt-btn"
        onClick={() => onBook(selectedSlot)}
      >
        Book an Appointment
      </button>
    </div>
  );
}