import React from 'react';
import { Form, Input, Button } from 'antd';
import type { LoginFormValues } from '../types/login.types';

interface LoginFormProps {
  onFinish: (values: LoginFormValues) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onFinish, isLoading }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item
        label="Correo Electrónico"
        name="correo"
        rules={[
          { 
            required: true, 
            message: 'Por favor ingresa tu correo electrónico' 
          },
          { 
            type: 'email', 
            message: 'Por favor ingresa un correo electrónico válido' 
          }
        ]}
      >
        <Input 
          size="large" 
          placeholder="usuario@ejemplo.com" 
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        rules={[{ 
          required: true, 
          message: 'Por favor ingresa tu contraseña' 
        }]}
      >
        <Input.Password 
          size="large" 
          placeholder="••••••••"
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          className="login-form-button"
          loading={isLoading}
          size="large"
          block
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </Form.Item>
    </Form>
  );
};
