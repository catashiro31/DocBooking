import { useNavigate } from 'react-router-dom';

const css = `
.related-section { text-align: center; padding-top: 16px; }
.related-title { font-size: 28px; font-weight: 700; color: #0f172a; margin: 0 0 10px; }
.related-sub { font-size: 15px; color: #6b7280; margin: 0 0 32px; }
.related-grid { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
.related-card { width: 185px; border-radius: 14px; border: 1.5px solid #e5e7eb; overflow: hidden; background: #fff; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; text-align: left; }
.related-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-3px); }
.related-img-wrap { background: #eff6ff; height: 180px; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; }
.related-img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.related-body { padding: 12px 14px 16px; }
.related-name { font-size: 15px; font-weight: 700; color: #0f172a; margin: 4px 0 2px; }
.related-spec { font-size: 13px; color: #6b7280; margin: 0; }
.avail-badge { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }

@media (max-width: 700px) {
  .related-grid { justify-content: flex-start; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .related-card { width: 100%; }
  .related-img-wrap { height: 140px; }
  .related-name { font-size: 13px; }
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
        <h2 className="related-title">Related Doctors</h2>
        <p className="related-sub">Simply browse through our extensive list of trusted doctors.</p>
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
                  <span className="dot" style={{ background: d.available ? '#22c55e' : '#94a3b8' }} />
                  <span style={{ color: d.available ? '#16a34a' : '#64748b' }}>
                    {d.available ? 'Available' : 'Unavailable'}
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