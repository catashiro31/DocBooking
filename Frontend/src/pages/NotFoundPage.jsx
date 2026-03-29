import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

function NotFoundPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
        .nf-wrap {
          min-height: calc(100vh - 200px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 20px 72px;
          text-align: center;
          box-sizing: border-box;
        }
        .nf-code {
          font-family: 'Playfair Display', serif;
          font-size: clamp(72px, 18vw, 140px);
          font-weight: 700;
          line-height: 1;
          margin: 0;
          background: linear-gradient(135deg, #5f6dfc, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nf-title {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(20px, 4vw, 26px);
          font-weight: 700;
          color: #1f2937;
          margin: 16px 0 10px;
        }
        .nf-desc {
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          color: #6b7280;
          max-width: 420px;
          margin: 0 auto 28px;
          line-height: 1.6;
        }
        .nf-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          align-items: center;
        }
        .nf-btn {
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nf-btn-primary {
          background: linear-gradient(135deg, #5f6dfc, #a78bfa);
          color: #fff;
          border: none;
          box-shadow: 0 8px 24px rgba(95, 109, 252, 0.35);
        }
        .nf-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(95, 109, 252, 0.4);
        }
        .nf-btn-ghost {
          background: #fff;
          color: #374151;
          border: 2px solid #e5e7eb;
        }
        .nf-btn-ghost:hover {
          border-color: #c3c9ff;
          color: #5f6dfc;
        }
        @media (max-width: 640px) {
          .nf-wrap { padding: 32px 16px 56px; min-height: calc(100vh - 180px); }
          .nf-actions { flex-direction: column; width: 100%; max-width: 280px; margin: 0 auto; }
          .nf-btn { width: 100%; text-align: center; box-sizing: border-box; }
        }
      `}</style>

      <Header />

      <main className="nf-wrap" role="main">
        <p className="nf-code" aria-hidden="true">
          404
        </p>
        <h1 className="nf-title">Trang không tồn tại</h1>
        <p className="nf-desc">
          Đường dẫn bạn truy cập không có trên hệ thống hoặc đã được đổi tên. Hãy quay về trang chủ hoặc tìm bác sĩ phù hợp.
        </p>
        <div className="nf-actions">
          <Link className="nf-btn nf-btn-primary" to="/">
            Về trang chủ
          </Link>
          <Link className="nf-btn nf-btn-ghost" to="/doctors">
            Danh sách bác sĩ
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default NotFoundPage
