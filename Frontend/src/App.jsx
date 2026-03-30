import { Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPassword from "./pages/ForgotPassword"
import Doctors from './pages/Doctors'
import About from "./pages/About"
import Contact from "./pages/Contact"
import Appointment from './pages/Appointment'
import Admin from "./pages/Admin"
import DoctorProfile from "./pages/DoctorProfile"
import PatientDashboard from "./pages/PatientDashboard"
import DoctorDashboard from "./pages/DoctorDashboard"
import DoctorAppointments from "./components/DoctorAppointments"
import DoctorScheduleManager from "./components/DoctorScheduleManager"
import DoctorOverdueAppointments from "./components/DoctorOverdueAppointments"
import DoctorReviews from "./components/DoctorReviews"
import ChangePassword from "./pages/ChangePassword"
import Facilities from "./pages/Facilities"
import PatientAppointments from "./components/PatientAppointments"
import PatientHistory from "./components/PatientHistory"
import RelativeManagement from "./components/RelativeManagement"
import UserProfile from "./pages/UserProfile"
import { useAuth } from "./context/AuthContext"

function App() {
  const { user, loading } = useAuth()

  if (loading) return null // Chờ AuthContext load xong

  return (
    <>
      <ToastContainer 
        position="bottom-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Routes>

        {/* ===== Auth routes (public) ===== */}
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Backward compat: /signout cũ trỏ đến register */}
        <Route path="/signout" element={<Navigate to="/register" />} />

        {/* ===== HOME ===== */}
        <Route path="/" element={<HomePage />} />

        {/* ===== Doctor Dashboard (All doctor routes wrapped) ===== */}
        <Route path="/doctor" element={user?.role === "DOCTOR" ? <DoctorDashboard /> : <Navigate to="/signin" />}>
            <Route index element={<Navigate to="/doctor/appointments" />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="schedules" element={<DoctorScheduleManager />} />
            <Route path="overdue" element={<DoctorOverdueAppointments />} />
            <Route path="reviews" element={<DoctorReviews />} />
            <Route path="profile" element={<DoctorProfile />} />
        </Route>

        <Route path="/change-password" element={user ? <ChangePassword /> : <Navigate to="/signin" />} />
        <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/signin" />} />

        {/* ===== Patient Portal (Unified Routing) ===== */}
        <Route path="/patient" element={user?.role === "PATIENT" ? <PatientDashboard /> : <Navigate to="/signin" />}>
            <Route index element={<Navigate to="/patient/appointments" />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="history" element={<PatientHistory />} />
            <Route path="relatives" element={<RelativeManagement />} />
        </Route>

        {/* ===== ADMIN ===== */}
        <Route
          path="/admin/*"
          element={
            user?.role === "ADMIN"
              ? <Admin />
              : <Navigate to="/signin" />
          }
        />

        {/* ===== Public pages ===== */}
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment/:docId" element={<Appointment />} />

        {/* ===== 404 ===== */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  )
}

// Simple 404 component
function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif",
      background: '#fafbfe', textAlign: 'center', padding: '40px'
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '20px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px', boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
      }}>
        <span style={{ fontSize: '36px', color: '#fff', fontWeight: 800 }}>?</span>
      </div>
      <h1 style={{ fontSize: '72px', fontWeight: 800, color: '#e5e7eb', margin: '0 0 8px', letterSpacing: '-0.04em' }}>404</h1>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', margin: '0 0 8px' }}>Trang không tồn tại</h2>
      <p style={{ fontSize: '14px', color: '#9ca3af', maxWidth: '380px', lineHeight: 1.6, margin: '0 0 28px' }}>
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <a href="/" style={{
        padding: '12px 32px', borderRadius: '12px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
        boxShadow: '0 4px 14px rgba(99,102,241,0.3)', transition: 'all 0.25s'
      }}>
        Về trang chủ
      </a>
    </div>
  )
}

export default App