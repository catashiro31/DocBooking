import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';

const css = `
.filter-wrapper { width: 200px; flex-shrink: 0; }
.filter-toggle { display: none; }
.sidebar { display: flex; flex-direction: column; gap: 8px; }
.filter-btn { width: 100%; text-align: left; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; font-size: 14px; color: #374151; cursor: pointer; font-weight: 500; transition: all 0.2s; }
.filter-active { background: #eff6ff; border-color: #93c5fd; color: #1d4ed8; }

@media (max-width: 640px) {
  .filter-wrapper { width: 100%; }
  .filter-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    color: #1f2937;
    cursor: pointer;
    margin-bottom: 10px;
    outline: none;
  }
  .hamburger { display: flex; flex-direction: column; gap: 4px; }
  .hamburger span { display: block; width: 20px; height: 2px; background-color: #374151; transition: 0.3s; }
  .hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
  .sidebar { display: none; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .sidebar.show { display: flex; animation: filterFadeIn 0.2s ease; }
  @keyframes filterFadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
`;

export default function SpecialtyFilter({ selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    doctorService.getSpecialties()
      .then(data => setSpecialties(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading specialties:", err));
  }, []);

  const handleSelect = (spec) => {
    onSelect(spec);
    setIsOpen(false);
  };

  const getSelectedName = () => {
    if (!selected) return "Tất cả chuyên khoa";
    const found = specialties.find(s => s.id === selected);
    return found?.name || "Tất cả chuyên khoa";
  };

  return (
    <>
      <style>{css}</style>
      <div className="filter-wrapper">
        <button className="filter-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span>{getSelectedName()}</span>
          <div className={`hamburger ${isOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
          <button
            className={`filter-btn ${selected === null ? 'filter-active' : ''}`}
            onClick={() => handleSelect(null)}
          >
            Tất cả chuyên khoa
          </button>

          {specialties.map((spec) => (
            <button
              key={spec.id}
              className={`filter-btn ${selected === spec.id ? 'filter-active' : ''}`}
              onClick={() => handleSelect(selected === spec.id ? null : spec.id)}
            >
              {spec.name}
            </button>
          ))}
        </aside>
      </div>
    </>
  );
}