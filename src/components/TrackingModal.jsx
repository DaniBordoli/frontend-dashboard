import { useEffect, useState } from 'react';
import { X, Navigation, Clock, Truck, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxNmEzNGEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTQgMThWNmEyIDIgMCAwIDAtMi0ySDRhMiAyIDAgMCAwLTIgMnYxMWExIDEgMCAwIDAgMSAxaDIiLz48cGF0aCBkPSJNMTUgMThoOSIvPjxwYXRoIGQ9Ik0xOSAxOGgyIi8+PHBhdGggZD0iTTE0IDE4aDMiLz48Y2lyY2xlIGN4PSI3IiBjeT0iMTgiIHI9IjIiLz48Y2lyY2xlIGN4PSIxNyIgY3k9IjE4IiByPSIyIi8+PHBhdGggZD0iTTE1IDZoNWwyIDd2NWgtMiIvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const TrackingModal = ({ viaje, onClose }) => {
  const [ubicacionActual, setUbicacionActual] = useState(viaje.ubicacionActual);
  const [rutaCompleta, setRutaCompleta] = useState(viaje.rutaCompleta || []);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    // Configurar centro del mapa
    if (viaje.origen?.coordenadas && viaje.destino?.coordenadas) {
      const origenLat = viaje.origen.coordenadas.latitud;
      const origenLng = viaje.origen.coordenadas.longitud;
      const destinoLat = viaje.destino.coordenadas.latitud;
      const destinoLng = viaje.destino.coordenadas.longitud;
      
      setMapCenter([
        (origenLat + destinoLat) / 2,
        (origenLng + destinoLng) / 2
      ]);
    }

    // Conectar a WebSocket para actualizaciones en tiempo real
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.emit('join-trip', viaje._id);
    
    socket.on('location-updated', (data) => {
      if (data.viajeId === viaje._id) {
        setUbicacionActual(data.ubicacion);
        setRutaCompleta(prev => [...prev, {
          latitud: data.ubicacion.latitud,
          longitud: data.ubicacion.longitud,
          timestamp: new Date()
        }]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [viaje._id]);

  // Convertir ruta completa a formato Leaflet
  const routeCoordinates = rutaCompleta.map(punto => [punto.latitud, punto.longitud]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-green-600 text-white">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Tracking en Vivo</h2>
              <p className="text-sm text-green-100">Viaje #{viaje.numeroViaje}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Mapa */}
          {mapCenter && viaje.origen?.coordenadas && viaje.destino?.coordenadas && (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="h-96">
                <MapContainer 
                  center={mapCenter} 
                  zoom={8} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Ruta recorrida */}
                  {routeCoordinates.length > 0 && (
                    <Polyline 
                      positions={routeCoordinates} 
                      color="#16a34a" 
                      weight={4}
                      opacity={0.7}
                    />
                  )}
                  
                  {/* Marcador Origen */}
                  <Marker position={[viaje.origen.coordenadas.latitud, viaje.origen.coordenadas.longitud]}>
                    <Popup>
                      <strong>📍 Origen</strong><br/>
                      {viaje.origen.ciudad}, {viaje.origen.provincia}
                    </Popup>
                  </Marker>
                  
                  {/* Marcador Destino */}
                  <Marker position={[viaje.destino.coordenadas.latitud, viaje.destino.coordenadas.longitud]}>
                    <Popup>
                      <strong>🎯 Destino</strong><br/>
                      {viaje.destino.ciudad}, {viaje.destino.provincia}
                    </Popup>
                  </Marker>
                  
                  {/* Marcador Ubicación Actual */}
                  {ubicacionActual && (
                    <Marker 
                      position={[ubicacionActual.latitud, ubicacionActual.longitud]}
                      icon={truckIcon}
                    >
                      <Popup>
                        <strong>🚛 Ubicación Actual</strong><br/>
                        Última actualización: {new Date(ubicacionActual.ultimaActualizacion).toLocaleString('es-AR')}
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>
          )}

          {/* Información del viaje */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Detalles del viaje */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Detalles del Viaje
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Origen:</span>
                  <span className="font-medium text-gray-900">
                    {viaje.origen?.ciudad}, {viaje.origen?.provincia}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destino:</span>
                  <span className="font-medium text-gray-900">
                    {viaje.destino?.ciudad}, {viaje.destino?.provincia}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    {viaje.estado}
                  </span>
                </div>
                {viaje.subEstado && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub-estado:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {viaje.subEstado}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Estado del tracking */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-green-600" />
                Estado del Tracking
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    viaje.trackingActivo 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {viaje.trackingActivo ? '✅ Activo' : '⏸️ Inactivo'}
                  </span>
                </div>
                {ubicacionActual && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última actualización:</span>
                      <span className="font-medium text-gray-900 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ubicacionActual.ultimaActualizacion).toLocaleTimeString('es-AR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Puntos registrados:</span>
                      <span className="font-medium text-gray-900">
                        {rutaCompleta.length}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Alerta si tracking inactivo */}
          {!viaje.trackingActivo && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ El tracking está inactivo. El transportista debe abrir el link de tracking para comenzar a enviar su ubicación.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
