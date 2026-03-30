import React, { useEffect, useState } from "react"
import { Heart, Activity, Brain, Baby, Stethoscope, Ear, Eye, Syringe, ClipboardCheck, Star, User, ChevronRight, ArrowUpRight } from "lucide-react"
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

// Image Resolution & Initials Logic
const resolveImg = (url) => {
  if (!url || url.includes("dicebear") || url.includes("ui-avatars")) return null;
  if (url.startsWith("http")) return url;
  return `http://localhost:5020/${url.startsWith("/") ? url.slice(1) : url}`;
};

const getInitials = (name) => {
  if (!name) return "DR";
  const parts = name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

// Reusable Initials Avatar Component
const InitialsAvatar = ({ name, size = "full", className = "" }) => (
  <div className={`flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 font-black tracking-tighter ${className}`} style={{ width: '100%', height: '100%' }}>
    <span style={{ fontSize: size === "full" ? "2.5rem" : "1rem" }}>{getInitials(name)}</span>
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
          photo: resolveImg(doc.photo) || resolveImg(doc.avatarUrl)
        }));
        setTopDoctors(Array.isArray(doctors) ? doctors.slice(0, 8) : [])

        const specs = (Array.isArray(specialtiesData) ? specialtiesData : []).map(s => ({
          ...s,
          id: s.specialtyId || s.id,
          name: s.specialtyName || s.name,
          icon: SPEC_ICONS[s.specialtyName || s.name] || SPEC_ICONS["default"],
          imageUrl: resolveImg(s.imageUrl)
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
      .catch(() => setLoading(false))
  }, [])

  const isLoggedIn = isAuthenticated()
  const heroCtaText = isLoggedIn ? "Vào trang quản lý" : "Khám phá dịch vụ"
  const heroCtaPath = isLoggedIn ? "/doctors" : "/register"

  const handleFamilyManagement = () => {
    navigate(isLoggedIn ? '/patient/relative' : '/signin');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .marquee-track { display: flex; width: max-content; animation: marquee 140s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .reveal { animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes reveal { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .floating { animation: floating 12s ease-in-out infinite; }
        @keyframes floating { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(0.1deg); } }
        .spec-card { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); overflow: hidden; }
        .spec-card:hover { transform: translateY(-8px); box-shadow: 0 40px 80px -20px rgba(79, 70, 229, 0.2); }
        .spec-card .reveal-content { max-height: 0; opacity: 0; transition: all 0.4s ease; }
        .spec-card:hover .reveal-content { max-height: 100px; opacity: 1; margin-top: 12px; }
      `}</style>

      <Header />

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-10 md:pb-20">
        
        {/* ===== HERO SECTION ===== */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-[2.5rem] p-10 lg:p-20 overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.4)] reveal">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[320px] h-[320px] bg-indigo-400/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10 min-h-[400px]">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full w-fit">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]" />
                <span className="text-white text-[9px] font-black tracking-[0.4em] uppercase opacity-90">Hệ sinh thái y tế tin cậy</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-[900] text-white leading-[1.08] tracking-tighter">
                  Chăm sóc sức khỏe <br />
                  <span className="text-indigo-300">thông minh</span> hơn
                </h1>
                
                <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-lg font-medium">
                  Kết nối chuyên khoa tức thì. <br />
                  Tiêu chuẩn vận hành y tế số toàn cầu.
                </p>
              </div>

              <div className="flex flex-wrap gap-5 pt-2">
                <button onClick={() => navigate(heroCtaPath)} className="px-10 py-5 bg-white text-indigo-950 font-[900] rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all duration-300 text-base font-black">
                  {heroCtaText}
                </button>
                <button onClick={() => navigate("/about")} className="px-10 py-5 bg-indigo-200/5 backdrop-blur-sm border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 text-base">
                  Khám phá thêm
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-3xl font-[900] text-white tracking-tighter tabular-nums">{stats.totalDoctors}+</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] leading-none">Bác sĩ</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-[900] text-white tracking-tighter tabular-nums">{stats.totalAppointments}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] leading-none">Lượt khám</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-[900] text-white tracking-tighter tabular-nums">{stats.averageRating}/5.0</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] leading-none">Hài lòng</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-end relative">
               <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full" />
               <img src={doctorImg} alt="Healthcare Technology" className="w-[420px] filter saturate-[1.1] drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)] relative z-10 floating" />
            </div>
          </div>
        </section>

        {/* ===== SPECIALTIES (Kinetic Reveal) ===== */}
        <section className="mt-28 reveal">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">Danh mục y khoa</span>
            <h2 className="text-4xl md:text-5xl font-[900] text-slate-900 tracking-tighter">Y khoa chuyên biệt</h2>
            <div className="w-12 h-[5px] bg-indigo-600 rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 px-2">
            {loading ? (
              Array(10).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />
              ))
            ) : (
              specialties.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/doctors?specId=${item.id}`)}
                    className="spec-card group bg-white p-8 rounded-[2.5rem] border border-slate-200 cursor-pointer flex flex-col items-center justify-center text-center relative"
                  >
                    <div className="mb-6 w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300 shadow-inner">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-10 h-10 object-cover rounded-xl group-hover:brightness-0 group-hover:invert transition-all" />
                      ) : (
                        <Icon className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors" strokeWidth={1.5} />
                      )}
                    </div>
                    
                    <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] leading-tight px-4">{item.name}</h3>
                    
                    <div className="reveal-content flex flex-col items-center">
                      <p className="text-slate-400 text-[9px] font-medium tracking-tight mb-3">Xem chuyên gia</p>
                      <ChevronRight className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ===== PARTNER MARQUEE ===== */}
        <section className="mt-28 py-12 bg-slate-950 rounded-[3rem] overflow-hidden reveal">
          <div className="marquee-track px-10">
            {[...facilities, ...facilities, ...facilities].map((fac, i) => (
              <div key={i} className="flex items-center gap-6 bg-white/5 border border-white/5 px-8 py-3 mx-4 rounded-xl group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-emerald-400 text-xs group-hover:bg-emerald-400 group-hover:text-slate-950 transition-all">
                  {fac.name?.charAt(0)}
                </div>
                <span className="font-bold text-white/40 group-hover:text-white transition-colors tracking-tight text-xs truncate max-w-[200px]">{fac.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== DOCTORS (Initial Fallback Integrated) ===== */}
        <section className="mt-28 reveal">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-2">
            <div className="space-y-4">
              <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">Expert Intelligence</span>
              <h2 className="text-4xl font-[900] text-slate-900 tracking-tighter">Đội ngũ chuyên gia</h2>
            </div>
            <button onClick={() => navigate("/doctors")} className="px-8 py-3 bg-slate-950 text-white font-[900] rounded-2xl hover:bg-indigo-700 transition-all duration-300 text-sm font-black">
              Tất cả bác sĩ
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-2">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-96 bg-slate-100 rounded-[2.5rem] animate-pulse" />)
            ) : (
              topDoctors.map((doc) => (
                <div key={doc.doctorId} onClick={() => navigate(`/appointment/${doc.doctorId}`)} className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 cursor-pointer">
                  <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                    {doc.photo ? (
                      <img src={doc.photo} alt={doc.doctorName} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <InitialsAvatar name={doc.doctorName} />
                    )}
                    <div className="absolute top-8 left-8">
                       <span className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg text-[9px] font-black uppercase tracking-widest text-indigo-600 border border-slate-100">
                          {doc.specialtyName}
                       </span>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-tight">Active</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-base">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {doc.ratingAverage?.toFixed(1) || "5.0"}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors uppercase text-[12px]">{doc.doctorName}</h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ===== BENTO INSIGHTS ===== */}
        <section className="mt-28 reveal">
          <div className="grid md:grid-cols-3 gap-8 px-2">
            <div className="md:col-span-2 group bg-white p-12 rounded-[3rem] border border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/50 rounded-full -z-10" />
               <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-8">
                  <div className="inline-flex p-6 bg-indigo-50 rounded-3xl text-3xl group-hover:rotate-[3deg] transition-transform">
                    <ClipboardCheck className="text-indigo-600 w-10 h-10" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-[900] text-slate-900 tracking-tighter leading-none">Lịch hẹn thông minh</h3>
                    <p className="text-slate-500 font-medium leading-relaxed text-base">
                      Hệ thống tự động hóa 100% quy trình điều phối giữa bác sĩ và bệnh nhân. Chính xác tuyệt đối.
                    </p>
                  </div>
                </div>
                <div className="flex-1 bg-slate-50/80 p-10 rounded-[2.5rem] border border-slate-100">
                  <div className="space-y-5">
                    <div className="h-4 bg-white rounded-full w-full" />
                    <div className="h-4 bg-white rounded-full w-[85%]" />
                    <div className="h-4 bg-white rounded-full w-[65%]" />
                  </div>
                  <p className="mt-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center">Protocol</p>
                </div>
              </div>
            </div>

            <div className="group bg-indigo-900 p-12 rounded-[3rem] shadow-xl text-white flex flex-col justify-between hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
              <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-white/5 rounded-full blur-[80px]" />
              <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-10">
                <Brain className="text-white w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight text-white uppercase text-[14px]">Toàn vẹn dữ liệu</h3>
                <p className="text-indigo-200 font-medium leading-relaxed text-sm">
                  Bảo mật y tế đa tầng theo mã hóa HIPAA quốc tế.
                </p>
              </div>
            </div>

            <div className="md:col-span-3 group bg-slate-950 p-12 lg:p-20 rounded-[4rem] text-white flex flex-col md:flex-row gap-12 items-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
               <div className="flex-1 space-y-8 text-center md:text-left">
                  <div className="inline-block px-5 py-2 bg-emerald-400/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">Unified Patient Portal</div>
                  <h3 className="text-5xl lg:text-7xl font-[900] tracking-tighter leading-none text-white">Quản lý người thân</h3>
                  <p className="text-white/40 font-medium text-xl max-w-3xl leading-relaxed">
                    Theo dõi lịch trình khám bệnh cho mọi thành viên trên một nền tảng duy nhất. Minh bạch và an toàn tuyệt đối.
                  </p>
                  <button onClick={handleFamilyManagement} className="px-12 py-5 bg-emerald-400 text-slate-950 hover:bg-white rounded-2xl transition-all font-black shadow-xl mt-6 text-lg flex items-center gap-3 mx-auto md:mx-0">
                    Bắt đầu ngay <ArrowUpRight className="w-5 h-5" />
                  </button>
               </div>
               <div className="text-[12rem] opacity-5 select-none font-black hidden lg:block">FAMILY</div>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="mt-32 relative bg-slate-950 rounded-[4rem] p-16 md:p-24 overflow-hidden reveal">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-10 text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl font-[900] text-white leading-[1.05] tracking-tighter">
                Vì một Việt Nam <br /><span className="text-indigo-400 font-black italic">vững bền hơn</span>
              </h2>
              <button onClick={() => navigate(heroCtaPath)} className="px-12 py-6 bg-white text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all duration-400 text-xl mx-auto lg:mx-0 block shadow-2xl">
                {isLoggedIn ? "Vào trang quản lý" : "Đăng ký DocBooking ngay"}
              </button>
            </div>
            <div className="hidden lg:flex justify-end relative">
              <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full" />
              <img src={bannerImg} alt="Healthcare Technology" className="w-[460px] filter saturate-[1.1] drop-shadow-[0_48px_96px_rgba(0,0,0,0.6)] relative z-10 floating" />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default HomePage