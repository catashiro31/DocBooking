import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";

function AppointmentsAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    adminService.getAppointments({ size: 100 })
      .then((res) => {
        const list = res.content || res || [];
        setData(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Error loading appointments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: { color: '#fbbf24', bg: '#fffbeb', border: '#fef3c7', text: 'Chờ xử lý' },
      CONFIRMED: { color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe', text: 'Đã xác nhận' },
      COMPLETED: { color: '#10b981', bg: '#f0fdf4', border: '#dcfce7', text: 'Hoàn thành' },
      CANCELLED: { color: '#ef4444', bg: '#fef2f2', border: '#fee2e2', text: 'Đã hủy' },
      NO_SHOW: { color: '#6b7280', bg: '#f9fafb', border: '#f3f4f6', text: 'Vắng mặt' }
    };

    const s = styles[status] || { color: '#6b7280', bg: '#f3f4f6', border: '#e5e7eb', text: status };

    return (
      <span style={{
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: 700,
        fontSize: '12px',
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }}>
        {s.text}
      </span>
    );
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '50px 1.5fr 1.5fr 2fr 1.2fr 1.2fr 1fr',
    alignItems: 'center',
    padding: '16px 20px',
    gap: '15px'
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải danh sách...</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .appt-container { font-family: 'Inter', sans-serif; }
        .appt-row:hover { background: #f9fafb !important; }
        .text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      `}</style>

      <div className="appt-container" style={{ padding: '30px', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Quản lý Lịch hẹn</h2>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>Theo dõi và quản lý tất cả các lượt đặt chỗ trên hệ thống</p>
          </div>
          <button 
            onClick={fetchAppointments}
            style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
          >
            Làm mới
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {/* HEADER */}
          <div style={{ ...gridStyle, background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <p style={{ margin: 0 }}>#</p>
            <p style={{ margin: 0 }}>Bệnh nhân</p>
            <p style={{ margin: 0 }}>Bác sĩ</p>
            <p style={{ margin: 0 }}>Chuyên khoa / Cơ sở</p>
            <p style={{ margin: 0 }}>Thời gian</p>
            <p style={{ margin: 0 }}>Trạng thái</p>
            <p style={{ margin: 0 }}>Lý do</p>
          </div>

          {/* ROWS */}
          {data.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Chưa có dữ liệu lịch hẹn</div>
          ) : (
            data.map((item, index) => (
              <div
                key={item.appointmentId}
                className="appt-row"
                style={{
                  ...gridStyle,
                  background: '#ffffff',
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.2s ease'
                }}
              >
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{index + 1}</p>

                <div className="text-truncate">
                  <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{item.patientName}</p>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '12px' }}>{item.patientPhone}</p>
                </div>

                <div className="text-truncate">
                  <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>BS. {item.doctorName}</p>
                </div>

                <div className="text-truncate">
                  <p style={{ margin: 0, color: '#334155', fontSize: '13px', fontWeight: 500 }}>{item.specialtyName}</p>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '12px' }}>{item.facilityName}</p>
                </div>

                <div>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{item.timeSlot}</p>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '12px' }}>{item.dateWorking}</p>
                </div>

                <div>{getStatusBadge(item.bookingStatus)}</div>

                <div className="text-truncate" title={item.reason}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px italic' }}>{item.reason || 'Không có lý do'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default AppointmentsAdmin;