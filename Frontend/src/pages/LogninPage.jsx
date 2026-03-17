import { useState } from "react"
import { login } from "../services/authService"
import bg from "../images/backgroud_LoginAndRegister.png"
import { useNavigate } from "react-router-dom"

function LogninPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await login(email, password)
            console.log(res)
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <div style={{
            display: "flex",
            height: "70vh",
            padding: "90px",
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

                <form onSubmit={handleSubmitLogin}
                    style={{
                        background: "#e8eef1",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        width: "450px",
                        height: "400px",
                        textAlign: "center",
                        marginTop: "40px",
                        marginLeft: "20px"
                    }}>

                    <h2 style={{
                        marginBottom: "20px",
                        fontFamily: "Arial",
                        fontSize: "24px",
                        color: "#333",

                    }}>
                        Login
                    </h2>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            display: "block",
                            marginBottom: "25px",
                            padding: "10px",
                            width: "95%",
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            display: "block",
                            marginBottom: "20px",
                            padding: "10px",
                            width: "95%"
                        }}
                    />

                    <div>
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
                            Đăng nhập
                        </button>
                    </div>

                </form>


            </div>

        </div>
    )
}
export default LogninPage