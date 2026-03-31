import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { verifyAccount } from "../services/authService"

const css = `
.verify-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    font-family: 'Inter', sans-serif;
    padding: 20px;
}

.verify-card {
    max-width: 450px;
    width: 100%;
    background: white;
    border-radius: 24px;
    padding: 48px 32px;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
    border: 1px solid #eef2ff;
}

.verify-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 32px;
    font-size: 40px;
}

.verify-icon.success {
    background: #ecfdf5;
    color: #10b981;
}

.verify-icon.error {
    background: #fef2f2;
    color: #ef4444;
}

.verify-icon.loading {
    background: #eff6ff;
    color: #3b82f6;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
}

.verify-title {
    font-size: 24px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 12px;
}

.verify-desc {
    font-size: 15px;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 32px;
}

.verify-btn {
    display: inline-block;
    padding: 14px 32px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-radius: 12px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 8px 20px rgba(99,102,241,0.25);
}

.verify-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(99,102,241,0.35);
}
`

function VerifyAccount() {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState("loading") // loading, success, error
    const [message, setMessage] = useState("Đang xác thực tài khoản của bạn...")

    useEffect(() => {
        const email = searchParams.get("email")
        const code = searchParams.get("code")

        if (!email || !code) {
            setStatus("error")
            setMessage("Thiếu thông tin xác thực. Vui lòng kiểm tra lại đường dẫn trong email.")
            return
        }

        verifyAccount(email, code)
            .then(() => {
                setStatus("success")
                setMessage("Chúc mừng! Tài khoản của bạn đã được xác hoạt thành công. Bây giờ bạn có thể đăng nhập để sử dụng dịch vụ.")
            })
            .catch(err => {
                setStatus("error")
                const errMsg = err.response?.data || "Mã xác thực không hợp lệ hoặc đã hết hạn."
                setMessage(errMsg)
            })
    }, [searchParams])

    return (
        <div className="verify-page">
            <style>{css}</style>
            <div className="verify-card">
                <div className={`verify-icon ${status}`}>
                    {status === "loading" && "⏳"}
                    {status === "success" && "✅"}
                    {status === "error" && "❌"}
                </div>

                <h1 className="verify-title">
                    {status === "loading" && "Đang xác thực"}
                    {status === "success" && "Xác thực thành công"}
                    {status === "error" && "Lỗi xác thực"}
                </h1>

                <p className="verify-desc">{message}</p>

                {status !== "loading" && (
                    <Link to="/signin" className="verify-btn">
                        {status === "success" ? "Đăng nhập ngay" : "Quay lại Đăng nhập"}
                    </Link>
                )}
            </div>
        </div>
    )
}

export default VerifyAccount
