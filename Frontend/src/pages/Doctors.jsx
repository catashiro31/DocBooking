import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import SpecialtyFilter from '../components/SpecialtyFilter';
import { doctorService } from '../services/doctorService'
import '../styles/Doctors.css'; 

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    doctorService
    .getDoctors({ specialty: selectedSpecialty})
    .then(data => {
      setDoctors(data);
      setLoading(false);
    })
  }, [selectedSpecialty])
  
  const filtered = doctors.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Header activePage="All Doctors" />

      <div className="hero">
        <p className="hero-text">Browse through the doctor specialist.</p>
        <input
          type="text"
          className="search-input"
          placeholder="Search doctors or specialties..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Main layout */}
      <div className="main">
        <SpecialtyFilter
          selected={selectedSpecialty}
          onSelect={setSelectedSpecialty}
        />

        <section className="grid">
          {loading ? (
            <div className='empty'>Loanding</div>
          ) : filtered.length === 0 ? (
            <div className='empty'>No doctors found</div>
          ) : (
            filtered.map(doc => <DoctorCard key={doc.id} doctor={doc}/>)
          )}
        </section>
      </div>
    </div>
  );
}