import api from './axiosConfig';

export const authService = {
  async login(credentials: { correo: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.response_code) {
      localStorage.setItem("access_token", response.data.data.access_token);
    }
    return response.data;
  },
  
  async refreshToken() {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },
  
  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('access_token');
  },
  
  async getProfile() {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  }
};