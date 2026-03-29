import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";

function DoctorsListAdmin() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [detailModal, setDetailModal] = useState({ show: false, data: null, loading: false });

  const size = 10;

  useEffect(() => {
    fetchDoctors(page);
  }, [page]);

  const fetchDoctors = async (pageNumber) => {
    try {
      setLoading(true);
      const data = await adminService.getAllDoctors(pageNumber, size);
      setDoctors(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (doctorId) => {
    try {
      setDetailModal({ show: true, data: null, loading: true });
      const data = await adminService.getDoctorDetail(doctorId);
      setDetailModal({ show: true, data, loading: false });
    } catch (err) {
      toast.error("Không thể tải chi tiết hồ sơ");
      setDetailModal({ show: false, data: null, loading: false });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      APPROVED: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', label: 'Đã duyệt' },
      PENDING: { bg: '#fefce8', text: '#ca8a04', border: '#fef08a', label: 'Chờ duyệt' },
      REJECTED: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Từ chối' },
      BLOCKED: { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb', label: 'Bị khóa' }
    };
    const s = styles[status] || styles.PENDING;
    return (
      <span style={{ 
        display: 'inline-block', fontSize: '12px', fontWeight: 700, 
        color: s.text, background: s.bg, border: `1px solid ${s.border}`, 
        padding: '2px 10px', borderRadius: '20px' 
      }}>
        {s.label}
      </span>
    );
  };

  return (
    <>
      <style>{`
        .dl-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
        .dl-btn-page { padding: 8px 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; transition: all 0.2s; }
        .dl-btn-page:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; }
        .dl-btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{ padding: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>Tất cả bác sĩ</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Quản lý danh sách toàn bộ bác sĩ trong hệ thống</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
          ) : doctors.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Chưa có bác sĩ nào.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>BÁC SĨ</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>CHUYÊN KHOA / CƠ SỞ</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>LIÊN HỆ</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>TRẠNG THÁI</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.doctorId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {doc.user?.avatarUrl ? <img src={doc.user.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👨‍⚕️'}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>{doc.user?.fullName}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{doc.degree}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>{doc.specialty?.specialtyName}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{doc.facility?.facilityName}</p>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>{doc.user?.email}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{doc.user?.phoneNumber}</p>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {getStatusBadge(doc.verificationStatus)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleViewDetail(doc.doctorId)}
                        style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #5f6dfc', background: 'transparent', color: '#5f6dfc', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '24px' }}>
            <button 
              className="dl-btn-page" 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ← Trước
            </button>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Trang <strong>{page + 1}</strong> / {totalPages}</span>
            <button 
              className="dl-btn-page" 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Sau →
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailModal.show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px'
        }} onClick={() => setDetailModal({ show: false, data: null, loading: false })}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '30px'
          }} onClick={e => e.stopPropagation()}>
            {detailModal.loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải chi tiết...</div>
            ) : detailModal.data && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                  <h2 style={{ margin: 0, fontSize: '22px' }}>Chi tiết Hồ sơ Bác sĩ</h2>
                  <button onClick={() => setDetailModal({ show: false, data: null, loading: false })} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ margin: '0 0 10px', color: '#64748b', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Thông tin cá nhân</h4>
                      <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Họ tên:</strong> {detailModal.data.user?.fullName}</p>
                      <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Email:</strong> {detailModal.data.user?.email}</p>
                      <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>SĐT:</strong> {detailModal.data.user?.phoneNumber}</p>
                      <p style={{ margin: '8px 0', fontSize: '14px' }}>Trạng thái: {getStatusBadge(detailModal.data.verificationStatus)}</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ margin: '0 0 10px', color: '#64748b', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Chuyên môn & Công tác</h4>
                      <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Bằng cấp:</strong> {detailModal.data.degree}</p>
                      <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Kinh nghiệm:</strong> {detailModal.data.experienceYears} năm</p>
                      <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Chuyên khoa:</strong> {detailModal.data.specialty?.specialtyName}</p>
                      <p style={{ margin: '4px 0', fontSize: '15px' }}><strong>Cơ sở:</strong> {detailModal.data.facility?.facilityName}</p>
                    </div>

                    <div>
                      <h4 style={{ margin: '0 0 10px', color: '#64748b', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Tiểu sử</h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: 1.6, background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                        {detailModal.data.bio || "Chưa có tiểu sử"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 10px', color: '#64748b', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Tài liệu xác minh</h4>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600 }}>Ảnh CCCD / Hộ chiếu:</p>
                      {detailModal.data.idCardUrl ? (
                        <img src={detailModal.data.idCardUrl} alt="CCCD" style={{ width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      ) : <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '8px', textAlign: 'center', fontSize: '12px' }}>Không có ảnh</div>}
                    </div>

                    <div>
                      <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600 }}>Chứng chỉ hành nghề:</p>
                      {detailModal.data.certificateUrl ? (
                        <img src={detailModal.data.certificateUrl} alt="Chứng chỉ" style={{ width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      ) : <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '8px', textAlign: 'center', fontSize: '12px' }}>Không có ảnh</div>}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DoctorsListAdmin;