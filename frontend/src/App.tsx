import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { Login } from './pages/Login/index';
import { Dashboard } from './pages/Dashboard/components/index';
import Ajustes from './pages/Ajustes';
import { SateliteProvider } from './context/DigidatContext';
import { useAuth } from './hooks/useAuth';
import type { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  
  // Mostrar loading mientras verifica
  if (isLoading) {
    return <div>Cargando...</div>;
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si requiere admin y no lo es, redirigir a dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <SateliteProvider>
      <QueryClientProvider client={new QueryClient()}>
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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* RUTA PROTEGIDA SOLO PARA ADMINISTRADORES */}
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
    </SateliteProvider>
  );
}

export default App;