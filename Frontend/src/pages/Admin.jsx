import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HeaderAdmin from "../components/HeaderAdmin";
import Sidebar from "../components/SidebarAdmin";
import Dashboard from "../components/Dashboard";
import Appointments from "../components/AppointmentsAdmin";
import DoctorsListAdmin from "../components/DoctorsListAdmin";
import AdminUsers from "../components/AdminUsers";
import AdminDoctors from "../components/AdminDoctors";
import AdminSpecialties from "../components/AdminSpecialties";
import AdminFacilities from "../components/AdminFacilities";
import AdminReviews from "../components/AdminReviews";

const Admin = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        .admin-content::-webkit-scrollbar { width: 6px; }
        .admin-content::-webkit-scrollbar-track { background: #f7f9fc; }
        .admin-content::-webkit-scrollbar-thumb { background: #c7ccff; border-radius: 10px; }
        .admin-content::-webkit-scrollbar-thumb:hover { background: #5f6dfc; }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', background: '#f7f9fc', fontFamily: "'Nunito', sans-serif", overflow: 'hidden' }}>

        <Sidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <HeaderAdmin />

          <div
            className="admin-content"
            style={{ flex: 1, overflowY: 'auto', background: '#f7f9fc', scrollbarWidth: 'thin', scrollbarColor: '#c7ccff #f7f9fc' }}
          >
            <Routes>
              {/* Redirect /admin to /admin/board */}
              <Route path="/" element={<Navigate to="/admin/board" />} />
              
              <Route path="/board" element={<Dashboard />} />
              <Route path="/appointment" element={<Appointments />} />
              <Route path="/doctors" element={<DoctorsListAdmin />} />
              
              {/* New Admin Routes mapped to existing components */}
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/pending-doctors" element={<AdminDoctors />} />
              <Route path="/specialties" element={<AdminSpecialties />} />
              <Route path="/facilities" element={<AdminFacilities />} />
              <Route path="/reviews" element={<AdminReviews />} />
            </Routes>
          </div>

        </div>
      </div>
    </>
  );
};

export default Admin;