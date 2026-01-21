import api from './api';

// Mapear campos del frontend (inglés) al backend (español)
const mapToBackend = (data) => ({
  razonSocial: data.companyName,
  cuit: data.cuit,
  nombreConductor: data.driverName,
  licenciaConductor: data.driverLicense,
  patente: data.licensePlate,
  capacidad: data.capacity,
  telefono: data.phone,
  email: data.email,
  notas: data.notes
});

// Mapear campos del backend (español) al frontend (inglés)
const mapToFrontend = (data) => ({
  _id: data._id,
  companyName: data.razonSocial,
  cuit: data.cuit,
  driverName: data.nombreConductor,
  driverLicense: data.licenciaConductor,
  licensePlate: data.patente,
  capacity: data.capacidad,
  phone: data.telefono,
  email: data.email,
  notes: data.notas,
  isActive: data.activo,
  isAvailable: data.disponible,
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
