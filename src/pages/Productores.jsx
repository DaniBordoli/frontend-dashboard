import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { producerService } from '../services/producer.service';
import { ProductorModal } from '../components/ProductorModal';
import { useLoading } from '../context/LoadingContext';

export const Productores = () => {
  const { showLoading, hideLoading } = useLoading();
  const [productores, setProductores] = useState([]);
  const [filteredProductores, setFilteredProductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductor, setSelectedProductor] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadProductores();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = productores.filter(
        (p) =>
          p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProductores(filtered);
    } else {
      setFilteredProductores(productores);
    }
  }, [searchTerm, productores]);

  const loadProductores = async () => {
    try {
      const data = await producerService.getAll();
      setProductores(data);
      setFilteredProductores(data);
    } catch (error) {
      console.error('Error loading productores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProductor(null);
    setModalOpen(true);
  };

  const handleEdit = (productor) => {
    setSelectedProductor(productor);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      showLoading('Eliminando productor...');
      await producerService.delete(id);
      await loadProductores();
      hideLoading();
      setDeleteConfirm(null);
    } catch (error) {
      hideLoading();
      console.error('Error deleting productor:', error);
      alert('Error al eliminar el productor');
    }
  };

  const handleModalClose = (reload) => {
    setModalOpen(false);
    setSelectedProductor(null);
    if (reload) {
      loadProductores();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productores</h1>
          <p className="text-gray-600 mt-1">Gestión de productores agrícolas</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Productor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por empresa, contacto o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {filteredProductores.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No se encontraron productores' : 'No hay productores registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProductores.map((productor) => (
                  <tr key={productor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{productor.companyName}</div>
                      {productor.cuit && (
                        <div className="text-sm text-gray-500">CUIT: {productor.cuit}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{productor.contactName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {productor.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {productor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {productor.address?.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(productor)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(productor._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductorModal
          productor={selectedProductor}
          onClose={handleModalClose}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este productor? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
