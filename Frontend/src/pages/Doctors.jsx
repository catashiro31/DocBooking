import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import { doctorService } from '../services/doctorService';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { PROVINCES } from '../utils/provinceUtils';

const css = `
.page { min-height: 100vh; background: #f8fafc; font-family: 'Inter', -apple-system, sans-serif; padding-top: 96px; }

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
  margin: 0 0 16px; font-size: 11px; color: #94a3b8; font-weight: 800; 
  text-transform: uppercase; letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px;
}
.filter-select {
  width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #e2e8f0;
  font-size: 14px; color: #1e293b; background: #fff; outline: none; margin-bottom: 20px;
  appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat; background-position: right 12px center; background-size: 14px;
}
.filter-select:focus { border-color: #6366f1; }

.spec-list { 
  display: flex; flex-direction: column; gap: 4px; 
  transition: all 0.3s ease;
}
.spec-list.expanded {
  max-height: 320px;
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -8px;
}
/* Scrollbar Styling */
.spec-list.expanded::-webkit-scrollbar { width: 5px; }
.spec-list.expanded::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
.spec-list.expanded::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.spec-list.expanded::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.spec-item { 
  padding: 10px 14px; border-radius: 12px; border: none; background: transparent; 
  cursor: pointer; font-size: 13.5px; transition: all 0.2s; text-align: left; 
  color: #475569; font-weight: 600; font-family: inherit; width: 100%;
}
.spec-item:hover { background: #f8fafc; color: #6366f1; }
.spec-item.active { background: #eef2ff; color: #6366f1; }

.price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.price-tag {
  padding: 8px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #fff;
  font-size: 12px; font-weight: 700; color: #64748b; text-align: center; cursor: pointer;
  transition: all 0.2s; outline: none; font-family: inherit;
}
.price-tag:hover { border-color: #6366f1; color: #6366f1; }
.price-tag.active { background: #6366f1; border-color: #6366f1; color: #fff; }

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


@media (max-width: 768px) {
  .hero-wrapper { padding: 0 16px; }
  .hero { padding: 32px 24px; border-radius: 24px; flex-direction: column; gap: 20px; }
  .hero-title { font-size: 24px; text-align: center; }
  .hero-desc { text-align: center; }
  .search-wrap { width: 100%; }
  .main { flex-direction: column; gap: 24px; padding: 0 20px; }
  .sidebar { width: 100%; position: static; padding: 24px; }
  .grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
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
  const [selectedProvince, setSelectedProvince] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // UI Expand states
  const [isSpecExpanded, setIsSpecExpanded] = useState(false);
  const [isFacilityExpanded, setIsFacilityExpanded] = useState(false);

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
        setFacilities(facs.map(f => ({ 
          ...f, 
          id: f.facilityId || f.id, 
          name: f.facilityName || f.name,
          province: f.province || "" 
        })));
      })
      .catch(err => console.error("Error loading facilities:", err));
  }, []);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 12,
        ...(search && { keyword: search }),
        ...(selectedSpecId && { specId: selectedSpecId }),
        ...(selectedFacilityId && { facilityId: selectedFacilityId }),
        ...(selectedProvince && { province: selectedProvince }),
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
  }, [page, search, selectedSpecId, selectedFacilityId, selectedProvince, minPrice, maxPrice]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    const params = {};
    if (selectedSpecId) params.specId = selectedSpecId;
    if (selectedFacilityId) params.facilityId = selectedFacilityId;
    if (selectedProvince) params.province = selectedProvince;
    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;
    if (search) params.keyword = search;
    setSearchParams(params);
  }, [selectedSpecId, selectedFacilityId, selectedProvince, minPrice, maxPrice, search, setSearchParams]);

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

  const activeProvinces = [...new Set(facilities.map(f => f.province).filter(p => !!p))].sort();
  const filteredFacilities = facilities.filter(f => !selectedProvince || f.province === selectedProvince);

  const displaySpecialties = isSpecExpanded ? specialties : specialties.slice(0, 6);
  const displayFacilities = isFacilityExpanded ? filteredFacilities : filteredFacilities.slice(0, 6);

  return (
    <>
      <style>{css}</style>
      <Header />
      <div className="page">
        <div className="hero-wrapper">
          <div className="hero">
            <div className="hero-text-wrap">
              <h1 className="hero-title">Đội ngũ bác sĩ</h1>
              <p className="hero-desc">Tìm kiếm và đặt lịch khám với các chuyên gia y tế hàng đầu Việt Nam.</p>
            </div>
            <div className="search-wrap">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" className="search-input" placeholder="Tên bác sĩ, triệu chứng..." value={search} onChange={handleSearch} />
            </div>
          </div>
        </div>

        <div className="main">
          <aside className="sidebar">
            <div className="sidebar-group">
              <h3>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Vị trí (Tỉnh/Thành)
              </h3>
              <select className="filter-select" value={selectedProvince} onChange={(e) => { setSelectedProvince(e.target.value); setSelectedFacilityId(null); setPage(0); }}>
                <option value="">Tất cả tỉnh thành</option>
                {activeProvinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="sidebar-group">
              <h3>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Chuyên khoa
              </h3>
              <div className={`spec-list ${isSpecExpanded ? 'expanded' : ''}`}>
                <button className={`spec-item ${!selectedSpecId ? 'active' : ''}`} onClick={() => setSelectedSpecId(null)}>Tất cả</button>
                {displaySpecialties.map(s => (
                  <button key={s.id} className={`spec-item ${selectedSpecId === s.id ? 'active' : ''}`} onClick={() => handleSpecialtySelect(s.id)}>
                    {s.name}
                  </button>
                ))}
              </div>
              {specialties.length > 6 && (
                <button className="spec-item" onClick={() => setIsSpecExpanded(!isSpecExpanded)} style={{ color: '#6366f1', textAlign: 'center', fontSize: '12px', marginTop: '4px' }}>
                  {isSpecExpanded ? 'Thu gọn ↑' : `Xem thêm ${specialties.length - 6} chuyên khoa ↓`}
                </button>
              )}
            </div>

            <div className="sidebar-group">
              <h3>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7"/><path d="M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17"/></svg>
                Cơ sở y tế
              </h3>
              <div className={`spec-list ${isFacilityExpanded ? 'expanded' : ''}`}>
                <button className={`spec-item ${!selectedFacilityId ? 'active' : ''}`} onClick={() => setSelectedFacilityId(null)}>Tất cả</button>
                {filteredFacilities.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#94a3b8', padding: '8px 12px' }}>Không có cơ sở nào ở tỉnh này</p>
                ) : (
                  displayFacilities.map(f => (
                    <button key={f.id} className={`spec-item ${selectedFacilityId === f.id ? 'active' : ''}`} onClick={() => handleFacilitySelect(f.id)}>
                      {f.name}
                    </button>
                  ))
                )}
              </div>
              {filteredFacilities.length > 6 && (
                <button className="spec-item" onClick={() => setIsFacilityExpanded(!isFacilityExpanded)} style={{ color: '#6366f1', textAlign: 'center', fontSize: '12px', marginTop: '4px' }}>
                  {isFacilityExpanded ? 'Thu gọn ↑' : `Xem thêm ${filteredFacilities.length - 6} cơ sở ↓`}
                </button>
              )}
            </div>

            <div className="sidebar-group">
              <h3>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Giá khám
              </h3>
              <div className="price-grid">
                {PRICE_PRESETS.map(p => (
                  <button key={p.label} className={`price-tag ${minPrice === p.min && maxPrice === p.max ? 'active' : ''}`} onClick={() => handlePriceSelect(p.min, p.max)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-doc" style={{ background: '#eee', borderRadius: '24px', height: '300px' }}></div>)
            ) : doctors.length === 0 ? (
              <div className="empty">
                <h3>Không tìm thấy bác sĩ nào</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                <button onClick={() => { setSelectedSpecId(null); setSelectedFacilityId(null); setSearch(''); setSelectedProvince(''); setMinPrice(null); setMaxPrice(null); }} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Xóa tất cả bộ lọc</button>
              </div>
            ) : (
              doctors.map(doc => <DoctorCard key={doc.id} doctor={doc} />)
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>←</button>
                {getPageRange().map(p => (
                  <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p + 1}</button>
                ))}
                <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>→</button>
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
