import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import transportistaService from '../services/transportista.service';
import { useLoading } from '../context/LoadingContext';

export const TransportistaModal = ({ isOpen, onClose, transportista, onSuccess }) => {
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    cuit: '',
    whatsappNumber: '',
    email: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (transportista) {
      setFormData({
        companyName: transportista.companyName || '',
        name: transportista.name || '',
        cuit: transportista.cuit || '',
        whatsappNumber: transportista.whatsappNumber || '',
        email: transportista.email || '',
        notes: transportista.notes || ''
      });
    } else {
      setFormData({
        companyName: '',
        name: '',
        cuit: '',
        whatsappNumber: '',
        email: '',
        notes: ''
      });
    }
    setError('');
  }, [transportista, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      showLoading(transportista ? 'Actualizando transportista...' : 'Creando transportista...');
      if (transportista) {
        await transportistaService.update(transportista._id, formData);
      } else {
        await transportistaService.create(formData);
      }
      hideLoading();
      onSuccess();
      onClose();
    } catch (err) {
      hideLoading();
      setError(err.response?.data?.message || 'Error al guardar el transportista');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {transportista ? 'Editar Transportista' : 'Nuevo Transportista'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razón Social *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Transportista
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CUIT *
              </label>
              <input
                type="text"
                name="cuit"
                value={formData.cuit}
                onChange={handleChange}
                required
                placeholder="20-12345678-9"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp *
              </label>
              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                placeholder="+5491112345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: +54 seguido del código de área y número (sin espacios ni guiones)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

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
