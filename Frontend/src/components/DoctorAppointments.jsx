import { useState, useEffect } from "react"
import { doctorService, unwrapPage } from "../services/doctorService"

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
            alert(typeof msg === "string" ? msg : "Không thể cập nhật trạng thái")
        }
    }

    const openResultModal = (appointment, mode) => {
        setSelectedAppointment(appointment)
        setResultMode(mode)
        setResultData({ diagnosis: "", prescription: "", notes: "" })
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
            alert("Vui lòng nhập chẩn đoán")
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
            alert(typeof msg === "string" ? msg : "Không thể lưu kết quả khám")
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

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    if (error) {
        return <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>{error}</div>
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>Quản lý lịch hẹn</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setFilter(status)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: filter === status ? 'none' : '1px solid #d1d5db',
                                background: filter === status ? '#5f6dfc' : 'white',
                                color: filter === status ? 'white' : '#374151',
                                cursor: 'pointer',
                                fontSize: '13px'
                            }}
                        >
                            {status === 'ALL' ? 'Tất cả' : getStatusText(status)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <p style={{ fontSize: '18px' }}>Không có lịch hẹn nào</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredAppointments.map(apt => (
                        <div
                            key={apt.appointmentId}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: '1px solid #e5e7eb'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: '600', fontSize: '16px' }}>
                                            {apt.patientName}
                                        </span>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            ...getStatusStyle(apt.bookingStatus)
                                        }}>
                                            {getStatusText(apt.bookingStatus)}
                                        </span>
                                    </div>

                                    <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                        <span>📅 {apt.dateWorking}</span>
                                        <span>⏰ {formatSlotLabel(apt.timeSlot)}</span>
                                        {apt.patientPhoneNumber && <span>📱 {apt.patientPhoneNumber}</span>}
                                        {apt.patientGender && <span>👤 {apt.patientGender === 'MALE' ? 'Nam' : 'Nữ'}</span>}
                                    </div>

                                    {apt.reason && (
                                        <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f9fafb', borderRadius: '6px', fontSize: '14px' }}>
                                            <strong>Lý do khám:</strong> {apt.reason}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {apt.bookingStatus === 'PENDING' && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateStatus(apt.appointmentId, 'CONFIRMED')}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: '#10b981',
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Xác nhận
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateStatus(apt.appointmentId, 'CANCELLED')}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ef4444',
                                                    background: 'white',
                                                    color: '#ef4444',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Từ chối
                                            </button>
                                        </>
                                    )}

                                    {apt.bookingStatus === 'CONFIRMED' && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => openResultModal(apt, "create")}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: '#5f6dfc',
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Trả kết quả
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateStatus(apt.appointmentId, 'NO_SHOW')}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #6b7280',
                                                    background: 'white',
                                                    color: '#6b7280',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Không đến
                                            </button>
                                        </>
                                    )}

                                    {apt.bookingStatus === 'COMPLETED' && (
                                        <button
                                            type="button"
                                            onClick={() => openResultModal(apt, "edit")}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid #5f6dfc',
                                                background: 'white',
                                                color: '#5f6dfc',
                                                cursor: 'pointer'
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
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setShowResultModal(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: '20px' }}>
                            {resultMode === "edit" ? "Sửa kết quả khám" : "Kết quả khám bệnh"}
                        </h3>
                        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                            Bệnh nhân: <strong>{selectedAppointment?.patientName}</strong>
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                    Chẩn đoán *
                                </label>
                                <textarea
                                    value={resultData.diagnosis}
                                    onChange={e => setResultData(prev => ({ ...prev, diagnosis: e.target.value }))}
                                    placeholder="Nhập chẩn đoán..."
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        minHeight: '80px',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                    Đơn thuốc (nội dung)
                                </label>
                                <textarea
                                    value={resultData.prescription}
                                    onChange={e => setResultData(prev => ({ ...prev, prescription: e.target.value }))}
                                    placeholder="Ghi đơn thuốc dạng text..."
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        minHeight: '80px',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                    Tệp đơn thuốc (ảnh/PDF, tùy chọn)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={e => setPrescriptionFile(e.target.files?.[0] || null)}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                                    Ghi chú / lời dặn
                                </label>
                                <textarea
                                    value={resultData.notes}
                                    onChange={e => setResultData(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Lời dặn, tái khám..."
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        minHeight: '60px',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button
                                type="button"
                                onClick={() => setShowResultModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitResult}
                                disabled={submitting || !resultData.diagnosis?.trim()}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: submitting || !resultData.diagnosis?.trim() ? '#ccc' : '#5f6dfc',
                                    color: 'white',
                                    cursor: submitting || !resultData.diagnosis?.trim() ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {submitting ? 'Đang lưu...' : resultMode === "edit" ? 'Cập nhật' : 'Lưu kết quả'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DoctorAppointments
