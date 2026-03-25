import { useState } from "react"
import { login } from "../services/authService"
import bg from "../images/bg.png"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "../styles/Login.css"

function LogninPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await login(email, password);
            const userRole = res.role;
            console.log("Role sau khi login:", userRole);

            if (userRole === "ADMIN") {
                navigate("/admin/board");
            } 
            else if (userRole === "DOCTOR") {
                navigate("/doctor-dashboard");
            } 
            else {
                navigate("/"); 
            }

        } catch (error) {
            // 5. HIỂN THỊ LỜI NHẮN LỖI TỪ BACKEND NHƯ ĐÃ CHỐT
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert("Lỗi kết nối đến máy chủ. Vui lòng thử lại!");
            }
            console.error("Lỗi đăng nhập:", error);
        }
    };

    return (
        <div className="login_container">

            <div className="login_left">
                <form className="form" onSubmit={handleSubmitLogin}>
                    <h2>Account Login</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Login</button>
                    <div className="switch_page">
                        <p>Do you have an account yet?</p>
                        <Link className="link" to="/register">Register here</Link>
                    </div>
                </form>
            </div>

            <div className="login_right">
                <img src={bg} alt="login" />
            </div>

        </div>
    )
}
export default LogninPage