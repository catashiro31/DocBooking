import { useNavigate } from 'react-router-dom';

const css = `
.related-section { text-align: center; padding-top: 16px; margin-bottom: 40px; }
.related-title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 10px; letter-spacing: -0.02em; }
.related-sub { font-size: 15px; color: #64748b; margin: 0 0 32px; }
.related-grid { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
.related-card { 
  width: 200px; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; 
  background: #fff; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  text-align: left; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; flex-direction: column;
}
.related-card:hover { 
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); 
  transform: translateY(-8px); border-color: #8b5cf6; 
}
.related-img-wrap { 
  background: linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%); 
  height: 180px; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; 
}
.related-img { width: 90%; height: 90%; object-fit: cover; object-position: top; transition: transform 0.3s ease; }
.related-card:hover .related-img { transform: scale(1.05); }
.related-body { padding: 16px; border-top: 1px solid #f1f5f9; flex: 1; display: flex; flex-direction: column; }
.related-name { font-size: 15px; font-weight: 700; color: #0f172a; margin: 4px 0 4px; line-height: 1.3; }
.related-spec { font-size: 13px; color: #64748b; margin: 0; }
.avail-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; align-self: flex-start; margin-bottom: 4px; }
.avail-badge.active { background: #d1fae5; color: #059669; }
.avail-badge.inactive { background: #f1f5f9; color: #64748b; }
.dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; flex-shrink: 0; }

@media (max-width: 700px) {
  .related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 0 16px; }
  .related-card { width: 100%; }
  .related-img-wrap { height: 160px; }
  .related-name { font-size: 14px; }
  .related-spec { font-size: 12px; }
}
`;

export default function RelatedDoctors({ doctors = [] }) {
  const navigate = useNavigate();
  if (doctors.length === 0) return null;

  return (
    <>
      <style>{css}</style>
      <section className="related-section">
        <h2 className="related-title">Bác sĩ liên quan</h2>
        <p className="related-sub">Danh sách các bác sĩ cùng chuyên khoa được đề xuất cho bạn.</p>
        <div className="related-grid">
          {doctors.map(d => (
            <div
              key={d.id}
              className="related-card"
              onClick={() => navigate(`/appointment/${d.id}`)}
            >
              <div className="related-img-wrap">
                <img
                  src={d.photo ?? d.avatarUrl ?? d.imageUrl}
                  alt={d.name}
                  className="related-img"
                  onError={e => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=dbeafe&color=1e40af&size=200`;
                  }}
                />
              </div>
              <div className="related-body">
                <div className="avail-badge">
                  <span className="dot" style={{ background: d.available !== false ? '#22c55e' : '#94a3b8' }} />
                  <span style={{ color: d.available !== false ? '#16a34a' : '#64748b' }}>
                    {d.available !== false ? 'Đang hoạt động' : 'Không có sẵn'}
                  </span>
                </div>
                <p className="related-name">{d.name}</p>
                <p className="related-spec">{d.specialty ?? d.specialization}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}