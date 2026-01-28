import { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';
import camionService from '../services/camion.service';
import { useLoading } from '../context/LoadingContext';

export const AssignCamionModal = ({ isOpen, onClose, transportista, onSuccess }) => {
  const { showLoading, hideLoading } = useLoading();
  const [availableCamiones, setAvailableCamiones] = useState([]);
  const [selectedCamion, setSelectedCamion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && transportista) {
      loadAvailableCamiones();
    }
  }, [isOpen, transportista]);

  const loadAvailableCamiones = async () => {
    try {
      const allCamiones = await camionService.getAll();
      setAvailableCamiones(allCamiones);
      setSelectedCamion('');
      setError('');
    } catch (error) {
      console.error('Error al cargar camiones:', error);
      setError('Error al cargar la lista de camiones');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    
    if (!selectedCamion) {
      setError('Debe seleccionar un camión');
      return;
    }

    try {
      showLoading('Asignando camión...');
      await camionService.assignToTransportista(selectedCamion, transportista._id);
      hideLoading();
      onSuccess();
      onClose();
    } catch (err) {
      hideLoading();
      setError(err.response?.data?.message || 'Error al asignar el camión');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Asignar Camión
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600 mb-4">
              Asignar camión a: <span className="font-medium text-gray-900">{transportista?.companyName}</span>
            </p>

            {transportista?.camiones && transportista.camiones.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Camión actual asignado:
                </p>
                <p className="text-sm text-yellow-900">
                  {transportista.camiones[0].patente} - {transportista.camiones[0].marca} {transportista.camiones[0].modelo}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  ⚠️ Al asignar un nuevo camión, el actual será desasignado automáticamente.
                </p>
              </div>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Camión *
            </label>
            <select
              value={selectedCamion}
              onChange={(e) => setSelectedCamion(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Seleccionar camión --</option>
              {availableCamiones.map((camion) => (
                <option key={camion._id} value={camion._id}>
                  {camion.patente} - {camion.marca} {camion.modelo} 
                  {camion.transportista?.razonSocial && 
                    ` (Asignado a: ${camion.transportista.razonSocial})`
                  }
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Solo se puede asignar un camión por transportista.
            </p>
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
              Asignar Camión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
