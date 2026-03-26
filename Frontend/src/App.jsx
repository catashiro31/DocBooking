import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import Doctors from './pages/Doctors'
import About from "./pages/About"
import Contact from "./pages/Contact"
import Appointment from './pages/Appointment';
import Admin from "./pages/Admin"

function App() {

  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <Routes>
      <Route path="/signin" element={<LogninPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/sigout" element={<RegisterPage />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/appointment/:docId" element={<Appointment />} />
      <Route path="/admin/*" element={<Admin />} />

      {/* ❗ QUAN TRỌNG: KHÔNG redirect lung tung */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  )
}

export default App