import React, { useState } from 'react';
import '../styles/Doctors.css'; 
import { SPECIALTIES } from '../utils/constants'; 

export default function SpecialtyFilter({ selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (spec) => {
    onSelect(spec);
    setIsOpen(false); 
  };

  return (
    <div className="filter-wrapper">
      {/* Nút hiển thị trên điện thoại (Hamburger menu) */}
      <button className="filter-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected ? selected : "All Specialties"}</span>
        <div className={`hamburger ${isOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Danh sách các chuyên khoa */}
      <aside className={`sidebar ${isOpen ? "show" : ""}`}>
        <button
          className={`filter-btn ${selected === null ? 'filter-active' : ''}`}
          onClick={() => handleSelect(null)}
        >
          All Specialties
        </button>
        
        {SPECIALTIES.map((spec) => (
          <button
            key={spec}
            className={`filter-btn ${selected === spec ? 'filter-active' : ''}`}
            onClick={() => handleSelect(selected === spec ? null : spec)}
          >
            {spec}
          </button>
        ))}
      </aside>
    </div>
  );
}