import React from "react";
import { Routes, Route } from "react-router-dom";

import HeaderAdmin from "../components/HeaderAdmin";
import Sidebar from "../components/SidebarAdmin";
import Dashboard from "../components/Dashboard";
import Appointments from "../components/AppointmentsAdmin";
import DoctorsListAdmin from "../components/DoctorsListAdmin";

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

        {/* Sidebar */}
        <Sidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

          {/* Header */}
          <HeaderAdmin />

          {/* Content */}
          <div
            className="admin-content"
            style={{ flex: 1, overflowY: 'auto', background: '#f7f9fc', scrollbarWidth: 'thin', scrollbarColor: '#c7ccff #f7f9fc' }}
          >
            <Routes>
              <Route path="/board"       element={<Dashboard />} />
              <Route path="/appointment" element={<Appointments />} />
              <Route path="/doctors"     element={<DoctorsListAdmin />} />
            </Routes>
          </div>

        </div>
      </div>
    </>
  );
};

export default Admin;