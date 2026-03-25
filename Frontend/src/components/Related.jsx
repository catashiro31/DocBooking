import { useNavigate } from 'react-router-dom';

export default function RelatedDoctors({ doctors = [] }) {
  const navigate = useNavigate();
  if (doctors.length === 0) return null;

  return (
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
  );
}