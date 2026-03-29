import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import admin1 from "../images/admin_board1.png";
import admin2 from "../images/admin_board2.png";
import admin3 from "../images/admin_board3.png";
import icon from "../images/admin_icon.png";

function Dashboard() {
  const [stats, setStats] = useState({ totalDoctors: 0, totalAppointments: 0, totalPatients: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      adminService.getAppointments({ size: 5 })
    ])
      .then(([statsData, appointmentsData]) => {
        setStats(statsData || { totalDoctors: 0, totalAppointments: 0, totalPatients: 0 });
        const list = appointmentsData.content || appointmentsData || [];
        setBookings(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  }, []);

  const handleCancel = (id) => {
    setBookings((prev) =>
      prev.map((item) => item.id === id ? { ...item, status: "CANCELLED" } : item)
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');
        .dash-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.07) !important; }
        .booking-item-row:hover { background: #fafbfc !important; }
        .cancel-btn:hover { background: #fee2e2 !important; border-color: #f87171 !important; }
        @media (max-width: 768px) { .dash-cards { flex-direction: column !important; } }
      `}</style>

      <div style={{ width: '100%', padding: '28px', background: '#f8f9fb', minHeight: '100vh', fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box' }}>

        {/* ===== TOP CARDS ===== */}
        <div className="dash-cards" style={{ display: 'flex', gap: '18px', marginBottom: '26px' }}>

          {[
            { img: admin1, number: stats.totalDoctors || 0,  label: 'Bác sĩ' },
            { img: admin2, number: stats.totalAppointments || 0, label: 'Lịch hẹn' },
            { img: admin3, number: stats.totalPatients || 0,  label: 'Bệnh nhân' },
          ].map((c) => (
            <div
              key={c.label}
              className="dash-card"
              style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px', background: '#ffffff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #ececf0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', transition: 'box-shadow 0.25s ease, transform 0.25s ease', cursor: 'default' }}
            >
              <img src={c.img} alt="" style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '10px', background: '#f3f4f8', padding: '8px' }} />
              <div>
                <p style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', margin: '0 0 2px' }}>{c.number}</p>
                <p style={{ color: '#9ca3af', fontSize: '12.5px', fontWeight: 500, margin: 0 }}>{c.label}</p>
              </div>
            </div>
          ))}

        </div>

        {/* ===== BOOKING CARD ===== */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #ececf0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', borderBottom: '1px solid #f2f3f7' }}>
            <img src={icon} alt="" style={{ width: '20px', height: '20px', opacity: 0.6 }} />
            <p style={{ fontWeight: 800, fontSize: '18px', color: '#374151', margin: 0 }}>Đặt chỗ mới nhất</p>
          </div>

          <div style={{ padding: '4px 0' }}>
            {bookings.map((item) => (
              <div
                key={item.id}
                className="booking-item-row"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #f7f8fa', transition: 'background 0.15s ease' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold' }}>
                    {item.patientName ? item.patientName.charAt(0) : 'U'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '13.5px', color: '#595c60', margin: '0 0 2px' }}>{item.patientName || 'BN'}</p>
                    <p style={{ fontSize: '12px', color: '#b0b7c3', margin: 0 }}>
                      BS: {item.doctorName || 'Chưa xếp'} | {new Date(item.appointmentDate || item.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div>
                  {item.status?.toLowerCase() === "cancelled" ? (
                    <span style={{ color: '#f87171', fontWeight: 600, fontSize: '12px', background: '#fff5f5', padding: '4px 10px', borderRadius: '20px', border: '1px solid #fecaca' }}>
                      Đã hủy
                    </span>
                  ) : (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(item.id)}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #fca5a5', background: '#fff5f5', color: '#f87171', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', lineHeight: 1 }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;