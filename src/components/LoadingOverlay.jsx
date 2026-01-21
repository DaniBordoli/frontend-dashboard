import { Truck } from 'lucide-react';

export const LoadingOverlay = ({ isLoading, message = 'Cargando...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center max-w-sm">
        <div className="relative mb-6">
          {/* Logo animado */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Truck className="w-16 h-16 text-green-600 animate-bounce" />
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-green-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Nombre de la empresa */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Ruta y Campo</h2>
            <div className="h-1 w-24 bg-green-600 mx-auto mt-2 rounded-full"></div>
          </div>
        </div>

        {/* Spinner */}
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Mensaje */}
        <p className="text-gray-600 text-center font-medium">{message}</p>
      </div>
    </div>
  );
};
