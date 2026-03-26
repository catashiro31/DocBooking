import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import SpecialtyFilter from '../components/SpecialtyFilter';
import { doctorService } from '../services/doctorService';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';

const css = `
.page { min-height: 100vh; background: #f8fafc; font-family: 'DM Sans', 'Segoe UI', sans-serif; }
.hero { max-width: 1200px; margin: 32px auto 0; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.hero-text { font-size: 15px !important; color: #64748b !important; margin: 0; }
.search-input { border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 9px 16px; font-size: 14px; outline: none; width: 300px; color: #1e293b; background: #fff; }
.main { max-width: 1200px; margin: 24px auto 48px; padding: 0 24px; display: flex; gap: 28px; align-items: flex-start; }
.grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: 18px; }
.empty { grid-column: 1 / -1; text-align: center; padding: 60px; color: #94a3b8; font-size: 15px; }

@media (max-width: 640px) {
  .hero { flex-direction: column; text-align: center; gap: 16px; }
  .search-input { width: 100%; padding: 10px 0; font-size: 12px; }
  .search-input::placeholder {padding-left: 5px;}
  .main { flex-direction: column; }
  .grid { grid-template-columns: repeat(2, 1fr); gap: 12px; width: 100%; }
}
`;

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const specialtyFromUrl = searchParams.get('specialty');
    setSelectedSpecialty(specialtyFromUrl || null);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    doctorService
      .getDoctors()
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi lấy bác sĩ:", error);
        setLoading(false);
      });
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSpecialty =
      !selectedSpecialty ||
      d.specialty?.trim().toLowerCase() === selectedSpecialty?.trim().toLowerCase();
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    return matchSpecialty && matchSearch;
  });

  return (
    <>
      <style>{css}</style>
      <Header activePage="All Doctors" />
      <div className="page">
        <div className="hero">
          <p className="hero-text">Duyệt qua bác sĩ chuyên khoa</p>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm bác sĩ hoặc chuyên khoa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="main">
          <SpecialtyFilter
            selected={selectedSpecialty}
            onSelect={(spec) => {
              setSelectedSpecialty(spec);
              if (spec) {
                setSearchParams({ specialty: spec });
              } else {
                setSearchParams({});
              }
            }}
          />

          <section className="grid">
            {loading ? (
              <div className="empty">Loading</div>
            ) : filtered.length === 0 ? (
              <div className="empty">Không tìm thấy bác sĩ</div>
            ) : (
              filtered.map(doc => <DoctorCard key={doc.id} doctor={doc} />)
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}