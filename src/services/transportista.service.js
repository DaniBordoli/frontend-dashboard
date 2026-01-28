import api from './api';

// Mapear campos del frontend (inglés) al backend (español)
const mapToBackend = (data) => ({
  razonSocial: data.companyName,
  nombre: data.name,
  cuit: data.cuit,
  numeroWhatsapp: data.whatsappNumber,
  email: data.email,
  notas: data.notes
});

// Mapear campos del backend (español) al frontend (inglés)
const mapToFrontend = (data) => ({
  _id: data._id,
  companyName: data.razonSocial,
  name: data.nombre,
  cuit: data.cuit,
  whatsappNumber: data.numeroWhatsapp,
  email: data.email,
  notes: data.notas,
  active: data.activo,
  available: data.disponible,
  isActive: data.activo,
  isAvailable: data.disponible,
  camiones: data.camiones || [],
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});

const transportistaService = {
  getAll: async (params = {}) => {
    const response = await api.get('/transportistas', { params });
    const transportistas = Array.isArray(response.data) ? response.data : [];
    return transportistas.map(mapToFrontend);
  },

  getById: async (id) => {
    const response = await api.get(`/transportistas/${id}`);
    return mapToFrontend(response.data);
  },

  create: async (data) => {
    const backendData = mapToBackend(data);
    const response = await api.post('/transportistas', backendData);
    return response.data;
  },

  update: async (id, data) => {
    const backendData = mapToBackend(data);
    const response = await api.put(`/transportistas/${id}`, backendData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transportistas/${id}`);
    return response.data;
  },

  toggleAvailability: async (id) => {
    const response = await api.patch(`/transportistas/${id}/toggle-availability`);
    return response.data;
  }
};

export default transportistaService;
