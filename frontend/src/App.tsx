import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { Login } from './pages/Login/index';
import { Dashboard } from './pages/Dashboard/index';
import Ajustes from './pages/Ajustes';
import type { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1677ff',
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
            <Route
              path="/digidat/ajustes"
              element={
                <ProtectedRoute>
                  <Ajustes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;