import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, appointmentsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAppointments({ size: 8 }) // Fetch 8 recent ones
      ]);
      
      setStats(statsData);
      const list = appointmentsData?.content || appointmentsData || [];
      setRecentBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      'PENDING': { bg: '#fff7ed', text: '#ea580c', label: 'Chờ duyệt' },
      'CONFIRMED': { bg: '#eff6ff', text: '#2563eb', label: 'Xác nhận' },
      'COMPLETED': { bg: '#f0fdf4', text: '#16a34a', label: 'Hoàn thành' },
      'CANCELLED': { bg: '#fef2f2', text: '#dc2626', label: 'Đã hủy' },
      'NO_SHOW': { bg: '#f8fafc', text: '#64748b', label: 'Vắng mặt' }
    };
    return styles[status] || styles['PENDING'];
  };

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #ffffff;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.1);
          border-color: #e2e8f0;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-info .label {
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-info .value {
          font-size: 28px;
          font-weight: 800;
          color: #1e293b;
        }

        .dashboard-main {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .content-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .card-header {
          padding: 24px 32px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .view-all-btn {
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
          background: #eef2ff;
          padding: 6px 12px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: #6366f1;
          color: #ffffff;
        }

        .booking-table {
          width: 100%;
          border-collapse: collapse;
        }

        .booking-table th {
          text-align: left;
          padding: 16px 32px;
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #f8fafc;
        }

        .booking-table td {
          padding: 18px 32px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }

        .booking-table tr:last-child td {
          border-bottom: none;
        }

        .booking-table tr:hover {
          background: #f8fafc;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        .admin-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .activity-item {
          padding: 16px 24px;
          display: flex;
          gap: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .activity-details p {
          margin: 0;
          font-size: 14px;
          color: #1e293b;
          line-height: 1.5;
        }

        .activity-time {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }
      `}</style>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>👨‍⚕️</div>
          <div className="stat-info">
            <div className="label">Tổng bác sĩ</div>
            <div className="value">{stats?.totalDoctors || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>📅</div>
          <div className="stat-info">
            <div className="label">Tổng lịch hẹn</div>
            <div className="value">{stats?.totalAppointments || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff7ed', color: '#f59e0b' }}>👥</div>
          <div className="stat-info">
            <div className="label">Bệnh nhân</div>
            <div className="value">{stats?.totalPatients || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>⭐</div>
          <div className="stat-info">
            <div className="label">Đánh giá mới</div>
            <div className="value">{stats?.totalReviews || 0}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Recent Bookings */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Lịch hẹn gần đây</h3>
            <button onClick={() => navigate('/admin/appointment')} className="view-all-btn">Xem tất cả</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Bệnh nhân</th>
                  <th>Chuyên khoa</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                      Chưa có lịch hẹn nào
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((apt) => (
                    <tr key={apt.appointmentId || apt.id}>
                      <td style={{ fontWeight: 600 }}>{apt.patientName || 'N/A'}</td>
                      <td>
                        <span style={{ color: '#6366f1', fontWeight: 600 }}>{apt.specialtyName || 'Tổng quát'}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{apt.dateWorking}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{apt.timeSlot}</div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ 
                            background: getStatusStyle(apt.bookingStatus).bg, 
                            color: getStatusStyle(apt.bookingStatus).text 
                          }}
                        >
                          {getStatusStyle(apt.bookingStatus).label}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Quick Stats */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Hoạt động hệ thống</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">⏳</div>
              <div className="activity-details">
                <p>Có <strong>{stats?.pendingDoctors || 0} bác sĩ</strong> đang chờ phê duyệt hồ sơ.</p>
                <div className="activity-time" onClick={() => navigate('/admin/pending-doctors')} style={{ cursor: 'pointer', color: '#6366f1', fontWeight: 600 }}>Xử lý ngay →</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📈</div>
              <div className="activity-details">
                <p>Hôm nay có <strong>{stats?.todayAppointments || 0} lượt đặt lịch</strong> mới.</p>
                <div className="activity-time">Đang cập nhật...</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">👥</div>
              <div className="activity-details">
                <p>Tổng số người dùng đã đăng ký: <strong>{stats?.totalUsers || 0}</strong></p>
                <div className="activity-time">Cập nhật theo thời gian thực</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;