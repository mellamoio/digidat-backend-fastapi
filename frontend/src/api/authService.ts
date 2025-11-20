import api from './axiosConfig';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  correo: string;
  role: number;
  status: string;
  exp: number;
}

export const authService = {
  async login(credentials: { correo: string; password: string }) {
    localStorage.clear();
    
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.response_code) {
      const token = response.data.data.access_token;
      localStorage.setItem("access_token", token);
      
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        const userData = {
          id_user: parseInt(decoded.sub),
          email: decoded.correo,
          id_role: decoded.role,
          status: decoded.status,
          name: decoded.correo.split('@')[0]
        };
        localStorage.setItem("user", JSON.stringify(userData));
        console.log('Usuario guardado:', userData);
      } catch (error) {
        console.error('Error al decodificar token:', error);
      }
    }
    
    return response.data;
  },
  
  async refreshToken() {
    const response = await api.post('/auth/refresh-token');
    if (response.data.data?.access_token) {
      localStorage.setItem("access_token", response.data.data.access_token);
    }
    return response.data;
  },
  
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.clear();
    }
  }
};