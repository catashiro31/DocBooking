import { useState } from "react"
import { register, login } from "../services/authService"
import { useNavigate } from "react-router-dom"
import bg from "../images/bg.png"
import { Link } from "react-router-dom"
import "../styles/Login.css"

function RegisterPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [confirm, setConfirm] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [role, setRole] = useState("")

    const navigate = useNavigate()

    const handleSubmitRegister = async (e) => {
        e.preventDefault()

        if (password !== confirm) {
            alert("Mật khẩu xác nhận không đúng")
            return
        }

        try {
            await register(email, password, fullName, confirm, phoneNumber, role)
            alert("Đăng ký thành công! Bạn sẽ cần check email để kích hoạt tài khoản trước khi đăng nhập.")
            navigate("/login")

        } catch (error) {
            alert(error.response.data);
        }
    }

    return (
        <div className="login_container">

            <div className="login_left">
                <form className="form" onSubmit={handleSubmitRegister}>

                    <h2>Create Account</h2>
                    <p>Please Sign up to book appointment</p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            padding: "10px",
                            width: "40%",
                            color: role ? "#000" : "#888",
                            borderRadius: "5px",
                            marginRight: "20px"
                        }}
                    >
                        <option value="" disabled hidden> Đăng ký với </option>
                        <option value="PATIENT">Bệnh nhân</option>
                        <option value="DOCTOR">Bác sĩ</option>
                    </select>
                    <button
                        type="submit"
                        style={{
                            padding: "10px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            width: "40%",
                            borderRadius: "5px"
                        }}
                    >
                        Register
                    </button>

                    <div className="switch_page">
                        <p>You already have an account?</p>
                        <Link className="link" to="/login">Login here</Link>
                    </div>

                </form>
            </div>

            <div className="login_right">
                <img src={bg} alt="register" />
            </div>

        </div>
    )
}

export default RegisterPage

