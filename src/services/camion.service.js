import api from './api';

const mapToBackend = (data) => ({
  transportista: data.transportistaId,
  patente: data.patente,
  marca: data.marca,
  modelo: data.modelo,
  año: data.año,
  tipo: data.tipo,
  capacidad: data.capacidad,
  unidadCapacidad: data.unidadCapacidad,
  seguro: data.seguro,
  vtv: data.vtv,
  disponible: data.disponible,
  activo: data.activo,
  notas: data.notas
});

const mapToFrontend = (data) => ({
  _id: data._id,
  transportistaId: data.transportista?._id || data.transportista,
  transportista: data.transportista,
  patente: data.patente,
  marca: data.marca,
  modelo: data.modelo,
  año: data.año,
  tipo: data.tipo,
  capacidad: data.capacidad,
  unidadCapacidad: data.unidadCapacidad,
  seguro: data.seguro || {},
  vtv: data.vtv || {},
  disponible: data.disponible,
  activo: data.activo,
  notas: data.notas,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});

const camionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/camiones', { params });
    const camiones = response.data.camiones || [];
    return camiones.map(mapToFrontend);
  },

  getById: async (id) => {
    const response = await api.get(`/camiones/${id}`);
    return mapToFrontend(response.data);
  },

  getByTransportista: async (transportistaId) => {
    const response = await api.get(`/camiones/transportista/${transportistaId}`);
    const camiones = response.data.camiones || [];
    return camiones.map(mapToFrontend);
  },

  create: async (data) => {
    const backendData = mapToBackend(data);
    const response = await api.post('/camiones', backendData);
    return response.data;
  },

  update: async (id, data) => {
    const backendData = mapToBackend(data);
    const response = await api.put(`/camiones/${id}`, backendData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/camiones/${id}`);
    return response.data;
  },

  toggleDisponibilidad: async (id) => {
    const response = await api.patch(`/camiones/${id}/toggle-disponibilidad`);
    return response.data;
  },

  assignToTransportista: async (camionId, transportistaId) => {
    const response = await api.patch(`/camiones/${camionId}/assign`, { transportistaId });
    return response.data;
  }
};

export default camionService;
