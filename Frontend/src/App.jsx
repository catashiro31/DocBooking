import { Routes, Route } from "react-router-dom"
import LogninPage from "./pages/LogninPage"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"

function App() {

  return (
    <Routes>
      <Route path="/signin" element={<LogninPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )

}

export default App