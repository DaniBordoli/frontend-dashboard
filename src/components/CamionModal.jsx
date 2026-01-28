import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import camionService from '../services/camion.service';
import { useLoading } from '../context/LoadingContext';

export const CamionModal = ({ isOpen, onClose, camion, transportistas, onSuccess }) => {
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    transportistaId: '',
    patente: '',
    marca: '',
    modelo: '',
    año: '',
    tipo: 'chasis',
    capacidad: '',
    unidadCapacidad: 'toneladas',
    seguro: {
      compania: '',
      numeroPoliza: '',
      vencimiento: ''
    },
    vtv: {
      fecha: '',
      vencimiento: ''
    },
    disponible: true,
    activo: true,
    notas: ''
  });
  const [error, setError] = useState('');

  const tiposCamion = [
    { value: 'chasis', label: 'Chasis' },
    { value: 'acoplado', label: 'Acoplado' },
    { value: 'batea', label: 'Batea' },
    { value: 'tolva', label: 'Tolva' },
    { value: 'tanque', label: 'Tanque' },
    { value: 'otro', label: 'Otro' }
  ];

  const unidadesCapacidad = [
    { value: 'toneladas', label: 'Toneladas' },
    { value: 'metros_cubicos', label: 'Metros Cúbicos' },
    { value: 'litros', label: 'Litros' }
  ];

  useEffect(() => {
    if (camion) {
      setFormData({
        transportistaId: camion.transportistaId || '',
        patente: camion.patente || '',
        marca: camion.marca || '',
        modelo: camion.modelo || '',
        año: camion.año || '',
        tipo: camion.tipo || 'chasis',
        capacidad: camion.capacidad || '',
        unidadCapacidad: camion.unidadCapacidad || 'toneladas',
        seguro: {
          compania: camion.seguro?.compania || '',
          numeroPoliza: camion.seguro?.numeroPoliza || '',
          vencimiento: camion.seguro?.vencimiento ? camion.seguro.vencimiento.split('T')[0] : ''
        },
        vtv: {
          fecha: camion.vtv?.fecha ? camion.vtv.fecha.split('T')[0] : '',
          vencimiento: camion.vtv?.vencimiento ? camion.vtv.vencimiento.split('T')[0] : ''
        },
        disponible: camion.disponible !== undefined ? camion.disponible : true,
        activo: camion.activo !== undefined ? camion.activo : true,
        notas: camion.notas || ''
      });
    } else {
      setFormData({
        transportistaId: '',
        patente: '',
        marca: '',
        modelo: '',
        año: '',
        tipo: 'chasis',
        capacidad: '',
        unidadCapacidad: 'toneladas',
        seguro: {
          compania: '',
          numeroPoliza: '',
          vencimiento: ''
        },
        vtv: {
          fecha: '',
          vencimiento: ''
        },
        disponible: true,
        activo: true,
        notas: ''
      });
    }
    setError('');
  }, [camion, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.transportistaId) {
      setError('Debe seleccionar un transportista');
      return;
    }

    try {
      showLoading(camion ? 'Actualizando camión...' : 'Creando camión...');
      if (camion) {
        await camionService.update(camion._id, formData);
      } else {
        await camionService.create(formData);
      }
      hideLoading();
      onSuccess();
      onClose();
    } catch (err) {
      hideLoading();
      setError(err.response?.data?.message || 'Error al guardar el camión');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {camion ? 'Editar Camión' : 'Nuevo Camión'}
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

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transportista *
                </label>
                <select
                  name="transportistaId"
                  value={formData.transportistaId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar transportista</option>
                  {transportistas.map(t => (
                    <option key={t._id} value={t._id}>{t.companyName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patente *
                </label>
                <input
                  type="text"
                  name="patente"
                  value={formData.patente}
                  onChange={handleChange}
                  required
                  placeholder="ABC123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  placeholder="Mercedes Benz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo
                </label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  placeholder="Actros 2651"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año
                </label>
                <input
                  type="number"
                  name="año"
                  value={formData.año}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {tiposCamion.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad *
                </label>
                <input
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad de Capacidad *
                </label>
                <select
                  name="unidadCapacidad"
                  value={formData.unidadCapacidad}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {unidadesCapacidad.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Seguro</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compañía
                </label>
                <input
                  type="text"
                  name="seguro.compania"
                  value={formData.seguro.compania}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Póliza
                </label>
                <input
                  type="text"
                  name="seguro.numeroPoliza"
                  value={formData.seguro.numeroPoliza}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vencimiento
                </label>
                <input
                  type="date"
                  name="seguro.vencimiento"
                  value={formData.seguro.vencimiento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">VTV</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de VTV
                </label>
                <input
                  type="date"
                  name="vtv.fecha"
                  value={formData.vtv.fecha}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vencimiento VTV
                </label>
                <input
                  type="date"
                  name="vtv.vencimiento"
                  value={formData.vtv.vencimiento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado y Notas</h3>
            <div className="space-y-4">
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Activo</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={formData.disponible}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disponible</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Observaciones adicionales sobre el camión..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
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
              {camion ? 'Actualizar' : 'Crear'} Camión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
