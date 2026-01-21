import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import tripService from '../services/trip.service';
import { useLoading } from '../context/LoadingContext';

export const TripModal = ({ isOpen, onClose, trip, onSuccess }) => {
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    origin: {
      address: '',
      city: '',
      province: ''
    },
    destination: {
      address: '',
      city: '',
      province: ''
    },
    destinationType: 'puerto',
    scheduledDate: '',
    cargoType: 'grano',
    weight: '',
    recommendedTrucks: '',
    requestedTrucks: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (trip) {
      setFormData({
        origin: {
          address: trip.origin?.address || '',
          city: trip.origin?.city || '',
          province: trip.origin?.province || ''
        },
        destination: {
          address: trip.destination?.address || '',
          city: trip.destination?.city || '',
          province: trip.destination?.province || ''
        },
        destinationType: trip.destinationType || 'puerto',
        scheduledDate: trip.scheduledDate ? new Date(trip.scheduledDate).toISOString().slice(0, 16) : '',
        cargoType: trip.cargoType || 'grano',
        weight: trip.weight || '',
        recommendedTrucks: trip.recommendedTrucks || '',
        requestedTrucks: trip.requestedTrucks || '',
        notes: trip.notes || ''
      });
    } else {
      setFormData({
        origin: { address: '', city: '', province: '' },
        destination: { address: '', city: '', province: '' },
        destinationType: 'puerto',
        scheduledDate: '',
        cargoType: 'grano',
        weight: '',
        recommendedTrucks: '',
        requestedTrucks: '',
        notes: ''
      });
    }
    setError('');
  }, [trip, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('origin.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        origin: { ...prev.origin, [field]: value }
      }));
    } else if (name.startsWith('destination.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        destination: { ...prev.destination, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      showLoading(trip ? 'Actualizando viaje...' : 'Creando viaje...');
      
      const submitData = {
        ...formData,
        weight: parseFloat(formData.weight),
        recommendedTrucks: parseInt(formData.recommendedTrucks),
        requestedTrucks: parseInt(formData.requestedTrucks)
      };

      if (trip) {
        await tripService.update(trip._id, submitData);
      } else {
        await tripService.create(submitData);
      }
      
      hideLoading();
      onSuccess();
      onClose();
    } catch (err) {
      hideLoading();
      setError(err.response?.data?.message || 'Error al guardar el viaje');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {trip ? 'Editar Viaje' : 'Nuevo Viaje'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Origen */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Origen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="origin.address"
                  value={formData.origin.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="origin.city"
                  value={formData.origin.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia *
                </label>
                <input
                  type="text"
                  name="origin.province"
                  value={formData.origin.province}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Destino */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Destino</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="destination.address"
                  value={formData.destination.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="destination.city"
                  value={formData.destination.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia *
                </label>
                <input
                  type="text"
                  name="destination.province"
                  value={formData.destination.province}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Destino *
              </label>
              <select
                name="destinationType"
                value={formData.destinationType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="puerto">Puerto</option>
                <option value="acopio">Acopio</option>
              </select>
            </div>
          </div>

          {/* Detalles del Viaje */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Detalles del Viaje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Programada *
                </label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Carga
                </label>
                <input
                  type="text"
                  name="cargoType"
                  value={formData.cargoType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (toneladas) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Camiones Recomendados *
                </label>
                <input
                  type="number"
                  name="recommendedTrucks"
                  value={formData.recommendedTrucks}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Camiones Solicitados *
                </label>
                <input
                  type="number"
                  name="requestedTrucks"
                  value={formData.requestedTrucks}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Información adicional sobre el viaje..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
