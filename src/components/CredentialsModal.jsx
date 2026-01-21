import { X, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export const CredentialsModal = ({ credentials, producerName, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `Portal de Productores - Ruta y Campo\n\nEmpresa: ${producerName}\nEmail: ${credentials.email}\nContraseña: ${credentials.password}\n\nAccede en: http://localhost:5173`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Acceso Creado</h2>
            <p className="text-sm text-gray-600 mt-1">{producerName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">
                ¡Acceso creado exitosamente!
              </p>
            </div>
            <p className="text-xs text-green-700">
              El productor ya puede iniciar sesión en el portal con estas credenciales.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Email
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-mono text-gray-900">{credentials.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Contraseña
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-mono text-gray-900">{credentials.password}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                URL del Portal
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-mono text-gray-900">http://localhost:5173</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 font-medium mb-1">
              ⚠️ Importante
            </p>
            <p className="text-xs text-yellow-700">
              Guarda estas credenciales ahora. No podrás verlas nuevamente después de cerrar esta ventana.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Todo
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
