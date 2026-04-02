import { useEffect, useState } from "react"
import { adminService } from "../services/adminService"
import Header from "../components/Header"
import Footer from "../components/Footer"

function Facilities() {
    const [facilities, setFacilities] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        adminService.getAllFacilities()
            .then(data => {
                const list = data.content || data || [];
                setFacilities(Array.isArray(list) ? list : []);
                setLoading(false)
            })
            .catch(err => {
                console.error("Error loading facilities:", err)
                setLoading(false)
            })
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            <Header />
            <div style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
                            Cơ sở y tế liên kết
                        </h1>
                        <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                            Khám phá mạng lưới các bệnh viện và phòng khám uy tín đối tác của DocBooking, mang đến cho bạn dịch vụ chăm sóc sức khỏe tốt nhất.
                        </p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Đang tải danh sách cơ sở y tế...</div>
                    ) : facilities.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', background: 'white', borderRadius: '16px' }}>
                            Chưa có cơ sở y tế nào trong hệ thống.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                            {facilities.map((fac, index) => (
                                <div key={fac.facilityId || index} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                                    <div style={{ height: '200px', background: '#f1f5f9', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {fac.imageUrl ? (
                                            <img 
                                                src={fac.imageUrl} 
                                                alt={fac.facilityName} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div style={{ 
                                            display: fac.imageUrl ? 'none' : 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            padding: '20px'
                                        }}>
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="4" y="2" width="16" height="20" rx="3" fill="#6366f1" fillOpacity="0.1"/>
                                                <rect x="4" y="2" width="16" height="20" rx="3" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 2"/>
                                                <rect x="8" y="7" width="8" height="2" rx="1" fill="#6366f1" fillOpacity="0.2"/>
                                                <rect x="8" y="11" width="8" height="2" rx="1" fill="#6366f1" fillOpacity="0.2"/>
                                                <rect x="8" y="15" width="4" height="2" rx="1" fill="#6366f1" fillOpacity="0.2"/>
                                                <circle cx="18" cy="18" r="5" fill="#6366f1"/>
                                                <path d="M18 15.5V20.5M15.5 18H20.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', margin: '0 0 8px' }}>
                                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{fac.facilityName || fac.name}</h3>
                                            {fac.verified && (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '12px', fontWeight: 700 }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                    </svg>
                                                    Đã xác minh
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <span>📍</span>
                                            <span>{fac.address}</span>
                                        </p>
                                        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#475569', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '67px' }}>
                                            {fac.description}
                                        </p>
                                        {fac.mapUrl && (
                                            <a 
                                                href={fac.mapUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 16px',
                                                    background: '#eef2ff',
                                                    color: '#4f46e5',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s',
                                                    marginTop: 'auto'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = '#e0e7ff'; e.currentTarget.style.color = '#4338ca'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4f46e5'; }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                                                    <line x1="9" y1="3" x2="9" y2="18"></line>
                                                    <line x1="15" y1="6" x2="15" y2="21"></line>
                                                </svg>
                                                Xem trên bản đồ
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Facilities
