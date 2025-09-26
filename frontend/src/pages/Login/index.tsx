import React from 'react';
import { LoginContainer, LoginCard, FormContainer } from './index.styled';
import { LoginHeader } from './components/LoginHeader';
import { LoginForm } from './components/LoginForm';
import { useLogin } from './hooks/useLogin';

export const Login: React.FC = () => {
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (values: { correo: string; password: string }) => {
    login(values);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader />
        <FormContainer>
          <LoginForm 
            onFinish={handleSubmit} 
            isLoading={isPending} 
          />
        </FormContainer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;