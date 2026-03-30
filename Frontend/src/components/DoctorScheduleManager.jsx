import { useState, useEffect } from "react"
import { doctorService } from "../services/doctorService"
import { toast } from 'react-toastify'

const TIME_SLOTS = [
    'SLOT_09_00', 'SLOT_10_00', 'SLOT_11_00', 
    'SLOT_14_00', 'SLOT_15_00', 'SLOT_16_00', 'SLOT_17_00'
]

const formatTimeSlot = (slot) => {
    return slot.replace('SLOT_', '').replace('_', ':')
}

const DoctorScheduleManager = () => {
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedSlots, setSelectedSlots] = useState([])
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchSchedules()
    }, [])

    const fetchSchedules = async () => {
        try {
            setLoading(true)
            const data = await doctorService.getSchedules()
            setSchedules(Array.isArray(data) ? data : [])
        } catch (err) {
            setError("Không thể tải lịch làm việc")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = () => {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        setSelectedDate(tomorrow)
        setSelectedSlots([])
        setShowModal(true)
    }

    const toggleSlot = (slot) => {
        setSelectedSlots(prev => 
            prev.includes(slot) 
                ? prev.filter(s => s !== slot)
                : [...prev, slot]
        )
    }

    const selectAllSlots = () => {
        setSelectedSlots(TIME_SLOTS)
    }

    const clearAllSlots = () => {
        setSelectedSlots([])
    }

    const handleCreateSchedules = async () => {
        if (!selectedDate || selectedSlots.length === 0) {
            toast.warning("Vui lòng chọn ngày và ít nhất 1 khung giờ")
            return
        }

        setSubmitting(true)
        try {
            await doctorService.createSchedule({
                date: selectedDate,
                slotIds: selectedSlots
            })
            setShowModal(false)
            fetchSchedules()
        } catch (err) {
            toast.error(err.response?.data || "Không thể tạo lịch làm việc")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteSchedule = async (scheduleId) => {
        if (!window.confirm("Xóa lịch làm việc này?")) return

        try {
            await doctorService.deleteSchedule(scheduleId)
            setSchedules(prev => prev.filter(s => s.scheduleId !== scheduleId))
        } catch (err) {
            toast.error(err.response?.data || "Không thể xóa lịch (có thể đã có người đặt)")
        }
    }

    const groupedSchedules = schedules.reduce((acc, schedule) => {
        const date = schedule.dateWorking
        if (!acc[date]) acc[date] = []
        acc[date].push(schedule)
        return acc
    }, {})

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
    }

    if (error) {
        return <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>{error}</div>
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>Lịch làm việc</h3>
                <button
                    onClick={handleOpenModal}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#5f6dfc',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    + Thêm lịch làm việc
                </button>
            </div>

            {Object.keys(groupedSchedules).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>Chưa có lịch làm việc nào</p>
                    <p style={{ fontSize: '14px' }}>Tạo lịch làm việc để bệnh nhân có thể đặt khám</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Object.entries(groupedSchedules)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([date, slots]) => (
                            <div
                                key={date}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    border: '1px solid #e5e7eb'
                                }}
                            >
                                <div style={{ 
                                    fontWeight: '600', 
                                    fontSize: '16px', 
                                    marginBottom: '12px',
                                    color: '#333'
                                }}>
                                    📅 {new Date(date).toLocaleDateString('vi-VN', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {slots
                                        .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                                        .map(slot => (
                                            <div
                                                key={slot.scheduleId}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    background: slot.isBooked ? '#fee2e2' : '#dcfce7',
                                                    border: `1px solid ${slot.isBooked ? '#fecaca' : '#bbf7d0'}`
                                                }}
                                            >
                                                <span style={{ 
                                                    fontWeight: '500',
                                                    color: slot.isBooked ? '#dc2626' : '#16a34a'
                                                }}>
                                                    {formatTimeSlot(slot.timeSlot)}
                                                </span>
                                                {slot.isBooked ? (
                                                    <span style={{ fontSize: '12px', color: '#dc2626' }}>Đã đặt</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDeleteSchedule(slot.scheduleId)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#6b7280',
                                                            cursor: 'pointer',
                                                            padding: '2px',
                                                            fontSize: '14px'
                                                        }}
                                                        title="Xóa"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Create Schedule Modal */}
            {showModal && (
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
                    onClick={() => setShowModal(false)}
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
                        <h3 style={{ marginBottom: '20px' }}>Tạo lịch làm việc</h3>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Chọn ngày
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <label style={{ fontWeight: '500' }}>Chọn khung giờ</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={selectAllSlots}
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #5f6dfc',
                                            background: 'white',
                                            color: '#5f6dfc',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Chọn tất cả
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearAllSlots}
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #6b7280',
                                            background: 'white',
                                            color: '#6b7280',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Bỏ chọn
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                {TIME_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => toggleSlot(slot)}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: selectedSlots.includes(slot) ? '2px solid #5f6dfc' : '1px solid #d1d5db',
                                            background: selectedSlots.includes(slot) ? '#eef2ff' : 'white',
                                            color: selectedSlots.includes(slot) ? '#5f6dfc' : '#374151',
                                            cursor: 'pointer',
                                            fontWeight: selectedSlots.includes(slot) ? '500' : '400'
                                        }}
                                    >
                                        {formatTimeSlot(slot)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
                            Đã chọn: {selectedSlots.length} khung giờ
                        </p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
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
                                onClick={handleCreateSchedules}
                                disabled={submitting || selectedSlots.length === 0}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: submitting || selectedSlots.length === 0 ? '#ccc' : '#5f6dfc',
                                    color: 'white',
                                    cursor: submitting || selectedSlots.length === 0 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {submitting ? 'Đang tạo...' : 'Tạo lịch'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DoctorScheduleManager
