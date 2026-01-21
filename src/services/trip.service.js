import api from './api';

// Mapear campos del frontend (inglés) al backend (español)
const mapToBackend = (data) => ({
  productor: data.producer,
  origen: {
    direccion: data.origin?.address,
    ciudad: data.origin?.city,
    provincia: data.origin?.province,
    coordenadas: data.origin?.coordinates ? {
      latitud: data.origin.coordinates.latitude,
      longitud: data.origin.coordinates.longitude
    } : undefined
  },
  destino: {
    direccion: data.destination?.address,
    ciudad: data.destination?.city,
    provincia: data.destination?.province,
    coordenadas: data.destination?.coordinates ? {
      latitud: data.destination.coordinates.latitude,
      longitud: data.destination.coordinates.longitude
    } : undefined
  },
  tipoDestino: data.destinationType,
  fechaProgramada: data.scheduledDate,
  ventanaFecha: data.dateWindow ? {
    inicio: data.dateWindow.start,
    fin: data.dateWindow.end
  } : undefined,
  tipoCarga: data.cargoType || 'grano',
  peso: data.weight,
  camionesRecomendados: data.recommendedTrucks,
  camionesSolicitados: data.requestedTrucks,
  notas: data.notes
});

// Mapear campos del backend (español) al frontend (inglés)
const mapToFrontend = (data) => ({
  _id: data._id,
  tripNumber: data.numeroViaje,
  producer: data.productor,
  origin: {
    address: data.origen?.direccion,
    city: data.origen?.ciudad,
    province: data.origen?.provincia,
    coordinates: data.origen?.coordenadas ? {
      latitude: data.origen.coordenadas.latitud,
      longitude: data.origen.coordenadas.longitud
    } : undefined
  },
  destination: {
    address: data.destino?.direccion,
    city: data.destino?.ciudad,
    province: data.destino?.provincia,
    coordinates: data.destino?.coordenadas ? {
      latitude: data.destino.coordenadas.latitud,
      longitude: data.destino.coordenadas.longitud
    } : undefined
  },
  destinationType: data.tipoDestino,
  scheduledDate: data.fechaProgramada,
  dateWindow: data.ventanaFecha ? {
    start: data.ventanaFecha.inicio,
    end: data.ventanaFecha.fin
  } : undefined,
  cargoType: data.tipoCarga,
  weight: data.peso,
  recommendedTrucks: data.camionesRecomendados,
  requestedTrucks: data.camionesSolicitados,
  notes: data.notas,
  status: data.estado,
  pricing: data.precios ? {
    basePrice: data.precios.precioBase,
    proposedPrice: data.precios.precioPropuesto,
    confirmedPrice: data.precios.precioConfirmado,
    finalPrice: data.precios.precioFinal
  } : undefined,
  transportista: data.transportista,
  checkIns: data.checkIns?.map(ci => ({
    type: ci.tipo,
    timestamp: ci.fechaHora,
    location: ci.ubicacion ? {
      latitude: ci.ubicacion.latitud,
      longitude: ci.ubicacion.longitud
    } : undefined,
    notes: ci.notas
  })),
  currentLocation: data.ubicacionActual ? {
    latitude: data.ubicacionActual.latitud,
    longitude: data.ubicacionActual.longitud,
    lastUpdate: data.ubicacionActual.ultimaActualizacion
  } : undefined,
  distance: data.distancia,
  estimatedDuration: data.duracionEstimada,
  statusHistory: data.historialEstados?.map(h => ({
    status: h.estado,
    changedBy: h.cambiadoPor,
    changedAt: h.cambiadoEn,
    notes: h.notas
  })),
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});

const tripService = {
  getAll: async (params = {}) => {
    const response = await api.get('/trips', { params });
    const trips = response.data.trips || [];
    return trips.map(mapToFrontend);
  },

  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    const trip = response.data.trip || response.data;
    return mapToFrontend(trip);
  },

  create: async (data) => {
    const backendData = mapToBackend(data);
    const response = await api.post('/trips', backendData);
    return response.data;
  },

  update: async (id, data) => {
    const backendData = mapToBackend(data);
    const response = await api.put(`/trips/${id}`, backendData);
    return response.data;
  },

  updateStatus: async (id, status, notes) => {
    const response = await api.patch(`/trips/${id}/status`, { status, notes });
    return response.data;
  },

  assignTransportista: async (id, transportistaId) => {
    const response = await api.post(`/trips/${id}/assign`, { transportistaId });
    return response.data;
  },

  addCheckIn: async (id, checkInData) => {
    const backendData = {
      type: checkInData.type,
      location: checkInData.location ? {
        latitude: checkInData.location.latitude,
        longitude: checkInData.location.longitude
      } : undefined,
      notes: checkInData.notes
    };
    const response = await api.post(`/trips/${id}/checkin`, backendData);
    return response.data;
  },

  updateLocation: async (id, latitude, longitude) => {
    const response = await api.patch(`/trips/${id}/location`, { latitude, longitude });
    return response.data;
  }
};

export default tripService;
