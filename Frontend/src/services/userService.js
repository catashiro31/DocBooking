import api from './api';

export const userService = {
    getProfile: async () => {
        const res = await api.get('/user/profile');
        return res.data;
    },
    updateProfile: async (formData) => {
        const res = await api.put('/user/profile', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },
    changePassword: async (data) => {
        const res = await api.put('/user/password', data);
        return res.data;
    }
};

export default userService;
