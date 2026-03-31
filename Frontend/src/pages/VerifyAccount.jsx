import { useEffect, useState, useRef } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { verifyAccount } from "../services/authService"
import { CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react"

const css = `
.verify-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at top left, #f8fafc, #eef2ff);
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 24px;
    position: relative;
    overflow: hidden;
}

.verify-bg-glow {
    position: absolute;
    top: -10%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
    pointer-events: none;
}

.verify-glass-card {
    max-width: 440px;
    width: 100%;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    border-radius: 32px;
    padding: 56px 40px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
    animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.verify-visual {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.verify-icon-wrap {
    width: 80px;
    height: 80px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.verify-icon-wrap.loading { background: #eff6ff; color: #3b82f6; }
.verify-icon-wrap.success { background: linear-gradient(135deg, #10b981, #059669); color: white; transform: scale(1.1); box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); }
.verify-icon-wrap.error { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; transform: scale(1.1); box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3); }

.verify-sparkle {
    position: absolute;
    top: -10px;
    right: -10px;
    color: #f59e0b;
    animation: sparkle 2s infinite linear;
}

@keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
}

.verify-title {
    font-size: 28px;
    font-weight: 850;
    color: #0f172a;
    margin-bottom: 12px;
    letter-spacing: -0.04em;
}

.verify-desc {
    font-size: 16px;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 40px;
}

.verify-main-btn {
    display: block;
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-radius: 16px;
    font-weight: 700;
    text-decoration: none;
    font-size: 16px;
    transition: all 0.3s;
    box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
    border: none;
    cursor: pointer;
}

.verify-main-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.5);
}

.verify-back-link {
    display: inline-block;
    margin-top: 24px;
    font-size: 14px;
    font-weight: 600;
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.2s;
}

.verify-back-link:hover { color: #6366f1; }

.status-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.1);
    animation: ripple 2s infinite;
}

@keyframes ripple {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.8); opacity: 0; }
}
`

function VerifyAccount() {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState("loading") // loading, success, error
    const [message, setMessage] = useState("Hệ thống đang tiến hành kích hoạt hồ sơ y tế của bạn...")
    const hasCalled = useRef(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (hasCalled.current) return
        hasCalled.current = true

        const email = searchParams.get("email")
        const code = searchParams.get("code")

        if (!email || !code) {
            setStatus("error")
            setMessage("Đường dẫn xác thực không hợp lệ. Vui lòng kiểm tra lại email hoặc mã code của bạn.")
            return
        }

        const verify = async () => {
            try {
                const responseData = await verifyAccount(email, code)
                setStatus("success")
                setMessage(typeof responseData === 'string' ? responseData : "Chúc mừng! Tài khoản của bạn đã được xác minh thành công. Hãy bắt đầu trải nghiệm dịch vụ của DocBooking ngay.")
            } catch (err) {
                setStatus("error")
                const backendMsg = err.response?.data
                setMessage(typeof backendMsg === 'string' ? backendMsg : "Mã xác thực không hợp lệ hoặc liên kết đã hết hiệu lực sử dụng.")
            }
        }

        // Tạo độ trễ nhẹ (1.5s) để người dùng thấy rõ quy trình xác thực chuyên nghiệp
        const timer = setTimeout(verify, 1500)
        return () => clearTimeout(timer)
    }, [searchParams])

    return (
        <div className="verify-container">
            <style>{css}</style>
            <div className="verify-bg-glow" />
            
            <div className="verify-glass-card">
                <div className="verify-visual">
                    {status === "loading" && <div className="status-pulse" />}
                    {status === "success" && <Sparkles className="verify-sparkle" size={24} />}
                    
                    <div className={`verify-icon-wrap ${status}`}>
                        {status === "loading" && <Loader2 className="animate-spin" size={38} />}
                        {status === "success" && <CheckCircle2 size={44} strokeWidth={2.5} />}
                        {status === "error" && <XCircle size={44} strokeWidth={2.5} />}
                    </div>
                </div>

                <h1 className="verify-title">
                    {status === "loading" && "Đang xác thực"}
                    {status === "success" && "Xác minh thành công"}
                    {status === "error" && "Không thể xác minh"}
                </h1>

                <p className="verify-desc">{message}</p>

                {status !== "loading" ? (
                    <button onClick={() => navigate('/signin')} className="verify-main-btn">
                        {status === "success" ? "Đăng nhập ngay" : "Quay lại Đăng nhập"}
                    </button>
                ) : (
                    <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <span style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>Đang thiết lập kết nối an toàn...</span>
                    </div>
                )}

                <Link to="/" className="verify-back-link">
                    Quay về trang chủ DocBooking
                </Link>
            </div>
        </div>
    )
}

export default VerifyAccount
