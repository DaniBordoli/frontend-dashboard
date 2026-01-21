import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
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
        <AppContent />
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
