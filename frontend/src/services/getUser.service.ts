// frontend/src/services/getUser.service.ts
import api from '../api/api';

export interface User {
  id_responsable: number;
  nombre: string;
  correo: string;
  estado: string;
  id_role: number;
  cargo: string;
}

export interface UserCreate {
  nombre: string;
  correo: string;
  password: string;
  estado: string;
  id_role: number;
  cargo: string;
}

export interface UserEdit {
  nombre?: string;
  correo?: string;
  password?: string;
  estado?: string;
  id_role?: number;
  cargo?: string;
}

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users/');
    return response.data.data || [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Obtener un usuario por ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

// Crear un nuevo usuario
export const createUser = async (userData: UserCreate): Promise<User> => {
  try {
    const response = await api.post('/users/', userData);
    return response.data.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

// Actualizar un usuario
export const updateUser = async (id: number, userData: UserEdit): Promise<User> => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Eliminar un usuario
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};