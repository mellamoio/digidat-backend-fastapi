import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authService } from '../../../api/authService';
import type { LoginResponse } from '../types/login.types';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, { correo: string; password: string }>({
    mutationFn: (values) => authService.login(values),
    onSuccess: (data) => {
      if (data?.response_code && data.data?.access_token) {
        localStorage.setItem('access_token', data.data.access_token);
        message.success('¡Bienvenido!');
        navigate('/dashboard');
      } else {
        message.error(data?.message || 'Error en las credenciales');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      message.error('Error al iniciar sesión. Por favor, intente nuevamente.');
    },
  });
};
