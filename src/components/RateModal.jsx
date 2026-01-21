import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import rateService from '../services/rate.service';
import { useLoading } from '../context/LoadingContext';

export const RateModal = ({ isOpen, onClose, rate, onSuccess }) => {
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    origin: {
      city: '',
      province: ''
    },
    destination: {
      city: '',
      province: ''
    },
    pricePerKm: '',
    pricePerTon: '',
    basePrice: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (rate) {
      setFormData({
        origin: {
          city: rate.origin?.city || '',
          province: rate.origin?.province || ''
        },
        destination: {
          city: rate.destination?.city || '',
          province: rate.destination?.province || ''
        },
        pricePerKm: rate.pricePerKm || '',
        pricePerTon: rate.pricePerTon || '',
        basePrice: rate.basePrice || '',
        notes: rate.notes || ''
      });
    } else {
      setFormData({
        origin: {
          city: '',
          province: ''
        },
        destination: {
          city: '',
          province: ''
        },
        pricePerKm: '',
        pricePerTon: '',
        basePrice: '',
        notes: ''
      });
    }
    setError('');
  }, [rate, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('origin.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        origin: {
          ...prev.origin,
          [field]: value
        }
      }));
    } else if (name.startsWith('destination.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        destination: {
          ...prev.destination,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      showLoading(rate ? 'Actualizando tarifa...' : 'Creando tarifa...');
      if (rate) {
        await rateService.update(rate._id, formData);
      } else {
        await rateService.create(formData);
      }
      hideLoading();
      onSuccess();
      onClose();
    } catch (err) {
      hideLoading();
      setError(err.response?.data?.message || 'Error al guardar la tarifa');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {rate ? 'Editar Tarifa' : 'Nueva Tarifa'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Precios */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Tarifas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio por Km
                </label>
                <input
                  type="number"
                  name="pricePerKm"
                  value={formData.pricePerKm}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio por Tonelada
                </label>
                <input
                  type="number"
                  name="pricePerTon"
                  value={formData.pricePerTon}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Base
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
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
              placeholder="Información adicional sobre esta tarifa..."
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
