import React, { useEffect, useState } from "react"
import { Heart, Activity, Brain, Baby, Stethoscope, Ear, Eye, Syringe, ClipboardCheck, Star, User, ChevronRight, ArrowUpRight, ShieldCheck, Clock, Zap } from "lucide-react"
import { doctorService } from "../services/doctorService"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import doctorImg from "../images/home_booking-removebg-preview.png"
import bannerImg from "../images/banner-removebg-preview.png"
import Footer from "../components/Footer"
import Header from "../components/Header"

// Clinical Icon Mapping
const SPEC_ICONS = {
  "Tâm lý": Brain,
  "Sản phụ khoa": Baby,
  "Nha khoa": Stethoscope,
  "Tim mạch": Heart,
  "Tâm thần": Brain,
  "Nhi khoa": Baby,
  "Phục hồi chức năng": Activity,
  "Da Liễu": Stethoscope,
  "Tai Mũi Họng": Ear,
  "Khoa xương khớp": Activity,
  "default": Stethoscope
}

// Improved Mirroring Image Logic (Cloudinary vs Local)
const resolveImg = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  // Fallback for local uploads if any
  const baseUrl = "http://localhost:5020";
  return `${baseUrl}/${url.startsWith("/") ? url.slice(1) : url}`;
};

const getInitials = (name) => {
  if (!name) return "DR";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const InitialsAvatar = ({ name, size = "full" }) => (
  <div style={{ 
    width: '100%', height: '100%', 
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#6366f1', fontWeight: 900,
    fontSize: size === "full" ? "32px" : "18px"
  }}>
    {getInitials(name)}
  </div>
);

function HomePage() {
  const [topDoctors, setTopDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [facilities, setFacilities] = useState([])
  const [stats, setStats] = useState({ totalDoctors: 0, totalAppointments: 0, averageRating: 5.0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    Promise.all([
      doctorService.getDoctors({ size: 8, sortBy: 'rating' }),
      doctorService.getSpecialties(),
      doctorService.getFacilities(),
      doctorService.getPortalStats()
    ])
      .then(([doctorsData, specialtiesData, facilitiesData, statsData]) => {
        const doctors = (doctorsData?.content || doctorsData || []).map(doc => ({
          ...doc,
          photoUrl: resolveImg(doc.photo || doc.avatarUrl)
        }));
        setTopDoctors(Array.isArray(doctors) ? doctors.slice(0, 8) : [])

        const specs = (Array.isArray(specialtiesData) ? specialtiesData : []).map(s => ({
          ...s,
          id: s.specialtyId || s.id,
          name: s.specialtyName || s.name,
          icon: SPEC_ICONS[s.specialtyName || s.name] || SPEC_ICONS["default"],
          imgUrl: resolveImg(s.imageUrl)
        }));
        setSpecialties(specs)
        
        const facs = (Array.isArray(facilitiesData) ? facilitiesData : []).slice(0, 15).map(f => ({
          ...f,
          id: f.facilityId || f.id,
          name: f.facilityName || f.name
        }))
        setFacilities(facs)

        if (statsData) setStats(statsData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Home loading error:", err);
        setLoading(false);
      })
  }, [])

  const isLoggedIn = isAuthenticated()
  const heroCtaText = isLoggedIn ? "Vào trang điều khiển" : "Đăng ký ngay"
  const heroCtaPath = isLoggedIn ? "/profile" : "/register"

  return (
    <div className="min-h-screen bg-white font-['Inter'] selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }

        .reveal { animation: reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        
        .floating { animation: floating 6s ease-in-out infinite; }
        @keyframes floating { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

        .gradient-text {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);
        }

        .marquee-track { display: flex; width: max-content; animation: marquee 60s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .service-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: #ffffff;
            border: 1px solid #f1f5f9;
        }
        .service-card:hover {
            transform: translateY(-8px);
            background: #ffffff;
            box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.08);
            border-color: #e2e8f0;
        }

        .btn-premium {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: white;
            box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.3);
        }
        .btn-premium:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.4);
            filter: brightness(1.1);
        }
      `}</style>

      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal space-y-10" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-indigo-600 font-bold text-[11px] uppercase tracking-wider">Hệ thống đặt lịch y tế #1 Việt Nam</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] gradient-text">
              Kết nối sức khỏe <br />
              <span className="text-indigo-600">toàn diện nhất</span>
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
              DocBooking giúp bạn tìm đúng bác sĩ, đúng chuyên khoa và đặt lịch khám chỉ trong 30 giây. Tiết kiệm thời gian, nâng tầm trải nghiệm y tế số.
            </p>

            <div className="flex flex-wrap gap-5 pt-2">
                <button 
                  onClick={() => navigate(isLoggedIn ? '/doctors' : '/register')} 
                  className="btn-premium px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3"
                >
                  {heroCtaText} <ChevronRight size={20} />
                </button>
                <div className="flex -space-x-3 items-center">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-200">
                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                        </div>
                    ))}
                    <div className="pl-4">
                        <p className="text-sm font-bold text-slate-900">+50,000</p>
                        <p className="text-[11px] text-slate-500 font-medium">Người dùng tin tưởng</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-slate-100">
                {[
                    { label: 'Bác sĩ chuyên khoa', value: stats.totalDoctors + '+', icon: <Stethoscope size={20} /> },
                    { label: 'Lượt khám thành công', value: stats.totalAppointments, icon: <ShieldCheck size={20} /> },
                ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2 text-indigo-600 mb-1">
                            {s.icon} <span className="text-2xl font-extrabold text-slate-900 tracking-tighter">{s.value}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</p>
                    </div>
                ))}
            </div>
          </div>

          <div className="relative reveal hidden lg:block" style={{ animationDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-indigo-200/20 blur-[100px] rounded-full scale-150" />
                <div className="relative z-10 floating">
                    <img src={doctorImg} alt="Doctor" className="w-full max-w-[500px] mx-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)]" />
                    
                    {/* Floating Cards */}
                    <div className="absolute top-1/4 -left-10 hero-card p-4 rounded-2xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><Clock size={20} /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Lịch trống gần nhất</p>
                            <p className="text-sm font-extrabold text-slate-900">Hôm nay, 14:00</p>
                        </div>
                    </div>

                    <div className="absolute bottom-1/4 -right-10 hero-card p-4 rounded-2xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '5s' }}>
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600"><Star size={20} className="fill-amber-600" /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Đánh giá trung bình</p>
                            <p className="text-sm font-extrabold text-slate-900">4.9/5.0 Sao</p>
                        </div>
                    </div>
                </div>
          </div>
        </div>
      </section>

      {/* ===== SPECIALTIES SECTION ===== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center mb-16 space-y-4 reveal">
            <span className="text-indigo-600 font-extrabold text-[12px] uppercase tracking-[0.3em]">Danh mục dịch vụ</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tighter">Chuyên khoa nổi bật</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(8).fill(0).map((_, i) => <div key={i} className="h-48 rounded-[2rem] bg-white animate-pulse" />)
            ) : (
              specialties.slice(0, 8).map((s) => {
                const Icon = s.icon;
                return (
                  <div 
                    key={s.id} 
                    onClick={() => navigate(`/doctors?specId=${s.id}`)}
                    className="service-card group p-8 rounded-[2rem] cursor-pointer"
                  >
                    <div className="mb-6 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      {s.imgUrl ? (
                         <img src={s.imgUrl} alt="" className="w-8 h-8 object-cover rounded-lg group-hover:brightness-0 group-hover:invert transition-all" />
                      ) : (
                         <Icon size={32} className="text-indigo-600 group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600">{s.name}</h3>
                    <p className="mt-2 text-sm text-slate-400 font-medium">{s.doctorCount || 0} Bác sĩ chuyên khoa</p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* ===== PARTNER MARQUEE ===== */}
      <section className="py-16 bg-white overflow-hidden">
         <div className="marquee-track">
            {[...facilities, ...facilities].map((fac, i) => (
              <div key={i} className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-8 py-4 mx-4 rounded-2xl group cursor-pointer hover:border-indigo-200">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {fac.name?.charAt(0)}
                </div>
                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors tracking-tight text-sm">{fac.name}</span>
              </div>
            ))}
          </div>
      </section>

      {/* ===== TOP DOCTORS SECTION ===== */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-2 reveal">
            <div className="space-y-4">
              <span className="text-indigo-600 font-extrabold text-[12px] uppercase tracking-[0.3em]">Bác sĩ xuất sắc</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tighter">Đội ngũ chuyên gia</h2>
            </div>
            <button onClick={() => navigate("/doctors")} className="btn-premium px-8 py-3 rounded-xl font-bold text-sm">
              Xem tất cả chuyên gia
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
                Array(4).fill(0).map((_, i) => <div key={i} className="h-[450px] bg-slate-50 rounded-[2.5rem] animate-pulse" />)
            ) : (
                topDoctors.map(doc => (
                    <div key={doc.doctorId} onClick={() => navigate(`/appointment/${doc.doctorId}`)} 
                         className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 cursor-pointer">
                        <div className="aspect-[3/4] bg-slate-50 overflow-hidden">
                            {doc.photoUrl ? (
                                <img src={doc.photoUrl} alt={doc.doctorName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                     onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                            ) : null}
                            <div style={{ display: doc.photoUrl ? 'none' : 'flex', width: '100%', height: '100%' }}>
                                <InitialsAvatar name={doc.doctorName} />
                            </div>
                            
                            <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-white/50">
                                    {doc.specialtyName}
                                </span>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold">
                                    <Star size={14} className="fill-amber-600" /> {doc.ratingAverage?.toFixed(1) || "5.0"}
                                </div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{doc.experienceYears} năm kinh nghiệm</div>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">BS. {doc.doctorName}</h3>
                            <button className="mt-6 w-full py-4 bg-slate-50 rounded-2xl text-slate-900 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                Đặt lịch khám ngay
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 bg-slate-950 rounded-[4rem] mx-6 md:mx-12 mb-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)]" />
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className="space-y-8">
                    <span className="text-indigo-400 font-extrabold text-[12px] uppercase tracking-[0.4em]">Trải nghiệm số</span>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter leading-tight">
                        Quản lý y tế <br />
                        <span className="text-indigo-400 underline decoration-indigo-400/30 underline-offset-8">Gia đình tập trung</span>
                    </h2>
                    <p className="text-indigo-100/60 text-lg font-medium leading-relaxed max-w-lg">
                        Không còn lo lắng việc lưu trữ hồ sơ giấy. Với DocBooking, bạn quản lý toàn bộ quá trình khám chữa bệnh cho con cái và người thân trên một tài khoản duy nhất.
                    </p>
                    <div className="space-y-4">
                        {[
                            { title: 'Bảo mật HIPAA', desc: 'Dữ liệu y tế được mã hóa an toàn tuyệt đối.', icon: <ShieldCheck className="text-emerald-400" /> },
                            { title: 'Thông báo nhắc lịch', desc: 'Tự động gửi SMS/Email nhắc lịch hẹn khám.', icon: <Zap className="text-amber-400" /> }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors">
                                <div className="mt-1">{item.icon}</div>
                                <div>
                                    <h4 className="text-white font-bold">{item.title}</h4>
                                    <p className="text-indigo-100/40 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden lg:block relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full scale-110" />
                    <img src={bannerImg} alt="App Mockup" className="relative z-10 floating filter brightness-110" />
                </div>
          </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage