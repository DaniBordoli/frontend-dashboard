import api from './api';

// Mapear campos del frontend (inglés) al backend (español)
const mapToBackend = (data) => {
  const mapped = {
    razonSocial: data.companyName,
    cuit: data.cuit,
    direccion: {
      calle: data.address?.street,
      ciudad: data.address?.city,
      provincia: data.address?.province,
      codigoPostal: data.address?.zipCode
    },
    nombreContacto: data.contactName,
    emailContacto: data.email,
    telefonoContacto: data.phone,
    numeroWhatsapp: data.phone,
    notas: data.notes
  };
  
  // Incluir password si existe (para crear usuario)
  if (data.password) {
    mapped.password = data.password;
  }
  
  return mapped;
};

// Mapear campos del backend (español) al frontend (inglés)
const mapToFrontend = (data) => ({
  _id: data._id,
  companyName: data.razonSocial,
  cuit: data.cuit,
  address: {
    street: data.direccion?.calle,
    city: data.direccion?.ciudad,
    province: data.direccion?.provincia,
    zipCode: data.direccion?.codigoPostal
  },
  contactName: data.nombreContacto,
  email: data.emailContacto,
  phone: data.telefonoContacto,
  notes: data.notas,
  isActive: data.activo,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});

export const producerService = {
  getAll: async () => {
    const response = await api.get('/productores');
    const producers = response.data.producers || [];
    return producers.map(mapToFrontend);
  },

  getById: async (id) => {
    const response = await api.get(`/productores/${id}`);
    const producer = response.data.producer || response.data;
    return mapToFrontend(producer);
  },

  create: async (data) => {
    const backendData = mapToBackend(data);
    const response = await api.post('/productores', backendData);
    return response.data;
  },

  update: async (id, data) => {
    const backendData = mapToBackend(data);
    const response = await api.put(`/productores/${id}`, backendData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/productores/${id}`);
    return response.data;
  },

  createAccess: async (id, email, password) => {
    const response = await api.post(`/productores/${id}/create-access`, {
      email,
      password
    });
    return response.data;
  },
};
