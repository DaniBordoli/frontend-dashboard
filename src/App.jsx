import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Unauthorized } from './pages/Unauthorized';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ADMIN_ROLES } from './constants';
import { dashboardRoutes } from './navigation';

function AppContent() {
  const { loading, message } = useLoading();

  return (
    <>
      <LoadingOverlay isLoading={loading} message={message} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute roles={ADMIN_ROLES}>
                <Layout>
                  <Routes>
                    {dashboardRoutes.map((route, index) => (
                      <Route key={index} path={route.path} element={route.element} />
                    ))}
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
