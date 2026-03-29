import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import ic from "../images/icon_Appointment.png";

function AppointmentsAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAppointments()
      .then((res) => {
        const list = res.content || res || [];
        setData(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading appointments:", err);
        setLoading(false);
      });
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case "Hoàn thành": return { color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', display: 'inline-block' };
      case "Chờ hủy":   return { color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', display: 'inline-block' };
      case "Đã hủy": return { color: '#dc2626', background: '#fff5f5', border: '1px solid #fecaca', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', display: 'inline-block' };
      default: return {};
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '40px 2fr 60px 2fr 2fr 80px 130px',
    alignItems: 'center',
    padding: '13px 20px',
    fontFamily: "'Nunito', sans-serif",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        .appt-row:hover { background: #f7f8ff !important; }
      `}</style>

      <div style={{ padding: '30px', background: '#f7f9fc' }}>

        <p style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', margin: '0 0 24px', fontFamily: "'Nunito', sans-serif" }}>
          Tất cả lịch hẹn
        </p>

        {/* HEADER */}
        <div style={{ ...gridStyle, background: 'linear-gradient(135deg, #5f6dfc, #7c8fff)', borderRadius: '14px 14px 0 0', fontWeight: 700, fontSize: '13.5px', letterSpacing: '0.4px' }}>
          {['#', 'Bệnh nhân', 'Tuổi', 'Ngày & Giờ', 'Bác sĩ', 'Phí', 'Hành động'].map((h) => (
            <p key={h} style={{ margin: 0, color: 'rgba(255,255,255,0.92)' }}>{h}</p>
          ))}
        </div>

        {/* ROWS */}
        {data.map((item, index) => (
          <div
            key={item.id}
            className="appt-row"
            style={{
              ...gridStyle,
              background: '#ffffff',
              borderLeft: '1px solid #e8eaf0',
              borderRight: '1px solid #e8eaf0',
              borderBottom: '1px solid #f0f2f8',
              transition: 'background 0.2s ease',
              ...(index === data.length - 1 ? { borderRadius: '0 0 14px 14px', borderBottom: '1px solid #e8eaf0' } : {})
            }}
          >
            <p style={{ margin: 0, fontSize: '14.5px', color: '#4a5568' }}>{index + 1}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={ic} alt="" style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #e8eaf0', objectFit: 'cover' }} />
              <p style={{ margin: 0, fontWeight: 600, color: '#1a202c', fontSize: '14.5px' }}>{item.name}</p>
            </div>

            <p style={{ margin: 0, fontSize: '14.5px', color: '#4a5568' }}>{item.age}</p>
            <p style={{ margin: 0, fontSize: '14.5px', color: '#4a5568' }}>{item.date} - {item.time}</p>
            <p style={{ margin: 0, fontSize: '14.5px', color: '#4a5568' }}>{item.doctor}</p>
            <p style={{ margin: 0, fontSize: '14.5px', color: '#4a5568' }}>₹{item.fee}</p>
            <span style={statusStyle(item.status)}>{item.status}</span>
          </div>
        ))}

      </div>
    </>
  );
}

export default AppointmentsAdmin;