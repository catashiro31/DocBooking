import { useState, useEffect } from "react"
import { doctorService, unwrapPage } from "../services/doctorService"
import { toast } from 'react-toastify'

const formatSlotLabel = (slot) => {
    if (!slot || typeof slot !== "string") return slot
    if (!slot.startsWith("SLOT_")) return slot
    return slot.replace("SLOT_", "").replace(/_/g, ":")
}

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [filter, setFilter] = useState("ALL")
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [showResultModal, setShowResultModal] = useState(false)
    const [resultMode, setResultMode] = useState("create")
    const [resultData, setResultData] = useState({ diagnosis: "", prescription: "", notes: "" })
    const [prescriptionFile, setPrescriptionFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const data = await doctorService.getDoctorAppointments(0, 200)
            setAppointments(unwrapPage(data))
        } catch (err) {
            setError("Không thể tải danh sách lịch hẹn")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (appointmentId, status) => {
        const confirmMsg = {
            'CONFIRMED': 'Xác nhận lịch hẹn này?',
            'CANCELLED': 'Từ chối lịch hẹn này?',
            'NO_SHOW': 'Đánh dấu bệnh nhân không đến?',
            'COMPLETED': 'Đánh dấu đã hoàn thành khám?'
        }
        
        if (!window.confirm(confirmMsg[status] || 'Xác nhận thay đổi?')) return

        try {
            await doctorService.updateAppointmentStatus(appointmentId, status)
            fetchAppointments()
        } catch (err) {
            const msg = err.response?.data
            toast.error(typeof msg === "string" ? msg : "Không thể cập nhật trạng thái")
        }
    }

    const parseDoctorNotes = (fullNotes) => {
        if (!fullNotes) return { prescription: "", notes: "" }
        
        const prescriptionMarker = "Đơn thuốc:\n"
        const index = fullNotes.indexOf(prescriptionMarker)
        
        if (index === -1) {
            return { prescription: "", notes: fullNotes.trim() }
        }
        
        const notes = fullNotes.substring(0, index).trim()
        const prescription = fullNotes.substring(index + prescriptionMarker.length).trim()
        
        return { prescription, notes }
    }

    const openResultModal = (appointment, mode) => {
        setSelectedAppointment(appointment)
        setResultMode(mode)
        
        if (mode === "edit" || appointment.diagnosis) {
            const { prescription, notes } = parseDoctorNotes(appointment.doctorNotes)
            setResultData({
                diagnosis: appointment.diagnosis || "",
                prescription: prescription,
                notes: notes
            })
        } else {
            setResultData({ diagnosis: "", prescription: "", notes: "" })
        }
        
        setPrescriptionFile(null)
        setShowResultModal(true)
    }

    const buildDoctorNotes = () => {
        const parts = []
        if (resultData.notes?.trim()) parts.push(resultData.notes.trim())
        if (resultData.prescription?.trim()) {
            parts.push(`Đơn thuốc:\n${resultData.prescription.trim()}`)
        }
        return parts.length ? parts.join("\n\n") : ""
    }

    const handleSubmitResult = async () => {
        if (!selectedAppointment) return
        if (!resultData.diagnosis?.trim()) {
            toast.warning("Vui lòng nhập chẩn đoán")
            return
        }

        setSubmitting(true)
        try {
            const payload = {
                diagnosis: resultData.diagnosis.trim(),
                doctorNotes: buildDoctorNotes(),
                prescriptionFile: prescriptionFile || undefined
            }
            if (resultMode === "edit") {
                await doctorService.updateMedicalResult(selectedAppointment.appointmentId, payload)
            } else {
                await doctorService.submitMedicalResult(selectedAppointment.appointmentId, payload)
            }
            setShowResultModal(false)
            fetchAppointments()
        } catch (err) {
            const msg = err.response?.data
            toast.error(typeof msg === "string" ? msg : "Không thể lưu kết quả khám")
        } finally {
            setSubmitting(false)
        }
    }

    const getStatusStyle = (status) => {
        const styles = {
            'PENDING': { background: '#fef3c7', color: '#d97706' },
            'CONFIRMED': { background: '#dbeafe', color: '#2563eb' },
            'COMPLETED': { background: '#dcfce7', color: '#16a34a' },
            'CANCELLED': { background: '#fee2e2', color: '#dc2626' },
            'NO_SHOW': { background: '#f3f4f6', color: '#6b7280' }
        }
        return styles[status] || { background: '#f3f4f6', color: '#6b7280' }
    }

    const getStatusText = (status) => {
        const texts = {
            'PENDING': 'Chờ xác nhận',
            'CONFIRMED': 'Đã xác nhận',
            'COMPLETED': 'Đã khám',
            'CANCELLED': 'Đã hủy',
            'NO_SHOW': 'Không đến'
        }
        return texts[status] || status
    }

    const filteredAppointments = filter === 'ALL' 
        ? appointments 
        : appointments.filter(apt => apt.bookingStatus === filter)

    const SkeletonRow = () => (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <div className="skeleton" style={{ height: '20px', width: '120px', borderRadius: '4px' }} />
                        <div className="skeleton" style={{ height: '20px', width: '80px', borderRadius: '20px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="skeleton" style={{ height: '16px', width: '100px', borderRadius: '4px' }} />
                        <div className="skeleton" style={{ height: '16px', width: '80px', borderRadius: '4px' }} />
                    </div>
                </div>
                <div className="skeleton" style={{ height: '36px', width: '100px', borderRadius: '8px' }} />
            </div>
        </div>
    )

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', background: '#fef2f2', borderRadius: '16px', color: '#dc2626', fontWeight: 600 }}>
                {error}
            </div>
        )
    }

    return (
        <div className="reveal" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Quản lý lịch hẹn</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>Theo dõi và xử lý các yêu cầu khám bệnh từ bệnh nhân</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    {[
                        { id: 'ALL', label: 'Tất cả' },
                        { id: 'PENDING', label: 'Chờ duyệt' },
                        { id: 'CONFIRMED', label: 'Sắp tới' },
                        { id: 'COMPLETED', label: 'Đã khám' }
                    ].map(st => (
                        <button
                            key={st.id}
                            onClick={() => setFilter(st.id)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '10px',
                                border: 'none',
                                background: filter === st.id ? 'white' : 'transparent',
                                color: filter === st.id ? '#5f6dfc' : '#64748b',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 700,
                                boxShadow: filter === st.id ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            {st.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 20px', background: '#f9fafb', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📅</div>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Không tìm thấy lịch hẹn</h3>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Bạn hiện không có yêu cầu nào trong danh mục này.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredAppointments.map(apt => (
                        <div
                            key={apt.appointmentId}
                            style={{
                                background: 'white',
                                borderRadius: '18px',
                                padding: '24px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                border: '1px solid #f1f5f9',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseOver={e => e.currentTarget.style.boxShadow = '0 10px 30px rgba(95,109,252,0.1)'}
                            onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0f4ff', color: '#5f6dfc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800 }}>
                                            {apt.patientName?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>
                                                {apt.patientName}
                                            </h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                <span style={{
                                                    padding: '2px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    ...getStatusStyle(apt.bookingStatus)
                                                }}>
                                                    {getStatusText(apt.bookingStatus)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ opacity: 0.7 }}>📅</span> {apt.dateWorking}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ opacity: 0.7 }}>⏰</span> {formatSlotLabel(apt.timeSlot)}
                                        </div>
                                        {apt.patientPhoneNumber && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ opacity: 0.7 }}>📱</span> {apt.patientPhoneNumber}
                                            </div>
                                        )}
                                        {apt.patientGender && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ opacity: 0.7 }}>👤</span> {apt.patientGender === 'MALE' ? 'Nam' : 'Nữ'}
                                            </div>
                                        )}
                                    </div>

                                    {apt.reason && (
                                        <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #edf2f7', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                                            <strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.5px' }}>Lý do khám</strong>
                                            {apt.reason}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                                    {apt.bookingStatus === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(apt.appointmentId, 'CONFIRMED')}
                                                style={{
                                                    padding: '10px 16px', borderRadius: '10px', border: 'none',
                                                    background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
                                                    cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                                                    boxShadow: '0 4px 12px rgba(16,185,129,0.2)', transition: 'all 0.2s'
                                                }}
                                            >
                                                Xác nhận
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(apt.appointmentId, 'CANCELLED')}
                                                style={{
                                                    padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #ef4444',
                                                    background: 'white', color: '#ef4444', cursor: 'pointer',
                                                    fontWeight: 700, fontSize: '13px', transition: 'all 0.2s'
                                                }}
                                            >
                                                Từ chối
                                            </button>
                                        </>
                                    )}

                                    {apt.bookingStatus === 'CONFIRMED' && (
                                        <>
                                            <button
                                                onClick={() => openResultModal(apt, "create")}
                                                style={{
                                                    padding: '10px 16px', borderRadius: '10px', border: 'none',
                                                    background: 'linear-gradient(135deg, #5f6dfc, #3b82f6)', color: 'white',
                                                    cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                                                    boxShadow: '0 4px 12px rgba(95,109,252,0.2)', transition: 'all 0.2s'
                                                }}
                                            >
                                                Trả kết quả
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(apt.appointmentId, 'NO_SHOW')}
                                                style={{
                                                    padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #94a3b8',
                                                    background: 'white', color: '#64748b', cursor: 'pointer',
                                                    fontWeight: 700, fontSize: '13px', transition: 'all 0.2s'
                                                }}
                                            >
                                                Không đến
                                            </button>
                                        </>
                                    )}

                                    {apt.bookingStatus === 'COMPLETED' && (
                                        <button
                                            onClick={() => openResultModal(apt, "edit")}
                                            style={{
                                                padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #5f6dfc',
                                                background: '#f5f7ff', color: '#5f6dfc', cursor: 'pointer',
                                                fontWeight: 700, fontSize: '13px', transition: 'all 0.2s'
                                            }}
                                        >
                                            Sửa kết quả
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showResultModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={() => setShowResultModal(false)}
                >
                    <div
                        className="reveal"
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '32px',
                            maxWidth: '550px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                            position: 'relative'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
                                    {resultMode === "edit" ? "Cập nhật kết quả" : "Trả kết quả khám"}
                                </h3>
                                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                                    Bệnh nhân: <span style={{ color: '#0f172a', fontWeight: 700 }}>{selectedAppointment?.patientName}</span>
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowResultModal(false)}
                                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Chẩn đoán bệnh <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <textarea
                                    value={resultData.diagnosis}
                                    onChange={e => setResultData(prev => ({ ...prev, diagnosis: e.target.value }))}
                                    placeholder="Bác sĩ nhập chẩn đoán cụ thể..."
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #cbd5e1',
                                        minHeight: '100px', resize: 'vertical', boxSizing: 'border-box', fontSize: '15px', color: '#1e293b',
                                        outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#5f6dfc'}
                                    onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: '#64748b' }}>
                                        Nội dung đơn thuốc (dạng text)
                                    </label>
                                    <textarea
                                        value={resultData.prescription}
                                        onChange={e => setResultData(prev => ({ ...prev, prescription: e.target.value }))}
                                        placeholder="Tên thuốc, liều dùng..."
                                        style={{
                                            width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                                            minHeight: '80px', resize: 'vertical', boxSizing: 'border-box', fontSize: '14px', color: '#475569',
                                            outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#5f6dfc'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: '#64748b' }}>
                                        Tệp đính kèm (Ảnh/PDF đơn thuốc)
                                    </label>
                                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={e => setPrescriptionFile(e.target.files?.[0] || null)}
                                            style={{
                                                width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px dashed #cbd5e1',
                                                background: '#f8fafc', fontSize: '13px', cursor: 'pointer'
                                            }}
                                        />
                                        {prescriptionFile && (
                                            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                                                ✓ Đã chọn: {prescriptionFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: '#64748b' }}>
                                    Lời nhắn / Dặn dò bệnh nhân
                                </label>
                                <textarea
                                    value={resultData.notes}
                                    onChange={e => setResultData(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Dặn dò uống thuốc, ngày tái khám..."
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                                        minHeight: '80px', resize: 'vertical', boxSizing: 'border-box', fontSize: '14px', color: '#475569',
                                        outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#5f6dfc'}
                                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                            <button
                                type="button"
                                onClick={() => setShowResultModal(false)}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #e2e8f0',
                                    background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 700,
                                    fontSize: '15px', transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                onMouseOut={e => e.currentTarget.style.background = 'white'}
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitResult}
                                disabled={submitting || !resultData.diagnosis?.trim()}
                                style={{
                                    flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
                                    background: submitting || !resultData.diagnosis?.trim() ? '#cbd5e1' : 'linear-gradient(135deg, #5f6dfc, #3b82f6)',
                                    color: 'white', cursor: submitting || !resultData.diagnosis?.trim() ? 'not-allowed' : 'pointer',
                                    fontWeight: 700, fontSize: '15px', boxShadow: submitting ? 'none' : '0 8px 20px rgba(95,109,252,0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {submitting ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                        Đang lưu...
                                    </div>
                                ) : resultMode === "edit" ? 'Cập nhật kết quả' : 'Lưu kết quả & Hoàn tất'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DoctorAppointments
