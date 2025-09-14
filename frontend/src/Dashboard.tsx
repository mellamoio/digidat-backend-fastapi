import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/pages/Dashboard";
import type { JSX } from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
