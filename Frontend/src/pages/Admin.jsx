import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HeaderAdmin from "../components/HeaderAdmin";
import Sidebar from "../components/SidebarAdmin";
import Dashboard from "../components/Dashboard";
import Appointments from "../components/AdminAppointments";
import AdminUsers from "../components/AdminUsers";
import AdminDoctors from "../components/AdminDoctors";
import AdminSpecialties from "../components/AdminSpecialties";
import AdminFacilities from "../components/AdminFacilities";
import AdminReviews from "../components/AdminReviews";
import AdminTransfers from "../components/AdminTransfers";

const Admin = () => {
  return (
    <div className="reveal">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .admin-content-wrapper::-webkit-scrollbar { 
          width: 5px; 
        }
        .admin-content-wrapper::-webkit-scrollbar-track { 
          background: transparent; 
        }
        .admin-content-wrapper::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 20px; 
        }
        .admin-content-wrapper::-webkit-scrollbar-thumb:hover { 
          background: #94a3b8; 
        }

        .admin-view-transition {
          animation: adminViewReveal 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes adminViewReveal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', background: '#f1f5f9', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar aria-label="Admin Navigation" />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          {/* Header */}
          <HeaderAdmin />

          {/* Main Content Area */}
          <main
            className="admin-content-wrapper"
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '32px',
              background: '#f8fafc',
              position: 'relative'
            }}
          >
            <div className="admin-view-transition" style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/admin/board" replace />} />
                <Route path="/board" element={<Dashboard />} />
                <Route path="/appointment" element={<Appointments />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/pending-doctors" element={<AdminDoctors />} />
                <Route path="/specialties" element={<AdminSpecialties />} />
                <Route path="/facilities" element={<AdminFacilities />} />
                <Route path="/reviews" element={<AdminReviews />} />
                <Route path="/transfers" element={<AdminTransfers />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;