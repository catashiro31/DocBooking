import api from "./api";

export const adminService = {
    getStats: async (startDate, endDate) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const res = await api.get("/admin/stats", { params });
        return res.data;
    },

    getAllUsers: async (page = 0, size = 10) => {
        const res = await api.get("/admin/users", { params: { page, size } });
        return res.data;
    },

    blockUser: async (userId, reason) => {
        const res = await api.patch(`/admin/users/${userId}/block`, null, {
            params: { reason }
        });
        return res.data;
    },
    
    unblockUser: async (userId) => {
        const res = await api.patch(`/admin/users/${userId}/unblock`);
        return res.data;
    },

    getPendingDoctors: async () => {
        const res = await api.get("/admin/doctor-pending");
        return res.data;
    },

    getAllDoctors: async (page = 0, size = 10) => {
        const res = await api.get("/admin/doctor-all", { params: { page, size } });
        return res.data;
    },

    getDoctorDetail: async (id) => {
        const res = await api.get(`/admin/doctor/${id}`);
        return res.data;
    },

    approveDoctor: async (doctorId) => {
        const res = await api.put(`/admin/${doctorId}/approve`);
        return res.data;
    },

    rejectDoctor: async (doctorId, reason) => {
        const res = await api.put(`/admin/${doctorId}/reject`, null, {
            params: { reason }
        });
        return res.data;
    },

    getAllSpecialties: async () => {
        const res = await api.get("/portal/specialties");
        return res.data;
    },

    addSpecialty: async (data) => {
        const body = {
            specialtyName: (data.specialtyName ?? data.name ?? "").trim(),
            description: data.description ?? ""
        };
        const res = await api.post("/admin/specialty", body);
        return res.data;
    },

    updateSpecialty: async (id, data) => {
        const body = {
            specialtyName: (data.specialtyName ?? data.name ?? "").trim(),
            description: data.description ?? ""
        };
        const res = await api.put(`/admin/specialty/${id}`, body);
        return res.data;
    },

    deleteSpecialty: async (id) => {
        const res = await api.delete(`/admin/specialty/${id}`);
        return res.data;
    },

    getAllFacilities: async () => {
        const res = await api.get("/portal/facilities");
        return res.data;
    },

    addFacility: async (data) => {
        const formData = new FormData();
        formData.append("facilityName", (data.facilityName ?? data.name ?? "").trim());
        formData.append("address", data.address ?? "");
        formData.append("province", data.province || "");
        if (data.description) formData.append("description", data.description);
        if (data.mapUrl) formData.append("mapUrl", data.mapUrl);
        if (data.file) formData.append("file", data.file);
        if (data.licenseFile) formData.append("licenseFile", data.licenseFile);
        const res = await api.post("/admin/facility", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },

    updateFacility: async (id, data) => {
        const formData = new FormData();
        formData.append("facilityName", (data.facilityName ?? data.name ?? "").trim());
        formData.append("address", data.address ?? "");
        formData.append("province", data.province || "");
        if (data.description) formData.append("description", data.description);
        if (data.mapUrl) formData.append("mapUrl", data.mapUrl);
        if (data.file) formData.append("file", data.file);
        if (data.licenseFile) formData.append("licenseFile", data.licenseFile);
        const res = await api.put(`/admin/facility/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },

    verifyFacility: async (id) => {
        const res = await api.patch(`/admin/facility/${id}/verify`);
        return res.data;
    },

    deleteFacility: async (id) => {
        const res = await api.delete(`/admin/facility/${id}`);
        return res.data;
    },

    getAllAppointments: async (params = {}) => {
        const res = await api.get("/admin/appointments", { params });
        return res.data;
    },

    /** Alias cho Dashboard / AppointmentsAdmin */
    getAppointments: async (params = {}) => {
        const res = await api.get("/admin/appointments", { params });
        return res.data;
    },

    getAllReviews: async (page = 0, size = 10) => {
        const res = await api.get("/admin/reviews", { params: { page, size } });
        return res.data;
    },

    hideReview: async (reviewId) => {
        const res = await api.patch(`/admin/reviews/${reviewId}/hide`);
        return res.data;
    },

    analyzeReview: async (comment) => {
        const res = await api.post('/admin/moderation/analyze', { comment });
        return res.data;
    }
};

export default adminService;
