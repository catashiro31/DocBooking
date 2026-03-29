import api from "./api";

/** Spring Page -> mảng phần tử */
export function unwrapPage(data) {
    if (data == null) return [];
    if (Array.isArray(data.content)) return data.content;
    if (Array.isArray(data)) return data;
    return [];
}

export const patientService = {
    getRelatives: async () => {
        const res = await api.get("/patient/relatives");
        return res.data;
    },

    addRelative: async (relativeData) => {
        const res = await api.post("/patient/relatives", relativeData);
        return res.data;
    },

    updateRelative: async (id, relativeData) => {
        const res = await api.put(`/patient/relatives/${id}`, relativeData);
        return res.data;
    },

    deleteRelative: async (id) => {
        const res = await api.delete(`/patient/relatives/${id}`);
        return res.data;
    },

    getMyAppointments: async (page = 0, size = 50) => {
        const res = await api.get("/patient/appointments", { params: { page, size } });
        return res.data;
    },

    /** Chi tiết lịch (không dùng cho lịch sử — dùng getHistoryDetail) */
    getAppointmentDetail: async (appointmentId) => {
        const res = await api.get(`/patient/history/${appointmentId}`);
        return res.data;
    },

    getHistoryDetail: async (appointmentId) => {
        const res = await api.get(`/patient/history/${appointmentId}`);
        return res.data;
    },

    bookAppointment: async (scheduleId, relativeId, reason) => {
        const res = await api.post("/patient/appointments", {
            scheduleId,
            relativeId,
            reason
        });
        return res.data;
    },

    createAppointment: async ({ scheduleId, patientId, reason }) => {
        const res = await api.post("/patient/appointments", {
            scheduleId,
            patientId,
            reason
        });
        return res.data;
    },

    cancelAppointment: async (appointmentId) => {
        const res = await api.put(`/patient/appointments/${appointmentId}/cancel`);
        return res.data;
    },

    getHistory: async (page = 0, size = 50) => {
        const res = await api.get("/patient/history", { params: { page, size } });
        return res.data;
    },

    createReview: async (appointmentId, rating, comment) => {
        const res = await api.post(`/patient/appointments/${appointmentId}/review`, {
            rating,
            comment
        });
        return res.data;
    },

    updateReview: async (appointmentId, rating, comment) => {
        const res = await api.put(`/patient/appointments/${appointmentId}/review`, {
            rating,
            comment
        });
        return res.data;
    },

    getProfile: async () => {
        const res = await api.get("/patient/profile");
        return res.data;
    },

    updateProfile: async (profileData) => {
        const res = await api.put("/patient/profile", profileData);
        return res.data;
    }
};

export default patientService;
