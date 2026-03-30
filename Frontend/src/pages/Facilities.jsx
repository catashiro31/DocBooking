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
                            {facilities.map(fac => (
                                <div key={fac.facilityId} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                                    <div style={{ height: '200px', background: '#e2e8f0', position: 'relative' }}>
                                        {fac.imageUrl ? (
                                            <img src={fac.imageUrl} alt={fac.facilityName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '48px' }}>
                                                🏥
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{fac.facilityName}</h3>
                                        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <span>📍</span>
                                            <span>{fac.address}</span>
                                        </p>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {fac.description}
                                        </p>
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
