import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <ShieldAlert className="w-16 h-16 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Acceso Denegado
        </h1>

        <p className="text-gray-600 mb-8">
          No tienes los permisos necesarios para acceder a esta página.
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir al Dashboard
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Si necesitas acceso a esta sección, solicita los permisos correspondientes al administrador.
          </p>
        </div>
      </div>
    </div>
  );
};
