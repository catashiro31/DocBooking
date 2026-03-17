import { useState } from "react"
import { register } from "../services/authService"
import bg from "../images/backgroud_LoginAndRegister.png"
import { useNavigate } from "react-router-dom"

function RegisterPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [confirm, setConfirm] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("")

    const navigate = useNavigate()

    const handleSubmitRegister = async (e) => {
        e.preventDefault()

        if (password !== confirm) {
            alert("Mật khẩu xác nhận không đúng")
            return
        }

        try {
            await register(email, password, fullName, confirm, phone, role)
            alert("Đăng ký thành công")
            const res = await login(email, password)
            const userRole = res.data.role
            if (userRole === "DOCTOR") 
                navigate("/doctor-dashboard")
            else 
                navigate("/booking")
            } 
            catch (error) {
            console.error("Không thể đăng ký", error)
        }
    }

    return (
        <div style={{
            display: "flex",
            height: "70vh",
            padding: "90px"
        }}>

            <div style={{
                flex: 6,
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderTopLeftRadius: "15px",
                borderBottomLeftRadius: "15px"
            }}>
            </div>

            <div style={{
                flex: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderTopRightRadius: "15px",
                borderBottomRightRadius: "15px"
            }}>

                <form
                    onSubmit={handleSubmitRegister}
                    style={{
                        background: "#e8eef1",
                        padding: "30px",
                        borderRadius: "8px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        width: "350px",
                        textAlign: "center"
                    }}
                >

                    <h2 style={{
                        marginBottom: "20px",
                        fontFamily: "Arial",
                        fontSize: "24px",
                        color: "#333"
                    }}>
                        Register
                    </h2>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            display: "block",
                            marginBottom: "15px",
                            padding: "10px",
                            width: "100%",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{
                            display: "block",
                            marginBottom: "15px",
                            padding: "10px",
                            width: "100%",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            display: "block",
                            marginBottom: "15px",
                            padding: "10px",
                            width: "100%",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        style={{
                            display: "block",
                            marginBottom: "15px",
                            padding: "10px",
                            width: "100%",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                            display: "block",
                            marginBottom: "20px",
                            padding: "10px",
                            width: "100%",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                        }}
                    />

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                padding: "10px",
                                width: "40%",
                                color: role ? "#000" : "#888",
                                borderRadius: "5px"
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
                            Đăng ký
                        </button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage