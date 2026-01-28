import { Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Productores } from '../pages/Productores';
import { Transportistas } from '../pages/Transportistas';
import { Camiones } from '../pages/Camiones';
import { Tarifas } from '../pages/Tarifas';
import { Viajes } from '../pages/Viajes';

export const dashboardRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/productores',
    element: <Productores />
  },
  {
    path: '/transportistas',
    element: <Transportistas />
  },
  {
    path: '/camiones',
    element: <Camiones />
  },
  {
    path: '/tarifas',
    element: <Tarifas />
  },
  {
    path: '/viajes',
    element: <Viajes />
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  }
];
