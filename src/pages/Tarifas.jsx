import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, DollarSign, MapPin } from 'lucide-react';
import rateService from '../services/rate.service';
import { RateModal } from '../components/RateModal';
import { useLoading } from '../context/LoadingContext';

export const Tarifas = () => {
  const { showLoading, hideLoading } = useLoading();
  const [rates, setRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);

  useEffect(() => {
    loadRates();
  }, []);

  useEffect(() => {
    filterRates();
  }, [searchTerm, rates]);

  const loadRates = async () => {
    try {
      setLoading(true);
      const data = await rateService.getAll();
      setRates(data);
    } catch (error) {
      console.error('Error al cargar tarifas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRates = () => {
    if (!searchTerm) {
      setFilteredRates(rates);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = rates.filter(r =>
      r.origin?.city?.toLowerCase().includes(term) ||
      r.origin?.province?.toLowerCase().includes(term) ||
      r.destination?.city?.toLowerCase().includes(term) ||
      r.destination?.province?.toLowerCase().includes(term)
    );
    setFilteredRates(filtered);
  };

  const handleCreate = () => {
    setSelectedRate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rate) => {
    setSelectedRate(rate);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarifa?')) {
      return;
    }

    try {
      showLoading('Eliminando tarifa...');
      await rateService.delete(id);
      await loadRates();
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error('Error al eliminar tarifa:', error);
      alert('Error al eliminar la tarifa');
    }
  };

  const handleModalSuccess = () => {
    loadRates();
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
          <h1 className="text-2xl font-bold text-gray-900">Tarifas</h1>
          <p className="text-gray-600 mt-1">Gestión de tarifas por ruta</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Nueva Tarifa
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por ciudad o provincia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio/Km
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio/Tn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Base
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No se encontraron tarifas</p>
                    <p className="text-sm">
                      {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando una nueva tarifa'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRates.map((rate) => (
                  <tr key={rate._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{rate.origin.city}</div>
                          <div className="text-xs text-gray-500">{rate.origin.province}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{rate.destination.city}</div>
                          <div className="text-xs text-gray-500">{rate.destination.province}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {rate.pricePerKm ? `$${rate.pricePerKm.toFixed(2)}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {rate.pricePerTon ? `$${rate.pricePerTon.toFixed(2)}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {rate.basePrice ? `$${rate.basePrice.toFixed(2)}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(rate)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rate._id)}
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

        {filteredRates.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando {filteredRates.length} de {rates.length} tarifas
            </p>
          </div>
        )}
      </div>

      <RateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rate={selectedRate}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};
