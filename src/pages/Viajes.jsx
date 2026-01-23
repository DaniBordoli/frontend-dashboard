import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, Truck, MapPin, Calendar, Package, Send, Navigation } from 'lucide-react';
import tripService from '../services/trip.service';
import { TripModal } from '../components/TripModal';
import { SendOfferModal } from '../components/SendOfferModal';
import { TrackingModal } from '../components/TrackingModal';
import { useLoading } from '../context/LoadingContext';
import { useToast } from '../context/ToastContext';
import { TRIP_STATUS } from '../constants';

export const Viajes = () => {
  const { showLoading, hideLoading } = useLoading();
  const { success, error: showError } = useToast();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [sendOfferModal, setSendOfferModal] = useState(null);
  const [trackingModal, setTrackingModal] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [searchTerm, statusFilter, trips]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getAll();
      console.log('🚚 TRIPS CARGADOS:', data);
      if (data.length > 0) {
        console.log('📋 PRIMER TRIP:', data[0]);
        console.log('👤 PRODUCTOR:', data[0].producer);
        console.log('🚛 TRANSPORTISTA:', data[0].transportista);
      }
      setTrips(data);
    } catch (error) {
      console.error('Error al cargar viajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = trips;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.tripNumber?.toLowerCase().includes(term) ||
        t.origin?.city?.toLowerCase().includes(term) ||
        t.destination?.city?.toLowerCase().includes(term) ||
        t.producer?.companyName?.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    setFilteredTrips(filtered);
  };

  const handleCreate = () => {
    setSelectedTrip(null);
    setIsModalOpen(true);
  };

  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleSendOffer = (trip) => {
    setSendOfferModal(trip);
  };

  const handleOfferSent = (result) => {
    // Ya no se necesita porque el toast se muestra en SendOfferModal
    loadTrips();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este viaje?')) {
      return;
    }

    try {
      showLoading('Eliminando viaje...');
      await tripService.delete(id);
      await loadTrips();
      hideLoading();
      success('Viaje eliminado exitosamente');
    } catch (error) {
      hideLoading();
      console.error('Error al eliminar viaje:', error);
      showError('Error al eliminar el viaje');
    }
  };

  const handleModalSuccess = () => {
    loadTrips();
  };

  const getSubStatusLabel = (subStatus) => {
    const subStatusLabels = {
      'llegue_a_cargar': '🚚 Llegué a cargar',
      'cargado_saliendo': '📦 Cargado, saliendo',
      'en_camino': '🛣️ En camino',
      'llegue_a_destino': '📍 Llegué a destino',
      'descargado': '✅ Descargado'
    };
    return subStatusLabels[subStatus] || null;
  };

  const getStatusBadge = (status, subStatus) => {
    const statusConfig = {
      [TRIP_STATUS.SOLICITADO]: { color: 'bg-blue-100 text-blue-800', label: 'Solicitado' },
      [TRIP_STATUS.COTIZANDO]: { color: 'bg-yellow-100 text-yellow-800', label: 'Cotizando' },
      [TRIP_STATUS.CONFIRMADO]: { color: 'bg-green-100 text-green-800', label: 'Confirmado' },
      [TRIP_STATUS.EN_ASIGNACION]: { color: 'bg-purple-100 text-purple-800', label: 'En Asignación' },
      [TRIP_STATUS.EN_CURSO]: { color: 'bg-indigo-100 text-indigo-800', label: 'En Curso' },
      [TRIP_STATUS.FINALIZADO]: { color: 'bg-gray-100 text-gray-800', label: 'Finalizado' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    const subLabel = getSubStatusLabel(subStatus);
    
    return (
      <div className="flex flex-col gap-1">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
        {subLabel && (
          <span className="text-xs text-gray-600">
            {subLabel}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Viajes</h1>
          <p className="text-gray-600 mt-1">Gestión de viajes y logística</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Nuevo Viaje
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número, ciudad o productor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1 rounded-lg text-sm ${!statusFilter ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter(TRIP_STATUS.SOLICITADO)}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === TRIP_STATUS.SOLICITADO ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Solicitado
            </button>
            <button
              onClick={() => setStatusFilter(TRIP_STATUS.COTIZANDO)}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === TRIP_STATUS.COTIZANDO ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Cotizando
            </button>
            <button
              onClick={() => setStatusFilter(TRIP_STATUS.EN_CURSO)}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === TRIP_STATUS.EN_CURSO ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              En Curso
            </button>
            <button
              onClick={() => setStatusFilter(TRIP_STATUS.FINALIZADO)}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === TRIP_STATUS.FINALIZADO ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Finalizado
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Viaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transportista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No se encontraron viajes</p>
                    <p className="text-sm">
                      {searchTerm || statusFilter ? 'Intenta con otros filtros' : 'Comienza creando un nuevo viaje'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{trip.tripNumber}</div>
                          <div className="text-xs text-gray-500">{trip.destinationType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {trip.producer?.nombreContacto || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {trip.transportista?.nombreConductor || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <div className="text-gray-900">{trip.origin?.city}, {trip.origin?.province}</div>
                          <div className="text-gray-500">→ {trip.destination?.city}, {trip.destination?.province}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-900">
                          {new Date(trip.scheduledDate).toLocaleDateString('es-AR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{trip.weight} tn</div>
                        <div className="text-xs text-gray-500">{trip.requestedTrucks} camiones</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(trip.status, trip.subStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {trip.status === 'en_curso' && trip.trackingActivo && (
                          <button
                            onClick={() => setTrackingModal(trip)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="Ver tracking en vivo"
                          >
                            <Navigation className="w-5 h-5" />
                          </button>
                        )}
                        {(trip.status === 'solicitado' || trip.status === 'cotizando' || trip.status === 'en_asignacion') && (
                          <button
                            onClick={() => handleSendOffer(trip)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Enviar oferta por WhatsApp"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(trip)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(trip._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredTrips.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando {filteredTrips.length} de {trips.length} viajes
            </p>
          </div>
        )}
      </div>

      <TripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trip={selectedTrip}
        onSuccess={handleModalSuccess}
      />

      {sendOfferModal && (
        <SendOfferModal
          trip={sendOfferModal}
          onClose={() => setSendOfferModal(null)}
          onSuccess={handleOfferSent}
        />
      )}

      {trackingModal && (
        <TrackingModal
          viaje={trackingModal}
          onClose={() => setTrackingModal(null)}
        />
      )}
    </div>
  );
};
