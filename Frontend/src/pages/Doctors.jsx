import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import { doctorService } from '../services/doctorService';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';

const css = `
.page { min-height: 100vh; background: #f8fafc; font-family: 'DM Sans', 'Inter', sans-serif; }

/* ===== HERO ===== */
.hero-wrapper { max-width: 1280px; margin: 32px auto 0; padding: 0 40px; }
.hero {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 40px 48px; border-radius: 24px; color: #fff;
  box-shadow: 0 12px 32px rgba(99,102,241,0.15);
  position: relative; overflow: hidden;
}
.hero::after {
  content: ''; position: absolute; top: -50%; right: -10%;
  width: 300px; height: 300px; background: rgba(255,255,255,0.1);
  border-radius: 50%; pointer-events: none;
}
.hero-text-wrap { position: relative; z-index: 1; }
.hero-title { font-size: 28px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; }
.hero-desc { font-size: 15px; color: rgba(255,255,255,0.85); margin: 0; max-width: 400px; line-height: 1.6; }

.search-wrap { position: relative; z-index: 1; width: 340px; max-width: 100%; }
.search-input { 
  width: 100%; border: none; border-radius: 14px; 
  padding: 14px 20px 14px 48px; font-size: 15px; outline: none; 
  color: #1e293b; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  transition: all 0.3s;
}
.search-input:focus { box-shadow: 0 12px 32px rgba(0,0,0,0.15); transform: translateY(-2px); }
.search-icon { 
  position: absolute; left: 18px; top: 50%; transform: translateY(-50%); 
  color: #94a3b8; width: 20px; height: 20px; 
}

/* ===== MAIN CONTENT ===== */
.main { max-width: 1280px; margin: 32px auto 60px; padding: 0 40px; display: flex; gap: 32px; align-items: flex-start; }
.sidebar { width: 240px; flex-shrink: 0; background: #fff; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); position: sticky; top: 100px; }
.sidebar h3 { margin: 0 0 16px; font-size: 16px; color: #0f172a; font-weight: 700; }
.spec-list { display: flex; flex-direction: column; gap: 6px; }
.spec-item { 
  padding: 12px 16px; border-radius: 12px; border: none; background: transparent; 
  cursor: pointer; font-size: 14px; transition: all 0.2s; text-align: left; 
  color: #475569; font-weight: 500; font-family: inherit;
}
.spec-item:hover { background: #f1f5f9; color: #1e293b; }
.spec-item.active { background: #eef2ff; color: #6366f1; font-weight: 600; }

.grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; }
.empty { grid-column: 1 / -1; text-align: center; padding: 80px; color: #64748b; font-size: 15px; background: #fff; border-radius: 20px; border: 1px dashed #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }

.pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 40px; grid-column: 1 / -1; padding-bottom: 20px; }
.pagination button { 
  display: flex; align-items: center; justify-content: center; min-width: 40px; height: 40px; padding: 0 16px; 
  border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; color: #475569; font-weight: 600; font-size: 14px;
  cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 4px rgba(0,0,0,0.02); font-family: inherit;
}
.pagination button:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99,102,241,0.15); }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; background: #f8fafc; }
.pagination button.active { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }

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
  const [selectedSpecId, setSelectedSpecId] = useState(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // Load filters
  useEffect(() => {
    doctorService.getSpecialties()
      .then(data => setSpecialties(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading specialties:", err));
      
    doctorService.getFacilities()
      .then(data => setFacilities(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading facilities:", err));
  }, []);

  // Load URL params ON MOUNT
  useEffect(() => {
    const sId = searchParams.get('specId');
    const fId = searchParams.get('facilityId');
    const minP = searchParams.get('minPrice');
    const maxP = searchParams.get('maxPrice');
    const kw = searchParams.get('keyword');
    
    // Use explicit existence checks to handle 0 and other values correctly
    if (sId !== null) setSelectedSpecId(Number(sId));
    if (fId !== null) setSelectedFacilityId(Number(fId));
    if (minP !== null) setMinPrice(Number(minP));
    if (maxP !== null) setMaxPrice(Number(maxP));
    if (kw !== null) setSearch(kw);
  }, []);

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
        <div className="hero-wrapper">
          <div className="hero">
            <div className="hero-text-wrap">
              <h1 className="hero-title">Đội ngũ bác sĩ</h1>
              <p className="hero-desc">Duyệt qua danh sách các bác sĩ chuyên khoa giàu kinh nghiệm và đặt lịch khám ngay hôm nay.</p>
            </div>
            <div className="search-wrap">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <aside className="sidebar">
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                Chuyên khoa
              </h3>
              <div className="spec-list">
                <button 
                  className={`spec-item ${!selectedSpecId ? 'active' : ''}`}
                  onClick={() => handleSpecialtySelect(null)}
                >
                  Tất cả chuyên khoa
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

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
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

            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
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
              <div className="empty">Đang tải...</div>
            ) : doctors.length === 0 ? (
              <div className="empty">Không tìm thấy bác sĩ</div>
            ) : (
              <>
                {doctors.map(doc => (
                  <DoctorCard key={doc.doctorId || doc.id} doctor={doc} />
                ))}
                
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      onClick={() => setPage(0)}
                      disabled={page === 0}
                      style={{ fontSize: '12px' }}
                    >
                      Đầu
                    </button>
                    <button 
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      Trước
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
                      Sau
                    </button>
                    <button 
                      onClick={() => setPage(totalPages - 1)}
                      disabled={page >= totalPages - 1}
                      style={{ fontSize: '12px' }}
                    >
                      Cuối
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