import api from './api';

export function unwrapPage(data) {
    if (data == null) return [];
    if (Array.isArray(data.content)) return data.content;
    if (Array.isArray(data)) return data;
    return [];
}

export const doctorService = {
    getDoctors: async (params) => {
        const response = await api.get('/portal/doctors', { params });
        return response.data;
    },

    getDoctorDetail: async (id) => {
        const response = await api.get(`/portal/doctors/${id}`);
        return response.data;
    },

    /** Công khai: đánh giá theo doctor id (portal) */
    getDoctorReviews: async (id, page = 0) => {
        const response = await api.get(`/portal/doctors/${id}/reviews`, { params: { page } });
        return response.data;
    },

    /** Bác sĩ đăng nhập: đánh giá nhận được */
    getMyReviews: async (page = 0, size = 50) => {
        const response = await api.get('/doctor/reviews', { params: { page, size } });
        return response.data;
    },

    getAvailableSlots: async (id, date) => {
        const response = await api.get(`/portal/doctors/${id}/slots`, { params: { date } });
        return Array.isArray(response.data) ? response.data : response.data.content ?? [];
    },

    getMyProfile: async () => {
        const response = await api.get('/doctor/profile');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/doctor/profile', profileData);
        return response.data;
    },

    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/doctor/profile/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getSchedules: async () => {
        const response = await api.get('/doctor/schedules');
        return response.data;
    },

    /** Backend: một lần gửi { date: "yyyy-MM-dd", slotIds: ["SLOT_07_00", ...] } */
    createSchedule: async (scheduleData) => {
        const response = await api.post('/doctor/schedules', scheduleData);
        return response.data;
    },

    deleteSchedule: async (scheduleId) => {
        const response = await api.delete(`/doctor/schedules/${scheduleId}`);
        return response.data;
    },

    getDoctorAppointments: async (page = 0, size = 100) => {
        const response = await api.get('/doctor/appointment', { params: { page, size } });
        return response.data;
    },

    getOverdueAppointments: async () => {
        const response = await api.get('/doctor/appointments/overdue');
        return response.data;
    },

    updateAppointmentStatus: async (appointmentId, status) => {
        const response = await api.put(`/doctor/appointment/${appointmentId}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    /**
     * Backend: multipart — diagnosis, doctorNotes, prescriptionFile (optional)
     */
    submitMedicalResult: async (appointmentId, { diagnosis, doctorNotes, prescriptionFile }) => {
        const formData = new FormData();
        if (diagnosis != null) formData.append('diagnosis', diagnosis);
        if (doctorNotes != null) formData.append('doctorNotes', doctorNotes);
        if (prescriptionFile) formData.append('prescriptionFile', prescriptionFile);
        const response = await api.post(`/doctor/appointment/${appointmentId}/result`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    updateMedicalResult: async (appointmentId, { diagnosis, doctorNotes, prescriptionFile }) => {
        const formData = new FormData();
        if (diagnosis != null) formData.append('diagnosis', diagnosis);
        if (doctorNotes != null) formData.append('doctorNotes', doctorNotes);
        if (prescriptionFile) formData.append('prescriptionFile', prescriptionFile);
        const response = await api.put(`/doctor/appointment/${appointmentId}/result`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getSpecialties: async () => {
        const response = await api.get('/portal/specialties');
        return response.data;
    },

    getFacilities: async () => {
        const response = await api.get('/portal/facilities');
        return response.data;
    },

    bookAppointment: async (scheduleId, relativeId = null, reason = '') => {
        const response = await api.post('/patient/appointments', { 
            scheduleId, 
            relativeId, 
            reason 
        });
        return response.data;
    },

    getPortalStats: async () => {
        const response = await api.get('/portal/stats');
        return response.data;
    },
};

export default doctorService;
