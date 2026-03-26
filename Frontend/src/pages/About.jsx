import about_img from "../images/about.png"
import Navbar from "../components/Header"
import Footer from "../components/Footer"

function About() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
                .about-img-anim { opacity: 0; animation: fadeSlideIn 1s ease 0.2s forwards; }
                @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                .about-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(180deg, #5f6dfc, #a78bfa); border-radius: 4px 0 0 4px; transition: width 0.35s ease; }
                .about-card:hover::before { width: 100%; border-radius: 14px; }
                .about-card:hover { background: #5f6dfc !important; }
                .about-card:hover b, .about-card:hover p { color: white !important; }
            `}</style>

            <Navbar />

            {/* About Us Heading */}
            <div style={{ textAlign: 'center', margin: '50px auto 36px', fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#5a6072', position: 'relative' }}>
                Về chúng tôi
                <div style={{ width: '40px', height: '3px', background: 'linear-gradient(90deg, #5f6dfc, #a78bfa)', borderRadius: '2px', margin: '8px auto 0' }} />
            </div>

            {/* Top Section */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '70px', maxWidth: '1100px', margin: '0 auto 80px', padding: '0 30px', flexWrap: 'wrap' }}>
                <div>
                    <img
                        src={about_img}
                        alt="about"
                        className="about-img-anim"
                        style={{ width: '350px', borderRadius: '18px', boxShadow: '0 16px 48px rgba(95,109,252,0.15)' }}
                    />
                </div>

                <div style={{ maxWidth: '500px' }}>
                    <div style={{ marginBottom: '14px' }}>
                        <p style={{ color: '#4f545d', fontSize: '16px', fontWeight: 400, lineHeight: 1.7, margin: 0 }}>
                            Chào mừng bạn đến với MediCheck, đối tác đáng tin cậy giúp bạn quản lý nhu cầu chăm sóc sức khỏe một cách thuận tiện và hiệu quả. 
                            Tại MediCheck, chúng tôi hiểu những khó khăn mà mọi người gặp phải khi lên lịch hẹn khám bác sĩ và quản lý hồ sơ sức khỏe của mình.
                        </p>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <p style={{ color: '#4f545d', fontSize: '16px', fontWeight: 400, lineHeight: 1.7, margin: 0 }}>
                            MediCheck cam kết mang đến sự xuất sắc trong công nghệ chăm sóc sức khỏe. Chúng tôi liên tục nỗ lực nâng cao nền tảng của mình, 
                            tích hợp những tiến bộ mới nhất để cải thiện trải nghiệm người dùng và cung cấp dịch vụ vượt trội. Cho dù bạn đang đặt lịch hẹn 
                            khám đầu tiên hay quản lý việc chăm sóc sức khỏe thường xuyên, Prescripto luôn sẵn sàng hỗ trợ bạn trên mọi chặng đường.
                        </p>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <b style={{ display: 'inline-block', fontSize: '14px', fontWeight: 800, color: '#5f6dfc', letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 12px', background: '#eef0ff', borderRadius: '6px' }}>
                            Tầm nhìn của chúng tôi
                        </b>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <p style={{ color: '#4f545d', fontSize: '16px', fontWeight: 400, lineHeight: 1.7, margin: 0 }}>
                            Tầm nhìn của MediCheck là tạo ra trải nghiệm chăm sóc sức khỏe liền mạch cho mọi người dùng. Chúng tôi hướng đến việc thu hẹp khoảng cách giữa 
                            bệnh nhân và nhà cung cấp dịch vụ chăm sóc sức khỏe, giúp bạn dễ dàng tiếp cận dịch vụ chăm sóc cần thiết, khi bạn cần.
                        </p>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: '#4d5261', margin: '0 0 24px 120px' }}>
                Tại sao nên chọn chúng tôi?
            </div>

            {/* Bottom 3 Cards */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', maxWidth: '1100px', margin: '0 auto 100px', padding: '0 30px', flexWrap: 'wrap' }}>
                {[
                    { label: 'HIỆU QUẢ:', text: 'Hệ thống đặt lịch hẹn được tối ưu hóa, phù hợp với lối sống bận rộn của bạn.' },
                    { label: 'SỰ TIỆN LỢI:', text: 'Tiếp cận mạng lưới các chuyên gia chăm sóc sức khỏe đáng tin cậy trong khu vực của bạn.' },
                    { label: 'CÁ NHÂN HÓA:', text: 'Những lời khuyên và nhắc nhở được thiết kế riêng để giúp bạn luôn chủ động trong việc chăm sóc sức khỏe' },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="about-card"
                        style={{ flex: 1, border: '1.5px solid #e2e8f0', padding: '28px 22px', minHeight: '140px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 3px 16px rgba(0,0,0,0.04)', transition: 'all 0.35s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                    >
                        <b style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 800, letterSpacing: '1.8px', color: '#5f6dfc', position: 'relative', zIndex: 1 }}>
                            {item.label}
                        </b>
                        <p style={{ color: '#9aa5b8', fontSize: '12px', fontWeight: 400, lineHeight: 1.65, margin: 0, position: 'relative', zIndex: 1 }}>
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>

            <Footer />
        </>
    )
}

export default About