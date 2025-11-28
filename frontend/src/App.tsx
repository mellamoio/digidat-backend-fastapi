import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { Login } from './pages/Login/index';
import { Dashboard } from './pages/Dashboard/components/index';
import Ajustes from './pages/Ajustes';
import Detalles from './pages/Dashboard/components/detalles';
import { SateliteProvider } from './context/DigidatContext';
import { ObrasProvider } from './context/ObrasContext';
import { useAuth } from './hooks/useAuth';
import type { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const queryClient = new QueryClient();

function App() {
  return (
    <SateliteProvider>
      <ObrasProvider>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#722AE9',
              },
            }}
          >
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/obras/:id"
                  element={
                    <ProtectedRoute>
                      <Detalles />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/ajustes"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Ajustes />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </ConfigProvider>
        </QueryClientProvider>
      </ObrasProvider>
    </SateliteProvider>
  );
}

export default App;