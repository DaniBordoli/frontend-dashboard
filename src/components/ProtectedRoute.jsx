import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  const hasRequiredRole = () => {
    if (!roles || roles.length === 0) return true;
    return roles.includes(user.rol);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRequiredRole()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
