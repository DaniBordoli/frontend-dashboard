import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Power, PowerOff, Truck, Filter } from 'lucide-react';
import camionService from '../services/camion.service';
import transportistaService from '../services/transportista.service';
import { CamionModal } from '../components/CamionModal';
import { useLoading } from '../context/LoadingContext';

export const Camiones = () => {
  const { showLoading, hideLoading } = useLoading();
  const [camiones, setCamiones] = useState([]);
  const [transportistas, setTransportistas] = useState([]);
  const [filteredCamiones, setFilteredCamiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTransportista, setFilterTransportista] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterDisponible, setFilterDisponible] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCamion, setSelectedCamion] = useState(null);

  const tiposCamion = [
    { value: 'chasis', label: 'Chasis' },
    { value: 'acoplado', label: 'Acoplado' },
    { value: 'batea', label: 'Batea' },
    { value: 'tolva', label: 'Tolva' },
    { value: 'tanque', label: 'Tanque' },
    { value: 'otro', label: 'Otro' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCamiones();
  }, [searchTerm, filterTransportista, filterTipo, filterDisponible, camiones]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [camionesData, transportistasData] = await Promise.all([
        camionService.getAll(),
        transportistaService.getAll()
      ]);
      setCamiones(camionesData);
      setTransportistas(transportistasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCamiones = () => {
    let filtered = [...camiones];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.patente?.toLowerCase().includes(term) ||
        c.marca?.toLowerCase().includes(term) ||
        c.modelo?.toLowerCase().includes(term) ||
        c.transportista?.razonSocial?.toLowerCase().includes(term)
      );
    }

    if (filterTransportista) {
      filtered = filtered.filter(c => c.transportistaId === filterTransportista);
    }

    if (filterTipo) {
      filtered = filtered.filter(c => c.tipo === filterTipo);
    }

    if (filterDisponible !== '') {
      const disponible = filterDisponible === 'true';
      filtered = filtered.filter(c => c.disponible === disponible);
    }

    setFilteredCamiones(filtered);
  };

  const handleCreate = () => {
    setSelectedCamion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (camion) => {
    setSelectedCamion(camion);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este camión?')) {
      return;
    }

    try {
      showLoading('Eliminando camión...');
      await camionService.delete(id);
      await loadData();
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error('Error al eliminar camión:', error);
      alert('Error al eliminar el camión');
    }
  };

  const handleToggleDisponibilidad = async (id) => {
    try {
      showLoading('Actualizando disponibilidad...');
      await camionService.toggleDisponibilidad(id);
      await loadData();
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error('Error al cambiar disponibilidad:', error);
      alert('Error al cambiar la disponibilidad');
    }
  };

  const handleModalSuccess = () => {
    loadData();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTransportista('');
    setFilterTipo('');
    setFilterDisponible('');
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
          <h1 className="text-2xl font-bold text-gray-900">Camiones</h1>
          <p className="text-gray-600 mt-1">Gestión de flota de vehículos</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Nuevo Camión
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por patente, marca, modelo o transportista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={filterTransportista}
              onChange={(e) => setFilterTransportista(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos los transportistas</option>
              {transportistas.map(t => (
                <option key={t._id} value={t._id}>{t.companyName}</option>
              ))}
            </select>

            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos los tipos</option>
              {tiposCamion.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <select
              value={filterDisponible}
              onChange={(e) => setFilterDisponible(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todas las disponibilidades</option>
              <option value="true">Disponibles</option>
              <option value="false">No disponibles</option>
            </select>

            {(filterTransportista || filterTipo || filterDisponible) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transportista
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
              {filteredCamiones.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No se encontraron camiones</p>
                    <p className="text-sm">
                      {searchTerm || filterTransportista || filterTipo || filterDisponible
                        ? 'Intenta con otros filtros de búsqueda'
                        : 'Comienza agregando un nuevo camión'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCamiones.map((camion) => (
                  <tr key={camion._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{camion.patente}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {camion.marca || '-'} {camion.modelo || ''}
                        </div>
                        {camion.año && (
                          <div className="text-xs text-gray-500">Año {camion.año}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {camion.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {camion.capacidad} {camion.unidadCapacidad === 'toneladas' ? 'tn' : camion.unidadCapacidad}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {camion.transportista?.razonSocial || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          camion.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {camion.activo ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          camion.disponible
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {camion.disponible ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleDisponibilidad(camion._id)}
                          className={`p-2 rounded-lg ${
                            camion.disponible
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                          title={camion.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}
                        >
                          {camion.disponible ? (
                            <PowerOff className="w-5 h-5" />
                          ) : (
                            <Power className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(camion)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(camion._id)}
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

        {filteredCamiones.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Mostrando {filteredCamiones.length} de {camiones.length} camiones
            </p>
          </div>
        )}
      </div>

      <CamionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        camion={selectedCamion}
        transportistas={transportistas}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};
