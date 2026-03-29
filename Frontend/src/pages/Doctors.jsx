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
.empty { grid-column: 1 / -1; text-align: center; padding: 80px; color: #64748b; font-size: 15px; background: #fff; border-radius: 20px; border: 1px dashed #e2e8f0; }
.pagination { display: flex; justify-content: center; gap: 8px; margin-top: 24px; grid-column: 1 / -1; }
.pagination button { padding: 8px 16px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; cursor: pointer; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination button.active { background: #5f6dfc; color: white; border-color: #5f6dfc; }

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
  const [loading, setLoading] = useState(true);
  const [selectedSpecId, setSelectedSpecId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // Load specialties
  useEffect(() => {
    doctorService.getSpecialties()
      .then(data => setSpecialties(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading specialties:", err));
  }, []);

  // Load URL params
  useEffect(() => {
    const specId = searchParams.get('specId');
    const keyword = searchParams.get('keyword');
    if (specId) setSelectedSpecId(Number(specId));
    if (keyword) setSearch(keyword);
  }, []);

  // Fetch doctors with filters
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 12,
        ...(search && { keyword: search }),
        ...(selectedSpecId && { specId: selectedSpecId })
      };
      const data = await doctorService.getDoctors(params);
      const doctorList = data.content || data || [];
      setDoctors(doctorList);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedSpecId]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (selectedSpecId) params.specId = selectedSpecId;
    if (search) params.keyword = search;
    setSearchParams(params);
  }, [selectedSpecId, search, setSearchParams]);

  const handleSpecialtySelect = (specId) => {
    setSelectedSpecId(specId === selectedSpecId ? null : specId);
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
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
            <h3>Chuyên khoa</h3>
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
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      Trước
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => (
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