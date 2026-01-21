import api from './api';

const whatsappService = {
  sendTripOffer: async (tripId, transportistaIds = []) => {
    const response = await api.post('/whatsapp/send-offer', {
      tripId,
      transportistaIds: transportistaIds.length > 0 ? transportistaIds : undefined
    });
    return response.data;
  },

  sendCheckInReminder: async (tripId) => {
    const response = await api.post('/whatsapp/send-reminder', { tripId });
    return response.data;
  },

  sendTripUpdate: async (tripId, message) => {
    const response = await api.post('/whatsapp/send-update', { tripId, message });
    return response.data;
  }
};

export default whatsappService;
