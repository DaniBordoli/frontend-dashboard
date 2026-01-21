import { useEffect, useState } from 'react';
import { Users, Truck, MapPin, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { TRIP_STATUS } from '../constants';
import { useLoading } from '../context/LoadingContext';

export const Dashboard = () => {
  const { showLoading, hideLoading } = useLoading();
  const [stats, setStats] = useState({
    productores: 0,
    transportistas: 0,
    viajesActivos: 0,
    viajesPendientes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      showLoading('Cargando estadísticas...');
      const [productores, transportistas, viajes] = await Promise.all([
        api.get('/productores'),
        api.get('/transportistas'),
        api.get('/trips'),
      ]);

      const viajesData = viajes.data?.trips || [];
      const viajesActivos = viajesData.filter((v) =>
        [TRIP_STATUS.EN_CURSO, TRIP_STATUS.EN_ASIGNACION].includes(v.estado)
      ).length || 0;
      const viajesPendientes = viajesData.filter((v) =>
        [TRIP_STATUS.SOLICITADO, TRIP_STATUS.COTIZANDO].includes(v.estado)
      ).length || 0;

      setStats({
        productores: productores.data?.producers?.length || 0,
        transportistas: Array.isArray(transportistas.data) ? transportistas.data.length : 0,
        viajesActivos,
        viajesPendientes,
      });
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Productores',
      value: stats.productores,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Transportistas',
      value: stats.transportistas,
      icon: Truck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Viajes Activos',
      value: stats.viajesActivos,
      icon: MapPin,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Viajes Pendientes',
      value: stats.viajesPendientes,
      icon: AlertCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vista general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <a
              href="/productores"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Gestionar Productores</p>
                  <p className="text-sm text-gray-600">Agregar o editar productores</p>
                </div>
              </div>
            </a>
            <a
              href="/transportistas"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Gestionar Transportistas</p>
                  <p className="text-sm text-gray-600">Agregar o editar transportistas</p>
                </div>
              </div>
            </a>
            <a
              href="/viajes"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Ver Viajes</p>
                  <p className="text-sm text-gray-600">Monitorear viajes activos</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">API Backend</span>
              </div>
              <span className="text-sm text-green-700">Operativo</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Base de Datos</span>
              </div>
              <span className="text-sm text-green-700">Conectado</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">WhatsApp Bot</span>
              </div>
              <span className="text-sm text-gray-600">Pendiente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
