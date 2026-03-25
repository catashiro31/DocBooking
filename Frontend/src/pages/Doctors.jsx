import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import SpecialtyFilter from '../components/SpecialtyFilter';
import { doctorService } from '../services/doctorService'
import { useSearchParams } from 'react-router-dom'; //thêm
import '../styles/Doctors.css';
import Footer from '../components/footer';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [search, setSearch] = useState('');
  //Thêm ----------
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const specialtyFromUrl = searchParams.get('specialty');
    setSelectedSpecialty(specialtyFromUrl || null);
  }, [searchParams]);
  //-----------

  //lấy bác sĩ 1 lần
  useEffect(() => {
  setLoading(true);
  doctorService
    .getDoctors() //bỏ { specialty: selectedSpecialty } trong ngoặc đi
    .then((data) => {
      setDoctors(data);
      setLoading(false);
    })
    //sử lý lỗi
    .catch((error) => {
      console.error("Lỗi lấy bác sĩ:", error);
      setLoading(false);
    });
}, []); //không truyền j hết

//lọc ở frontend bằng filtered
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
          //onSelect={setSelectedSpecialty}
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
            <div className='empty'>Loanding</div>
          ) : filtered.length === 0 ? (
            <div className='empty'>No doctors found</div>
          ) : (
            filtered.map(doc => <DoctorCard key={doc.id} doctor={doc} />)
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}