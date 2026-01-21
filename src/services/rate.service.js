import api from './api';

// Mapear campos del frontend (inglés) al backend (español)
const mapToBackend = (data) => ({
  origen: {
    ciudad: data.origin?.city,
    provincia: data.origin?.province
  },
  destino: {
    ciudad: data.destination?.city,
    provincia: data.destination?.province
  },
  precioBase: data.basePrice,
  precioPorKm: data.pricePerKm,
  precioPorTonelada: data.pricePerTon,
  notas: data.notes
});

// Mapear campos del backend (español) al frontend (inglés)
const mapToFrontend = (data) => ({
  _id: data._id,
  origin: {
    city: data.origen?.ciudad,
    province: data.origen?.provincia
  },
  destination: {
    city: data.destino?.ciudad,
    province: data.destino?.provincia
  },
  basePrice: data.precioBase,
  pricePerKm: data.precioPorKm,
  pricePerTon: data.precioPorTonelada,
  notes: data.notas,
  isActive: data.activo,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});

const rateService = {
  getAll: async (params = {}) => {
    const response = await api.get('/rates', { params });
    const rates = response.data.rates || [];
    return rates.map(mapToFrontend);
  },

  getById: async (id) => {
    const response = await api.get(`/rates/${id}`);
    const rate = response.data.rate || response.data;
    return mapToFrontend(rate);
  },

  create: async (data) => {
    const backendData = mapToBackend(data);
    const response = await api.post('/rates', backendData);
    return response.data;
  },

  update: async (id, data) => {
    const backendData = mapToBackend(data);
    const response = await api.put(`/rates/${id}`, backendData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/rates/${id}`);
    return response.data;
  },

  calculatePrice: async (data) => {
    const backendData = {
      origen: data.origin,
      destino: data.destination,
      distancia: data.distance,
      peso: data.weight
    };
    const response = await api.post('/rates/calculate', backendData);
    return response.data;
  }
};

export default rateService;
