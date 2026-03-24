import api from './api';
import { DOCTORS_DATA } from '../utils/constants';

export const doctorService = {
    getDoctors: async (params) => {
        try {
            const response = await apiClient.get('/doctors', { params });
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

    //------------------------------MOI--------------------------------------------------
     getDoctorDetail: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching detail for doctor ${id}:`, error);
      // Fallback mock khi chưa có backend
      const found = DOCTORS_DATA.find(d => String(d.id) === String(id));
      if (found) return found;
      throw error;
    }
  },
 
  getDoctorReviews: async (id, page = 0) => {
    try {
      const response = await api.get(`/doctors/${id}/reviews`, { params: { page } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for doctor ${id}:`, error);
      return [];
    }
  },
 
  getAvailableSlots: async (id, date) => {
    try {
      const response = await api.get(`/doctors/${id}/slots`, { params: { date } });
      return Array.isArray(response.data)
        ? response.data
        : response.data.content ?? [];
    } catch (error) {
      console.error(`Error fetching slots for doctor ${id} on ${date}:`, error);
      // Fallback mock slots khi chưa có backend
      return [
        { id: 1, startTime: '10:00', status: 'AVAILABLE' },
        { id: 2, startTime: '10:30', status: 'AVAILABLE' },
        { id: 3, startTime: '11:00', status: 'BOOKED'    },
        { id: 4, startTime: '11:30', status: 'AVAILABLE' },
        { id: 5, startTime: '12:00', status: 'AVAILABLE' },
        { id: 6, startTime: '13:00', status: 'AVAILABLE' },
        { id: 7, startTime: '13:30', status: 'BOOKED'    },
        { id: 8, startTime: '14:00', status: 'AVAILABLE' },
      ];
    }
  },
 
  bookAppointment: async (slotId) => {
    const response = await api.post('/patient/appointments', { slotId });
    return response.data;
  },
 
  getMyAppointments: async () => {
    const response = await api.get('/patient/appointments/history');
    return response.data;
  },
 
  cancelAppointment: async (appointmentId) => {
    const response = await api.put(`/patient/appointments/${appointmentId}/cancel`);
    return response.data;
  },
};