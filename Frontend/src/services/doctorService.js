import api from './api';
import { DOCTORS_DATA } from '../utils/constants';

export const doctorService = {
    getDoctors: async (params) => {
        try {
            const response = await apiClient.get('/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            let mockData = DOCTORS_DATA;
            if(params && params.specialty) {
                mockData = mockData.filter(doc => doc.specialty === params.specialty);
            }
            return mockData;
        }
    },

    // getDoctorDetail: async (id) => {
    //     try {
    //         const response = await apiClient.get(`/${id}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error(`Error fetching detail for doctor ${id}:`, error);
    //         throw error;
    //     }
    // },

    // getDoctorReviews: async (id, page = 0) => {
    //     try {
    //         const response = await apiClient.get(`/${id}/reviews`, {
    //             params: { page }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error(`Error fetching reviews for doctor ${id}:`, error);
    //         throw error;
    //     }
    // },

    // getAvailableSlots: async (id, date) => {
    //     try {
    //         const response = await apiClient.get(`/${id}/slots`, {
    //             params: { date }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error(`Error fetching slots for doctor ${id} on ${date}:`, error);
    //         throw error;
    //     }
    // }
};