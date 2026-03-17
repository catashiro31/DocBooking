import { Routes, Route } from "react-router-dom"
import LogninPage from "./pages/LogninPage"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import Doctors from './pages/Doctors';

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LogninPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/doctors" element={<Doctors />} />
      {/* đường dẫn khác đều cho vào trang Doctors  */}
      <Route path="*" element={<Doctors />} />
    </Routes>
  )

}

export default App