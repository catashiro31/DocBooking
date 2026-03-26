import React from "react"
import { NavLink } from "react-router-dom"
import ft from "../images/footer.png"

const css = `
.footer { background-color: #ffffff; padding: 60px 80px 0 80px; border-top: none; }
.footer-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 40px; padding-bottom: 40px; }
.footer-left { flex: 2; max-width: 420px; }
.footer-logo { width: 180px; margin-bottom: 20px; }
.footer-desc { font-size: 14px; color: #6b7280; line-height: 1.8; margin: 0; }
.footer-middle { flex: 1; min-width: 140px; }
.footer-middle h3, .footer-right h3 { font-size: 16px; font-weight: 700; color: #111827; margin: 0 0 20px 0; }
.footer-middle ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
.footer-nav-link { text-decoration: none; font-size: 14px; color: #6b7280; transition: color 0.2s; display: inline-block; }
.footer-nav-link:hover { color: #5147d6; }
.footer-nav-link.active { color: #6b7280; position: relative; }
.footer-nav-link.active::after { content: ""; display: block; width: 28px; height: 2px; background-color: #5147d6; margin-top: 4px; border-radius: 2px; }
.footer-right { flex: 1; min-width: 180px; }
.footer-right ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.footer-right ul li { font-size: 14px; color: #6b7280; }
.footer-bottom { border-top: 1px solid #e5e7eb; text-align: center; }
.footer-bottom p { font-size: 14px !important; color: #6b7280 !important; margin-top: 15px !important; }

@media (max-width: 768px) {
  .footer { padding: 40px 24px 0 24px; }
  .footer-top { flex-direction: column; gap: 32px; }
  .footer-left { max-width: 100%; }
}
`;

function Footer() {
    return (
        <>
            <style>{css}</style>
            <div className="footer">
                <div className="footer-top">
                    <div className="footer-left">
                        <img src={ft} alt="footer" className="footer-logo" />
                        <p className="footer-desc">
                            Người bạn đồng hành đáng tin cậy trong chăm sóc sức khỏe của bạn. 
                            Đặt lịch hẹn khám bác sĩ, quản lý lịch trình và tiếp cận các dịch vụ y tế một cách dễ dàng. 
                            Được thiết kế để hoạt động hiệu quả, Medicheck đơn giản hóa việc quản lý chăm sóc sức khỏe 
                            với giao diện thân thiện với người dùng. Luôn kết nối với các bác sĩ hàng đầu và đảm bảo được chăm sóc y tế kịp thời.
                        </p>
                    </div>

                    <div className="footer-middle">
                        <h3>Công ty</h3>
                        <ul>
                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) => isActive ? "footer-nav-link active" : "footer-nav-link"}
                                >
                                    Trang chủ
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/doctors"
                                    className={({ isActive }) => isActive ? "footer-nav-link active" : "footer-nav-link"}
                                >
                                    Tất cả bác sĩ
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) => isActive ? "footer-nav-link active" : "footer-nav-link"}
                                >
                                    Về chúng tôi
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/contact"
                                    className={({ isActive }) => isActive ? "footer-nav-link active" : "footer-nav-link"}
                                >
                                    Liên hệ
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-right">
                        <h3>Liên hệ với chúng tôi</h3>
                        <ul>
                            <li>023456789</li>
                            <li>medicheck@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>Copyright 2024@ MediCheck - All Right Reserved.</p>
            </div>
        </>
    )
}

export default Footer