import React from 'react';
import '../styles/SpecialtyFilter.css'; 
import { SPECIALTIES } from '../utils/constants';

export default function SpecialtyFilter({ selected, onSelect }) {
  return (
    <aside className="sidebar">
      <button
        className={`filter-btn${selected === null ? ' filter-active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All Specialties
      </button>
      {SPECIALTIES.map(spec => (
        <button
          key={spec}
          className={`filter-btn${selected === spec ? ' filter-active' : ''}`}
          onClick={() => onSelect(selected === spec ? null : spec)}
        >
          {spec}
        </button>
      ))}
    </aside>
  );
}