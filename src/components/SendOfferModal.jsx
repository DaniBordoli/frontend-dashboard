import { useState, useEffect } from 'react';
import { X, Send, Users } from 'lucide-react';
import transportistaService from '../services/transportista.service';
import whatsappService from '../services/whatsapp.service';
import { useLoading } from '../context/LoadingContext';
import { useToast } from '../context/ToastContext';

export const SendOfferModal = ({ trip, onClose, onSuccess }) => {
  const { showLoading, hideLoading } = useLoading();
  const { success, error: showError } = useToast();
  const [transportistas, setTransportistas] = useState([]);
  const [selectedTransportistas, setSelectedTransportistas] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransportistas();
  }, []);

  const loadTransportistas = async () => {
    try {
      const data = await transportistaService.getAll();
      // Filtrar solo transportistas activos y disponibles con WhatsApp
      const available = data.filter(t => 
        t.active && 
        t.available && 
        t.whatsappNumber
      );
      setTransportistas(available);
    } catch (error) {
      setError('Error al cargar transportistas');
    }
  };

  const handleToggleTransportista = (id) => {
    setSelectedTransportistas(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (sendToAll) {
      setSelectedTransportistas([]);
      setSendToAll(false);
    } else {
      setSelectedTransportistas(transportistas.map(t => t._id));
      setSendToAll(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!sendToAll && selectedTransportistas.length === 0) {
      setError('Selecciona al menos un transportista');
      return;
    }

    try {
      showLoading('Enviando ofertas por WhatsApp...');
      const result = await whatsappService.sendTripOffer(
        trip._id,
        sendToAll ? [] : selectedTransportistas
      );
      hideLoading();
      
      // Mostrar toast de éxito
      const count = result.results?.filter(r => r.success).length || 0;
      success(`✅ Ofertas enviadas exitosamente a ${count} transportista${count !== 1 ? 's' : ''}`);
      
      // Cerrar modal
      onClose();
      
      // Llamar onSuccess si existe (para refrescar datos)
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      hideLoading();
      showError(err.response?.data?.message || 'Error al enviar ofertas');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Enviar Oferta por WhatsApp</h2>
            <p className="text-sm text-gray-600 mt-1">
              Viaje #{trip.tripNumber} - {trip.origin?.city} → {trip.destination?.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                📱 ¿Cómo funciona?
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Los transportistas recibirán un mensaje de WhatsApp con los detalles del viaje</li>
                <li>• Podrán confirmar respondiendo con "1", "2" o "3"</li>
                <li>• El primer transportista en confirmar será asignado automáticamente</li>
              </ul>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Users className="w-4 h-4" />
                  Seleccionar Transportistas
                </label>
                <button
                  type="button"
                  onClick={handleToggleAll}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {sendToAll ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </button>
              </div>

              {transportistas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No hay transportistas disponibles con WhatsApp configurado</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {transportistas.map((transportista) => (
                    <label
                      key={transportista._id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTransportistas.includes(transportista._id)}
                        onChange={() => handleToggleTransportista(transportista._id)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{transportista.companyName}</p>
                        <p className="text-sm text-gray-700">{transportista.driverName}</p>
                        <p className="text-xs text-gray-500">{transportista.whatsappNumber}</p>
                      </div>
                      {transportista.available && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Disponible
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <strong>Resumen:</strong> Se enviarán {sendToAll ? transportistas.length : selectedTransportistas.length} mensaje(s) de WhatsApp
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!sendToAll && selectedTransportistas.length === 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar Ofertas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
