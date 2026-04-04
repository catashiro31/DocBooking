import { Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { Suspense, lazy } from "react"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "./context/AuthContext"

// Lazy load pages and components
const LoginPage = lazy(() => import("./pages/LoginPage"))
const HomePage = lazy(() => import("./pages/HomePage"))
const RegisterPage = lazy(() => import("./pages/RegisterPage"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const Doctors = lazy(() => import('./pages/Doctors'))
const About = lazy(() => import("./pages/About"))
const Contact = lazy(() => import("./pages/Contact"))
const Appointment = lazy(() => import('./pages/Appointment'))
const Admin = lazy(() => import("./pages/Admin"))
const DoctorProfile = lazy(() => import("./pages/DoctorProfile"))
const PatientDashboard = lazy(() => import("./pages/PatientDashboard"))
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"))
const DoctorAppointments = lazy(() => import("./components/DoctorAppointments"))
const DoctorScheduleManager = lazy(() => import("./components/DoctorScheduleManager"))
const DoctorOverdueAppointments = lazy(() => import("./components/DoctorOverdueAppointments"))
const DoctorReviews = lazy(() => import("./components/DoctorReviews"))
const ChangePassword = lazy(() => import("./pages/ChangePassword"))
const Facilities = lazy(() => import("./pages/Facilities"))
const PatientAppointments = lazy(() => import("./components/PatientAppointments"))
const PatientHistory = lazy(() => import("./components/PatientHistory"))
const RelativeManagement = lazy(() => import("./components/RelativeManagement"))
const UserProfile = lazy(() => import("./pages/UserProfile"))
const VerifyAccount = lazy(() => import("./pages/VerifyAccount"))

// Loading fallback UI
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
)

function App() {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />

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
        style={{ zIndex: 99999 }}
      />
      
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ===== Auth routes (public) ===== */}
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-account" element={<VerifyAccount />} />

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
      </Suspense>
    </>
  )
}

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