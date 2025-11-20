import api from '../api/api';
import type { User } from '../types/user';

type EstadoType = 'ACTIVO' | 'INACTIVO';

interface UserCreate {
  nombre: string;
  correo: string;
  id_role: number;
  password: string;
  estado?: EstadoType;
  cargo?: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

class UserService {
  /**
   * Obtener todos los usuarios
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get<ApiResponse<User[]>>('/v1/users/');
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>(`/v1/users/${id}/`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }

  async createUser(userData: Omit<UserCreate, 'password'> & { password?: string }): Promise<User> {
    try {
      const userToCreate = {
        ...userData,
        password: userData.password || '12345678',
        id_role: userData.id_role || 2,
        estado: userData.estado || 'ACTIVO',
      };
      
      console.log('Sending user data:', userToCreate);
      const response = await api.post<ApiResponse<User>>('/v1/users/', userToCreate);  // ← Corregido
      return response.data.data;
    } catch (error: any) {
      console.error('Error al crear el usuario:', error.response?.data || error.message);
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => 
          `${err.loc?.join('.') || 'Error'}: ${err.msg || err.message || 'Error de validación'}`
        ).join('; ');
        throw new Error(`Error de validación: ${errorMessages}`);
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error(error.message || 'Error al crear el usuario');
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(`/v1/users/${id}/`, userData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/v1/users/${id}/`);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }
}

export const userService = new UserService();