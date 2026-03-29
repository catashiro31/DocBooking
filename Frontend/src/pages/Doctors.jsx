import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import { doctorService } from '../services/doctorService';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';

const css = `
.page { min-height: 100vh; background: #f8fafc; font-family: 'Inter', -apple-system, sans-serif; }

/* ===== HERO ===== */
.hero-wrapper { max-width: 1280px; margin: 0 auto; padding: 24px 40px; }
.hero {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 32px;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
  padding: 60px 80px; border-radius: 32px; color: #fff;
  box-shadow: 0 20px 50px rgba(99,102,241,0.2);
  position: relative; overflow: hidden;
}
.hero::after {
  content: ''; position: absolute; top: -50%; right: -10%;
  width: 400px; height: 400px; background: rgba(255,255,255,0.08);
  border-radius: 50%; pointer-events: none;
}
.hero-text-wrap { position: relative; z-index: 1; flex: 1; }
.hero-title { font-size: 36px; font-weight: 800; margin: 0 0 12px; letter-spacing: -0.03em; line-height: 1.1; }
.hero-desc { font-size: 16px; color: rgba(255,255,255,0.85); margin: 0; max-width: 440px; line-height: 1.6; }

.search-wrap { position: relative; z-index: 1; width: 400px; max-width: 100%; }
.search-input { 
  width: 100%; border: none; border-radius: 18px; 
  padding: 16px 24px 16px 56px; font-size: 16px; outline: none; 
  color: #0f172a; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}
.search-input:focus { box-shadow: 0 15px 40px rgba(0,0,0,0.15); transform: translateY(-3px); }
.search-icon { 
  position: absolute; left: 22px; top: 50%; transform: translateY(-50%); 
  color: #94a3b8; width: 22px; height: 22px; 
}

/* ===== MAIN CONTENT ===== */
.main { max-width: 1280px; margin: 40px auto 100px; padding: 0 40px; display: flex; gap: 40px; align-items: flex-start; }
.sidebar { 
  width: 280px; flex-shrink: 0; background: #fff; padding: 32px; 
  border-radius: 28px; border: 1px solid #e2e8f0; 
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); position: sticky; top: 100px; 
}
.sidebar-group { margin-bottom: 36px; }
.sidebar-group:last-child { margin-bottom: 0; }
.sidebar h3 { 
  margin: 0 0 20px; font-size: 12px; color: #94a3b8; font-weight: 800; 
  text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 10px;
}
.spec-list { display: flex; flex-direction: column; gap: 6px; }
.spec-item { 
  padding: 12px 16px; border-radius: 14px; border: none; background: transparent; 
  cursor: pointer; font-size: 14px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); text-align: left; 
  color: #475569; font-weight: 600; font-family: inherit;
}
.spec-item:hover { background: #f8fafc; color: #1e293b; padding-left: 20px; }
.spec-item.active { background: #f5f3ff; color: #6366f1; }

.grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px; }
.empty { 
  grid-column: 1 / -1; text-align: center; padding: 100px 40px; color: #64748b; 
  background: #fff; border-radius: 28px; border: 2px dashed #e2e8f0;
}

.pagination { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 60px; grid-column: 1 / -1; }
.pagination button { 
  display: flex; align-items: center; justify-content: center; min-width: 44px; height: 44px; padding: 0 18px; 
  border-radius: 14px; border: 1px solid #e2e8f0; background: #fff; color: #475569; font-weight: 700; font-size: 14px;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit;
}
.pagination button:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(99,102,241,0.15); }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination button.active { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-color: transparent; box-shadow: 0 10px 20px rgba(99,102,241,0.3); }

/* SKELETON */
.skeleton-doc { height: 420px; width: 100%; border-radius: 24px; }


@media (max-width: 640px) {
  .hero-wrapper { padding: 0 16px; }
  .hero { padding: 24px 32px; }
  .hero-text-wrap { text-align: center; }
  .hero-title { font-size: 20px; }
  .hero-desc { font-size: 14px; }
  .search-wrap { width: 100%; }
  .search-input { padding: 12px 16px 12px 40px; }
  .hero { flex-direction: column; text-align: center; gap: 16px; }
  .search-input { width: 100%; padding: 10px 0; font-size: 12px; }
  .main { flex-direction: column; }
  .sidebar { width: 100%; }
  .spec-list { flex-direction: row; flex-wrap: wrap; }
  .spec-item { padding: 8px 12px; font-size: 13px; }
  .grid { grid-template-columns: repeat(2, 1fr); gap: 12px; width: 100%; }
}
`;

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedSpecId, setSelectedSpecId] = useState(() => searchParams.get('specId') ? Number(searchParams.get('specId')) : null);
  const [selectedFacilityId, setSelectedFacilityId] = useState(() => searchParams.get('facilityId') ? Number(searchParams.get('facilityId')) : null);
  const [minPrice, setMinPrice] = useState(() => searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null);
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null);
  const [search, setSearch] = useState(() => searchParams.get('keyword') || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Load filters
  useEffect(() => {
    doctorService.getSpecialties()
      .then(data => {
        const specs = Array.isArray(data) ? data : [];
        setSpecialties(specs.map(s => ({ ...s, id: s.specialtyId || s.id, name: s.specialtyName || s.name })));
      })
      .catch(err => console.error("Error loading specialties:", err));

    doctorService.getFacilities()
      .then(data => {
        const facs = Array.isArray(data) ? data : [];
        setFacilities(facs.map(f => ({ ...f, id: f.facilityId || f.id, name: f.facilityName || f.name })));
      })
      .catch(err => console.error("Error loading facilities:", err));
  }, []);

  // States initialized synchronously from searchParams

  // Fetch doctors with filters
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 12,
        ...(search && { keyword: search }),
        ...(selectedSpecId && { specId: selectedSpecId }),
        ...(selectedFacilityId && { facilityId: selectedFacilityId }),
        ...(minPrice !== null && { minPrice }),
        ...(maxPrice !== null && { maxPrice })
      };
      const data = await doctorService.getDoctors(params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const doctorList = data.content || data || [];
      setDoctors(doctorList);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedSpecId, selectedFacilityId, minPrice, maxPrice]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (selectedSpecId) params.specId = selectedSpecId;
    if (selectedFacilityId) params.facilityId = selectedFacilityId;
    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;
    if (search) params.keyword = search;
    setSearchParams(params);
  }, [selectedSpecId, selectedFacilityId, minPrice, maxPrice, search, setSearchParams]);

  const handleSpecialtySelect = (specId) => {
    setSelectedSpecId(specId === selectedSpecId ? null : specId);
    setPage(0);
  };

  const handleFacilitySelect = (facilityId) => {
    setSelectedFacilityId(facilityId === selectedFacilityId ? null : facilityId);
    setPage(0);
  };

  const handlePriceSelect = (min, max) => {
    if (min === minPrice && max === maxPrice) {
      setMinPrice(null);
      setMaxPrice(null);
    } else {
      setMinPrice(min);
      setMaxPrice(max);
    }
    setPage(0);
  };

  const PRICE_PRESETS = [
    { label: 'Dưới 200k', min: 0, max: 200000 },
    { label: '200k - 500k', min: 200000, max: 500000 },
    { label: '500k - 1tr', min: 500000, max: 1000000 },
    { label: 'Trên 1tr', min: 1000000, max: null },
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const getPageRange = () => {
    let start = Math.max(0, page - 2);
    let end = Math.min(totalPages - 1, start + 4);
    start = Math.max(0, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <>
      <style>{css}</style>
      <Header />
      <div className="page">
        <div className="hero-wrapper reveal">
          <div className="hero">
            <div className="hero-text-wrap">
              <h1 className="hero-title">Đội ngũ bác sĩ</h1>
              <p className="hero-desc">Hơn {doctors.length}+ bác sĩ chuyên khoa hàng đầu sẵn sàng tư vấn và chăm sóc sức khỏe cho bạn.</p>
            </div>
            <div className="search-wrap">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="main">
          <aside className="sidebar reveal">
            <div className="sidebar-group">
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                Chuyên khoa
              </h3>
              <div className="spec-list">
                <button
                  className={`spec-item ${!selectedSpecId ? 'active' : ''}`}
                  onClick={() => handleSpecialtySelect(null)}
                >
                  Tất cả
                </button>
                {specialties.map(spec => (
                  <button
                    key={spec.id}
                    className={`spec-item ${selectedSpecId === spec.id ? 'active' : ''}`}
                    onClick={() => handleSpecialtySelect(spec.id)}
                  >
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-group">
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Cơ sở y tế
              </h3>
              <div className="spec-list">
                <button
                  className={`spec-item ${!selectedFacilityId ? 'active' : ''}`}
                  onClick={() => handleFacilitySelect(null)}
                >
                  Tất cả cơ sở
                </button>
                {facilities.map(fac => (
                  <button
                    key={fac.id}
                    className={`spec-item ${selectedFacilityId === fac.id ? 'active' : ''}`}
                    onClick={() => handleFacilitySelect(fac.id)}
                  >
                    {fac.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-group">
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Khoảng giá
              </h3>
              <div className="spec-list">
                <button
                  className={`spec-item ${minPrice === null && maxPrice === null ? 'active' : ''}`}
                  onClick={() => handlePriceSelect(null, null)}
                >
                  Tất cả giá
                </button>
                {PRICE_PRESETS.map(preset => (
                  <button
                    key={preset.label}
                    className={`spec-item ${minPrice === preset.min && maxPrice === preset.max ? 'active' : ''}`}
                    onClick={() => handlePriceSelect(preset.min, preset.max)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="grid">
            {loading ? (
              Array(8).fill(0).map((_, i) => <div key={i} className="skeleton skeleton-doc" />)
            ) : doctors.length === 0 ? (
              <div className="empty reveal">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 20 }}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" />
                </svg>
                <p style={{ margin: 0, fontWeight: 600 }}>Không tìm thấy bác sĩ phù hợp</p>
                <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.7 }}>Vui lòng thử lại với các tiêu chí lọc khác.</p>
              </div>
            ) : (
              <>
                {doctors.map((doc, i) => (
                  <div key={doc.doctorId || doc.id} className="reveal-delayed" style={{ animationDelay: `${0.1 * i}s` }}>
                    <DoctorCard doctor={doc} />
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="pagination reveal">
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      ←
                    </button>
                    {getPageRange().map(i => (
                      <button
                        key={i}
                        className={page === i ? 'active' : ''}
                        onClick={() => setPage(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
