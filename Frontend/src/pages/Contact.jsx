import ct from "../images/contact.png"
import Headers from "../components/Header"
import Footer from "../components/Footer";

function Contact() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');}
        .ct-img-anim { opacity: 0; animation: fadeSlideIn 1s ease 0.2s forwards; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .ct-card:hover { box-shadow: 0 6px 20px rgba(95,109,252,0.1) !important; }
        .ct-btn:hover { background: linear-gradient(135deg, #5f6dfc, #a78bfa) !important; border-color: transparent !important; color: white !important; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(95,109,252,0.28) !important; }
      `}</style>

      <Headers />

      {/* Contact Us Heading */}
      <div style={{ paddingTop: '96px', textAlign: 'center', margin: '0 0 36px', fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#5a6072', position: 'relative' }}>
        Liên hệ với chúng tôi
        <div style={{ width: '40px', height: '3px', background: 'linear-gradient(90deg, #5f6dfc, #a78bfa)', borderRadius: '2px', margin: '8px auto 0' }} />
      </div>

      {/* Layout */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '70px', maxWidth: '1000px', margin: '0 auto 100px', padding: '0 30px', flexWrap: 'wrap' }}>

        {/* Left - Image */}
        <div>
          <img
            src={ct}
            alt="contact"
            className="ct-img-anim"
            style={{ width: '350px', borderRadius: '18px', boxShadow: '0 16px 48px rgba(95,109,252,0.15)' }}
          />
        </div>

        {/* Right Panel */}
        <div style={{ maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Our Office label */}
          <div style={{ position: 'relative' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: '#5a6072' }}>
              Văn phòng của chúng tôi
            </span>
            <div style={{ width: '32px', height: '3px', background: 'linear-gradient(90deg, #5f6dfc, #a78bfa)', borderRadius: '2px', marginTop: '6px' }} />
          </div>

          {/* Address */}
          <div
            className="ct-card"
            style={{ background: '#ffffff', border: '1.5px solid #e8eaf0', borderRadius: '12px', padding: '14px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'box-shadow 0.25s ease' }}
          >
            <p style={{ margin: '3px 0', color: '#44484e', fontSize: '16px', fontWeight: 400, lineHeight: 1.65 }}>Tầng 12, Tòa nhà Bitexco</p>
            <p style={{ margin: '3px 0', color: '#44484e', fontSize: '16px', fontWeight: 400, lineHeight: 1.65 }}>Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
          </div>

          {/* Phone / Email */}
          <div
            className="ct-card"
            style={{ background: '#ffffff', border: '1.5px solid #e8eaf0', borderRadius: '12px', padding: '14px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'box-shadow 0.25s ease' }}
          >
            <p style={{ margin: '3px 0', color: '#44484e', fontSize: '16px', fontWeight: 400, lineHeight: 1.65 }}>Điện thoại: +84 28 3823 4567</p>
            <p style={{ margin: '3px 0', color: '#44484e', fontSize: '16px', fontWeight: 400, lineHeight: 1.65 }}>Email: docbooking@gmail.com</p>
          </div>

          {/* Careers */}
          <div
            className="ct-card"
            style={{ background: '#ffffff', border: '1.5px solid #e8eaf0', borderRadius: '12px', padding: '14px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'box-shadow 0.25s ease' }}
          >
            <p style={{ margin: '3px 0', fontWeight: 700, fontSize: '13px', color: '#5f6dfc', lineHeight: 1.65 }}>Cơ hội nghề nghiệp tại DocBooking</p>
          </div>

          <div
            className="ct-card"
            style={{ background: '#ffffff', border: '1.5px solid #e8eaf0', borderRadius: '12px', padding: '14px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'box-shadow 0.25s ease' }}
          >
            <p style={{ margin: '3px 0', color: '#44484e', fontSize: '16px', fontWeight: 400, lineHeight: 1.65 }}>Tìm hiểu thêm về các đội nhóm và cơ hội việc làm của chúng tôi.</p>
          </div>

          <button
            className="ct-btn"
            style={{ marginTop: '4px', padding: '9px 24px', borderRadius: '30px', border: '2px solid #5f6dfc', background: 'white', color: '#5f6dfc', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '13px', transition: 'all 0.28s ease', width: 'fit-content' }}
          >
            Khám phá cơ hội việc làm
          </button>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Contact;