import { Routes, Route, Navigate } from "react-router-dom"
import LogninPage from "./pages/LogninPage"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import Doctors from './pages/Doctors'
import About from "./pages/About"
import Contact from "./pages/Contact"
import Admin from "./pages/Admin"
import DoctorProfile from "./pages/DoctorProfile"

function App() {

  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <Routes>

      {/* ✅ KHÔNG CHẶN LOGIN */}
      <Route path="/signin" element={<LogninPage />} />
      <Route path="/sigout" element={<RegisterPage />} />

      {/* ✅ HOME */}
      <Route
        path="/"
        element={
          user?.role === "DOCTOR" && user?.verificationStatus === "PENDING"
            ? <Navigate to="/doctor/profile" />
            : <HomePage />
        }
      />

      {/* ✅ PROFILE */}
      <Route path="/doctor/profile" element={<DoctorProfile />} />

      {/* ✅ ADMIN */}
      <Route
        path="/admin/*"
        element={
          user?.role?.toUpperCase() === "ADMIN"
            ? <Admin />
            : <Navigate to="/signin" />
        }
      />

      {/* PAGE KHÁC */}
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/*" element={<Admin />} />

      {/* ❗ QUAN TRỌNG: KHÔNG redirect lung tung */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  )
}

export default App