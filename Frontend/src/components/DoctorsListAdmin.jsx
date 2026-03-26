import { useEffect, useState } from "react";
import { doctorService } from "../services/doctorService";
import ham from "../../public/doctors/Ham.jpg";

function DoctorsListAdmin() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorService.getDoctors()
      .then((data) => { setDoctors(data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
        .dl-title::after { content: ''; display: block; width: 44px; height: 4px; background: linear-gradient(90deg, #5f6dfc, #a78bfa); border-radius: 2px; margin-top: 10px; }
        .dl-card:hover { transform: translateY(-6px); box-shadow: 0 14px 32px rgba(95,109,252,0.15) !important; border-color: #c7ccff !important; }
      `}</style>

      <div style={{ padding: '30px', background: '#f7f9fc', minHeight: '100vh', fontFamily: "'Nunito', sans-serif" }}>

        <h2
          className="dl-title"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, margin: '0 0 28px', color: '#1a202c', position: 'relative', display: 'inline-block' }}
        >
          Tất cả bác sĩ
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '24px' }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            doctors.map((doc) => (
              <div
                key={doc.id}
                className="dl-card"
                style={{ background: '#ffffff', borderRadius: '18px', overflow: 'hidden', border: '1.5px solid #e8eaf0', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', cursor: 'pointer', textAlign: 'center' }}
              >
                <img src={ham} alt="" style={{ width: '100%', height: '185px', objectFit: 'cover', display: 'block' }} />

                <div style={{ padding: '18px 16px 20px', borderTop: '1px solid #f0f2f8' }}>
                  <p style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 5px', color: '#1a202c' }}>{doc.name}</p>
                  <p style={{ fontSize: '13.5px', color: '#718096', margin: '0 0 10px' }}>{doc.specialty}</p>
                  <span style={{ display: 'inline-block', fontSize: '12.5px', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 14px', borderRadius: '20px', letterSpacing: '0.3px' }}>
                    Có sẵn
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}

export default DoctorsListAdmin;