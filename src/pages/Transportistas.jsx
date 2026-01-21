import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Power, PowerOff, Truck } from 'lucide-react';
import transportistaService from '../services/transportista.service';
import { TransportistaModal } from '../components/TransportistaModal';
import { useLoading } from '../context/LoadingContext';

export const Transportistas = () => {
  const { showLoading, hideLoading } = useLoading();
  const [transportistas, setTransportistas] = useState([]);
  const [filteredTransportistas, setFilteredTransportistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransportista, setSelectedTransportista] = useState(null);

  useEffect(() => {
    loadTransportistas();
  }, []);

  useEffect(() => {
    filterTransportistas();
  }, [searchTerm, transportistas]);

  const loadTransportistas = async () => {
    try {
      setLoading(true);
      const data = await transportistaService.getAll();
      setTransportistas(data);
    } catch (error) {
      console.error('Error al cargar transportistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransportistas = () => {
    if (!searchTerm) {
      setFilteredTransportistas(transportistas);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = transportistas.filter(t =>
      t.companyName?.toLowerCase().includes(term) ||
      t.driverName?.toLowerCase().includes(term) ||
      t.cuit?.toLowerCase().includes(term) ||
      t.licensePlate?.toLowerCase().includes(term)
    );
    setFilteredTransportistas(filtered);
  };

  const handleCreate = () => {
    setSelectedTransportista(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transportista) => {
    setSelectedTransportista(transportista);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este transportista?')) {
      return;
    }

    try {
      showLoading('Eliminando transportista...');
      await transportistaService.delete(id);
      await loadTransportistas();
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error('Error al eliminar transportista:', error);
      alert('Error al eliminar el transportista');
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      showLoading('Actualizando disponibilidad...');
      await transportistaService.toggleAvailability(id);
      await loadTransportistas();
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error('Error al cambiar disponibilidad:', error);
      alert('Error al cambiar la disponibilidad');
    }
  };

  const handleModalSuccess = () => {
    loadTransportistas();
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
          <h1 className="text-2xl font-bold text-gray-900">Transportistas</h1>
          <p className="text-gray-600 mt-1">Gestión de transportistas y vehículos</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Nuevo Transportista
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por razón social, conductor, CUIT o patente..."
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
                  Razón Social
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conductor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
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
              {filteredTransportistas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No se encontraron transportistas</p>
                    <p className="text-sm">
                      {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando un nuevo transportista'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransportistas.map((transportista) => (
                  <tr key={transportista._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{transportista.companyName}</div>
                        <div className="text-sm text-gray-500">CUIT: {transportista.cuit}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">{transportista.driverName}</div>
                        <div className="text-xs text-gray-500">Lic: {transportista.driverLicense}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transportista.licensePlate}</div>
                        <div className="text-xs text-gray-500">
                          {transportista.capacity} tn
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{transportista.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transportista.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transportista.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transportista.isAvailable
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transportista.isAvailable ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleAvailability(transportista._id)}
                          className={`p-2 rounded-lg ${
                            transportista.isAvailable
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                          title={transportista.isAvailable ? 'Marcar como no disponible' : 'Marcar como disponible'}
                        >
                          {transportista.isAvailable ? (
                            <PowerOff className="w-5 h-5" />
                          ) : (
                            <Power className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(transportista)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(transportista._id)}
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

        {filteredTransportistas.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando {filteredTransportistas.length} de {transportistas.length} transportistas
            </p>
          </div>
        )}
      </div>

      <TransportistaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transportista={selectedTransportista}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};
