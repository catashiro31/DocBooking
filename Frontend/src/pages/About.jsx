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
                
                .about-card {
                    flex: 1; border: 1.5px solid #e2e8f0; padding: 32px 28px; min-height: 160px; 
                    background: #ffffff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative; overflow: hidden;
                    display: flex; flex-direction: column; justify-content: center;
                }
                .about-card::before { 
                    content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; 
                    background: linear-gradient(180deg, #6366f1, #8b5cf6); 
                    border-radius: 6px 0 0 6px; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
                }
                .about-card:hover::before { width: 100%; border-radius: 20px; }
                .about-card:hover { transform: translateY(-8px); box-shadow: 0 20px 30px rgba(99,102,241,0.15); border-color: transparent; }
                .about-card:hover b, .about-card:hover p { color: white !important; }
                
                .about-card b { display: block; margin-bottom: 12px; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; color: #6366f1; position: relative; z-index: 1; transition: color 0.3s; }
                .about-card p { color: #64748b; font-size: 14px; font-weight: 500; line-height: 1.7; margin: 0; position: relative; z-index: 1; transition: color 0.3s; }
            `}</style>

            <Navbar />

            {/* About Us Heading */}
            <div style={{ textAlign: 'center', margin: '60px auto 48px', fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#1e293b', position: 'relative' }}>
                Về chúng tôi
                <div style={{ width: '48px', height: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '2px', margin: '12px auto 0' }} />
            </div>

            {/* Top Section */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '80px', maxWidth: '1100px', margin: '0 auto 100px', padding: '0 30px', flexWrap: 'wrap' }}>
                <div>
                    <img
                        src={about_img}
                        alt="about"
                        className="about-img-anim"
                        style={{ width: '380px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(99,102,241,0.15)' }}
                    />
                </div>

                <div style={{ maxWidth: '520px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: '#475569', fontSize: '16px', fontWeight: 500, lineHeight: 1.8, margin: 0 }}>
                            Chào mừng bạn đến với <strong style={{color: '#6366f1'}}>DocBooking</strong>, đối tác đáng tin cậy giúp bạn quản lý nhu cầu chăm sóc sức khỏe một cách thuận tiện và hiệu quả. 
                            Tại DocBooking, chúng tôi hiểu những khó khăn mà mọi người gặp phải khi lên lịch hẹn khám bác sĩ và quản lý hồ sơ sức khỏe của mình.
                        </p>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ color: '#475569', fontSize: '16px', fontWeight: 500, lineHeight: 1.8, margin: 0 }}>
                            DocBooking cam kết mang đến sự xuất sắc trong công nghệ chăm sóc sức khỏe. Chúng tôi liên tục nỗ lực nâng cao nền tảng của mình, 
                            tích hợp những tiến bộ mới nhất để cải thiện trải nghiệm người dùng và cung cấp dịch vụ vượt trội. Cho dù bạn đang đặt lịch hẹn 
                            khám đầu tiên hay quản lý việc chăm sóc sức khỏe thường xuyên, DocBooking luôn sẵn sàng hỗ trợ bạn trên mọi chặng đường.
                        </p>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <b style={{ display: 'inline-block', fontSize: '13px', fontWeight: 800, color: '#6366f1', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px', background: '#eef2ff', borderRadius: '8px' }}>
                            Tầm nhìn của chúng tôi
                        </b>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: '#475569', fontSize: '16px', fontWeight: 500, lineHeight: 1.8, margin: 0 }}>
                            Tầm nhìn của DocBooking là tạo ra trải nghiệm chăm sóc sức khỏe liền mạch cho mọi người dùng. Chúng tôi hướng đến việc thu hẹp khoảng cách giữa 
                            bệnh nhân và nhà cung cấp dịch vụ chăm sóc sức khỏe, giúp bạn dễ dàng tiếp cận dịch vụ chăm sóc cần thiết, khi bạn cần.
                        </p>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div style={{ maxWidth: '1100px', margin: '0 auto 32px', padding: '0 30px' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>
                    Tại sao nên chọn chúng tôi?
                </div>
            </div>

            {/* Bottom 3 Cards */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', maxWidth: '1100px', margin: '0 auto 100px', padding: '0 30px', flexWrap: 'wrap' }}>
                {[
                    { label: 'HIỆU QUẢ', text: 'Hệ thống đặt lịch hẹn được tối ưu hóa, phù hợp với lối sống bận rộn của bạn.' },
                    { label: 'SỰ TIỆN LỢI', text: 'Tiếp cận mạng lưới các chuyên gia chăm sóc sức khỏe đáng tin cậy trong khu vực của bạn.' },
                    { label: 'CÁ NHÂN HÓA', text: 'Những lời khuyên và nhắc nhở được thiết kế riêng để giúp bạn luôn chủ động trong việc chăm sóc sức khỏe.' },
                ].map((item) => (
                    <div key={item.label} className="about-card">
                        <b>{item.label}</b>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>

            <Footer />
        </>
    )
}

export default About